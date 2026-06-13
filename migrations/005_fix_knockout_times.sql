-- ============================================
-- 修复淘汰赛及部分比赛时间至FIFA官方公布的UTC时间
-- ============================================
-- 数据来源: FIFA官方赛程 (fifa.com/scores-fixtures)
-- 交叉验证: FOX Sports, ESPN, CBS Sports
-- 生成日期: 2026-06-13
-- ============================================
-- 问题说明:
--   1. 小组赛72场中有71场时间正确（004_fix_match_times.sql已修正）
--   2. ma1开幕战差1小时: DB=17:00 UTC, 实际应为18:00 UTC
--      (墨西哥城13:00 CDT = UTC-5 → 18:00 UTC)
--   3. 全部淘汰赛(32场)的时间是错误的，数据库存的是种子数据中的占位时间
--      而非FIFA官方公布的实际开球时间
-- ============================================

-- === 小组赛修正 (1场) ===
UPDATE matches SET match_date = '2026-06-11 18:00' WHERE id = 'ma1'; -- Mexico vs South Africa (Mexico City 13:00 CDT)

-- === 1/16决赛 (Round of 32) - 16场 ===
UPDATE matches SET match_date = '2026-06-28 19:00' WHERE id = 'r32_1';  -- 2A vs 2B (LA 12:00 PDT)
UPDATE matches SET match_date = '2026-06-29 17:00' WHERE id = 'r32_2';  -- 1C vs 2F (Houston 12:00 CDT)
UPDATE matches SET match_date = '2026-06-29 20:30' WHERE id = 'r32_3';  -- 1E vs 3ABCDF (Boston 16:30 EDT)
UPDATE matches SET match_date = '2026-06-30 01:00' WHERE id = 'r32_4';  -- 1F vs 2C (Monterrey 20:00 CDT Jun29)
UPDATE matches SET match_date = '2026-06-30 17:00' WHERE id = 'r32_5';  -- 2E vs 2I (Dallas 12:00 CDT)
UPDATE matches SET match_date = '2026-06-30 21:00' WHERE id = 'r32_6';  -- 1I vs 3CDFGH (NYNJ 17:00 EDT)
UPDATE matches SET match_date = '2026-07-01 01:00' WHERE id = 'r32_7';  -- 1A vs 3CEFHI (Mexico City 19:00 CDT Jun30)
UPDATE matches SET match_date = '2026-07-01 16:00' WHERE id = 'r32_8';  -- 1L vs 3EHIJK (Atlanta 12:00 EDT)
UPDATE matches SET match_date = '2026-07-01 20:00' WHERE id = 'r32_9';  -- 1G vs 3AEHIJ (Seattle 13:00 PDT)
UPDATE matches SET match_date = '2026-07-02 00:00' WHERE id = 'r32_10'; -- 1D vs 3BEFIJ (SF Bay 17:00 PDT Jul1)
UPDATE matches SET match_date = '2026-07-02 17:00' WHERE id = 'r32_11'; -- 2K vs 2L (Toronto 13:00 EDT)
UPDATE matches SET match_date = '2026-07-02 20:00' WHERE id = 'r32_12'; -- 1H vs 2J (LA 13:00 PDT)
UPDATE matches SET match_date = '2026-07-03 00:00' WHERE id = 'r32_13'; -- 1B vs 3EFGIJ (Vancouver 17:00 PDT Jul2)
UPDATE matches SET match_date = '2026-07-03 17:00' WHERE id = 'r32_14'; -- 2D vs 2G (Dallas 12:00 CDT)
UPDATE matches SET match_date = '2026-07-03 22:00' WHERE id = 'r32_15'; -- 1J vs 2H (Miami 18:00 EDT)
UPDATE matches SET match_date = '2026-07-04 00:30' WHERE id = 'r32_16'; -- 1K vs 3DEIJL (Kansas City 19:30 CDT Jul3)

-- === 1/8决赛 (Round of 16) - 8场 ===
UPDATE matches SET match_date = '2026-07-04 20:00' WHERE id = 'r16_1'; -- W74 vs W77 (Philadelphia 16:00 EDT)
UPDATE matches SET match_date = '2026-07-04 23:00' WHERE id = 'r16_2'; -- W73 vs W75 (Houston 18:00 CDT)
UPDATE matches SET match_date = '2026-07-05 20:00' WHERE id = 'r16_3'; -- W76 vs W78 (NYNJ 16:00 EDT)
UPDATE matches SET match_date = '2026-07-05 23:00' WHERE id = 'r16_4'; -- W79 vs W80 (Mexico City 17:00 CDT)
UPDATE matches SET match_date = '2026-07-06 20:00' WHERE id = 'r16_5'; -- W83 vs W84 (Dallas 15:00 CDT)
UPDATE matches SET match_date = '2026-07-06 23:00' WHERE id = 'r16_6'; -- W81 vs W82 (Seattle 16:00 PDT)
UPDATE matches SET match_date = '2026-07-07 16:00' WHERE id = 'r16_7'; -- W86 vs W88 (Atlanta 12:00 EDT)
UPDATE matches SET match_date = '2026-07-07 19:00' WHERE id = 'r16_8'; -- W85 vs W87 (Vancouver 12:00 PDT)

-- === 1/4决赛 (Quarter-finals) - 4场 ===
UPDATE matches SET match_date = '2026-07-09 20:00' WHERE id = 'qf1'; -- W89 vs W90 (Boston 16:00 EDT)
UPDATE matches SET match_date = '2026-07-10 20:00' WHERE id = 'qf2'; -- W93 vs W94 (LA 13:00 PDT)
UPDATE matches SET match_date = '2026-07-11 20:00' WHERE id = 'qf3'; -- W91 vs W92 (Miami 16:00 EDT)
UPDATE matches SET match_date = '2026-07-11 23:00' WHERE id = 'qf4'; -- W95 vs W96 (Kansas City 18:00 CDT)

-- === 半决赛 (Semi-finals) - 2场 ===
UPDATE matches SET match_date = '2026-07-14 19:00' WHERE id = 'sf1'; -- W97 vs W98 (Dallas 14:00 CDT)
UPDATE matches SET match_date = '2026-07-15 19:00' WHERE id = 'sf2'; -- W99 vs W100 (Atlanta 15:00 EDT)

-- === 三四名决赛 (Third Place) ===
UPDATE matches SET match_date = '2026-07-18 21:00' WHERE id = 'tp1'; -- (Miami 17:00 EDT)

-- === 决赛 (Final) ===
UPDATE matches SET match_date = '2026-07-19 19:00' WHERE id = 'fn1'; -- (NYNJ 15:00 EDT)
