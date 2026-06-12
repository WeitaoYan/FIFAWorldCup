/**
 * 比赛结果更新脚本
 * 用法: node scripts/update-score.js
 *
 * 功能:
 *   1. 查看待更新比赛列表
 *   2. 更新比赛比分
 *   3. 触发计分
 *
 * 环境要求:
 *   需先配置 wrangler.toml 中的 D1 数据库 binding
 *   通过 wrangler d1 execute 执行 SQL
 */

const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(q) {
  return new Promise((r) => rl.question(q, r));
}

function runSQL(sql, remote = true) {
  const flag = remote ? "--remote" : "--local";
  const cmd = `npx wrangler d1 execute fifa-db ${flag} --command "${sql.replace(/"/g, '\\"')}"`;
  console.log(`\n> ${cmd}\n`);
  try {
    const out = execSync(cmd, { encoding: "utf-8", cwd: __dirname + "/.." });
    console.log(out);
    return out;
  } catch (e) {
    console.error(e.stderr || e.message);
    return null;
  }
}

async function main() {
  console.log(`
╔══════════════════════════════════════════╗
║     2026 FIFA World Cup - 比分更新工具     ║
╚══════════════════════════════════════════╝
`);

  const env = await ask("目标环境? (1=remote/生产, 2=local/开发) [1]: ") || "1";
  const remote = env === "1";

  while (true) {
    console.log("\n=== 操作菜单 ===");
    console.log("1. 查看所有 scheduled 比赛");
    console.log("2. 查看已结束比赛");
    console.log("3. 更新比赛比分");
    console.log("4. 批量更新某组的比赛");
    console.log("5. 退出");

    const choice = await ask("\n选择 (1-5): ");

    if (choice === "1") {
      const sql = `SELECT id, match_date, home_team, away_team, stage, group_name FROM matches WHERE status = 'scheduled' ORDER BY match_date ASC LIMIT 50;`;
      const out = runSQL(sql, remote);
      if (out) {
        const json = extractJSON(out);
        if (json?.length) {
          console.log(`\n共 ${json.length} 场未开始比赛:\n`);
          json.forEach((m, i) => {
            console.log(`  ${String(i + 1).padStart(2)}. [${m.id}] ${m.match_date} | ${m.home_team} vs ${m.away_team} (${m.stage}${m.group_name ? " " + m.group_name : ""})`);
          });
        }
      }
    } else if (choice === "2") {
      const sql = `SELECT id, match_date, home_team, away_team, home_score, away_score, stage FROM matches WHERE status = 'finished' ORDER BY match_date DESC LIMIT 30;`;
      const out = runSQL(sql, remote);
      if (out) {
        const json = extractJSON(out);
        if (json?.length) {
          json.forEach((m) => {
            console.log(`  [${m.id}] ${m.home_team} ${m.home_score}-${m.away_score} ${m.away_team} (${m.match_date})`);
          });
        } else {
          console.log("  暂无已结束比赛");
        }
      }
    } else if (choice === "3") {
      const matchId = await ask("比赛ID (如 ma1): ");
      const homeScore = await ask("主队进球: ");
      const awayScore = await ask("客队进球: ");

      if (!matchId || isNaN(homeScore) || isNaN(awayScore)) {
        console.log("输入无效，跳过");
        continue;
      }

      console.log(`\n即将更新: ${matchId} → ${homeScore}-${awayScore}`);
      const confirm = await ask("确认? (y/n) [n]: ");

      if (confirm.toLowerCase() === "y") {
        const sql = `UPDATE matches SET home_score = ${homeScore}, away_score = ${awayScore}, status = 'finished' WHERE id = '${matchId}' AND status = 'scheduled';`;
        runSQL(sql, remote);

        const triggerScore = await ask("\n立即触发计分? (y/n) [y]: ") || "y";
        if (triggerScore.toLowerCase() === "y") {
          const baseUrl = remote
            ? "https://fifa-world-cup-2026.你的域名.workers.dev"
            : "http://127.0.0.1:8788";
          console.log(`\n请访问以下 URL 触发计分（或稍后手动调用）:`);
          console.log(`  GET ${baseUrl}/api/score/${matchId}`);
        }
      }
    } else if (choice === "4") {
      const group = (await ask("小组名 (A-L): ")).toUpperCase();
      if (!group.match(/^[A-L]$/)) { console.log("无效小组"); continue; }

      const sql = `SELECT id, match_date, home_team, away_team FROM matches WHERE group_name = '${group}' AND status = 'scheduled' ORDER BY match_date ASC;`;
      const out = runSQL(sql, remote);
      if (!out) continue;

      const json = extractJSON(out);
      if (!json?.length) { console.log("该组没有未开始的比赛"); continue; }

      console.log(`\n--- Group ${group} ---`);
      json.forEach((m, i) => {
        console.log(`  ${i + 1}. [${m.id}] ${m.home_team} vs ${m.away_team} (${m.match_date})`);
      });

      for (const m of json) {
        const hs = await ask(`\n${m.home_team} vs ${m.away_team} - 主队进球: `);
        const as = await ask("客队进球: ");
        if (isNaN(hs) || isNaN(as)) { console.log("跳过"); continue; }
        const usql = `UPDATE matches SET home_score = ${hs}, away_score = ${as}, status = 'finished' WHERE id = '${m.id}';`;
        runSQL(usql, remote);
      }

      console.log(`\nGroup ${group} 全部更新完成`);
    } else if (choice === "5") {
      break;
    }
  }

  rl.close();
}

function extractJSON(output) {
  try {
    const lines = output.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        return JSON.parse(trimmed);
      }
    }
  } catch {}
  return null;
}

main().catch(console.error);
