-- ============================================
-- Production Seed Data: 2026 FIFA World Cup
-- All matches scheduled, no fake scores
-- ============================================

-- ==================== STANDINGS (48 Teams, 12 Groups) ====================

INSERT OR IGNORE INTO standings (id, team_name, group_name) VALUES
-- Group A: Hosts
('sa1', 'USA', 'A'), ('sa2', 'Canada', 'A'), ('sa3', 'Ecuador', 'A'), ('sa4', 'Senegal', 'A'),
-- Group B
('sb1', 'Mexico', 'B'), ('sb2', 'Japan', 'B'), ('sb3', 'Serbia', 'B'), ('sb4', 'Algeria', 'B'),
-- Group C
('sc1', 'Brazil', 'C'), ('sc2', 'Croatia', 'C'), ('sc3', 'South Korea', 'C'), ('sc4', 'Saudi Arabia', 'C'),
-- Group D
('sd1', 'Argentina', 'D'), ('sd2', 'Denmark', 'D'), ('sd3', 'Nigeria', 'D'), ('sd4', 'Australia', 'D'),
-- Group E
('se1', 'England', 'E'), ('se2', 'Turkey', 'E'), ('se3', 'Iran', 'E'), ('se4', 'Cameroon', 'E'),
-- Group F
('sf1', 'France', 'F'), ('sf2', 'Portugal', 'F'), ('sf3', 'Morocco', 'F'), ('sf4', 'Tunisia', 'F'),
-- Group G
('sg1', 'Spain', 'G'), ('sg2', 'Uruguay', 'G'), ('sg3', 'Ghana', 'G'), ('sg4', 'Costa Rica', 'G'),
-- Group H
('sh1', 'Germany', 'H'), ('sh2', 'Switzerland', 'H'), ('sh3', 'Poland', 'H'), ('sh4', 'Iraq', 'H'),
-- Group I
('si1', 'Italy', 'I'), ('si2', 'Colombia', 'I'), ('si3', 'Egypt', 'I'), ('si4', 'UAE', 'I'),
-- Group J
('sj1', 'Belgium', 'J'), ('sj2', 'Chile', 'J'), ('sj3', 'Sweden', 'J'), ('sj4', 'Qatar', 'J'),
-- Group K
('sk1', 'Netherlands', 'K'), ('sk2', 'Austria', 'K'), ('sk3', 'Mali', 'K'), ('sk4', 'Panama', 'K'),
-- Group L
('sl1', 'Czech Republic', 'L'), ('sl2', 'Ukraine', 'L'), ('sl3', 'Ivory Coast', 'L'), ('sl4', 'New Zealand', 'L');

-- ==================== MATCHES ====================
-- 72 Group Stage + 32 Knockout = 104 matches total
-- All status = 'scheduled', no scores

-- Group A
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('ma1', 'USA', 'Ecuador', '2026-06-11 16:00', 'group', 'A', 'scheduled'),
('ma2', 'Canada', 'Senegal', '2026-06-11 19:00', 'group', 'A', 'scheduled'),
('ma3', 'USA', 'Senegal', '2026-06-16 16:00', 'group', 'A', 'scheduled'),
('ma4', 'Canada', 'Ecuador', '2026-06-16 19:00', 'group', 'A', 'scheduled'),
('ma5', 'USA', 'Canada', '2026-06-21 16:00', 'group', 'A', 'scheduled'),
('ma6', 'Senegal', 'Ecuador', '2026-06-21 19:00', 'group', 'A', 'scheduled');

-- Group B
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mb1', 'Mexico', 'Japan', '2026-06-12 13:00', 'group', 'B', 'scheduled'),
('mb2', 'Serbia', 'Algeria', '2026-06-12 16:00', 'group', 'B', 'scheduled'),
('mb3', 'Mexico', 'Algeria', '2026-06-17 13:00', 'group', 'B', 'scheduled'),
('mb4', 'Serbia', 'Japan', '2026-06-17 16:00', 'group', 'B', 'scheduled'),
('mb5', 'Mexico', 'Serbia', '2026-06-22 13:00', 'group', 'B', 'scheduled'),
('mb6', 'Algeria', 'Japan', '2026-06-22 16:00', 'group', 'B', 'scheduled');

-- Group C
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mc1', 'Brazil', 'South Korea', '2026-06-12 19:00', 'group', 'C', 'scheduled'),
('mc2', 'Croatia', 'Saudi Arabia', '2026-06-13 13:00', 'group', 'C', 'scheduled'),
('mc3', 'Brazil', 'Saudi Arabia', '2026-06-18 13:00', 'group', 'C', 'scheduled'),
('mc4', 'Croatia', 'South Korea', '2026-06-18 16:00', 'group', 'C', 'scheduled'),
('mc5', 'Brazil', 'Croatia', '2026-06-23 13:00', 'group', 'C', 'scheduled'),
('mc6', 'Saudi Arabia', 'South Korea', '2026-06-23 16:00', 'group', 'C', 'scheduled');

-- Group D
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('md1', 'Argentina', 'Nigeria', '2026-06-13 16:00', 'group', 'D', 'scheduled'),
('md2', 'Denmark', 'Australia', '2026-06-13 19:00', 'group', 'D', 'scheduled'),
('md3', 'Argentina', 'Australia', '2026-06-18 19:00', 'group', 'D', 'scheduled'),
('md4', 'Denmark', 'Nigeria', '2026-06-19 13:00', 'group', 'D', 'scheduled'),
('md5', 'Argentina', 'Denmark', '2026-06-24 13:00', 'group', 'D', 'scheduled'),
('md6', 'Australia', 'Nigeria', '2026-06-24 16:00', 'group', 'D', 'scheduled');

-- Group E
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('me1', 'England', 'Iran', '2026-06-14 13:00', 'group', 'E', 'scheduled'),
('me2', 'Turkey', 'Cameroon', '2026-06-14 16:00', 'group', 'E', 'scheduled'),
('me3', 'England', 'Cameroon', '2026-06-19 16:00', 'group', 'E', 'scheduled'),
('me4', 'Turkey', 'Iran', '2026-06-19 19:00', 'group', 'E', 'scheduled'),
('me5', 'England', 'Turkey', '2026-06-24 19:00', 'group', 'E', 'scheduled'),
('me6', 'Cameroon', 'Iran', '2026-06-25 13:00', 'group', 'E', 'scheduled');

-- Group F
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mf1', 'France', 'Morocco', '2026-06-14 19:00', 'group', 'F', 'scheduled'),
('mf2', 'Portugal', 'Tunisia', '2026-06-15 13:00', 'group', 'F', 'scheduled'),
('mf3', 'France', 'Tunisia', '2026-06-20 13:00', 'group', 'F', 'scheduled'),
('mf4', 'Portugal', 'Morocco', '2026-06-20 16:00', 'group', 'F', 'scheduled'),
('mf5', 'France', 'Portugal', '2026-06-25 16:00', 'group', 'F', 'scheduled'),
('mf6', 'Tunisia', 'Morocco', '2026-06-25 19:00', 'group', 'F', 'scheduled');

-- Group G
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mg1', 'Spain', 'Ghana', '2026-06-15 16:00', 'group', 'G', 'scheduled'),
('mg2', 'Uruguay', 'Costa Rica', '2026-06-15 19:00', 'group', 'G', 'scheduled'),
('mg3', 'Spain', 'Costa Rica', '2026-06-20 19:00', 'group', 'G', 'scheduled'),
('mg4', 'Uruguay', 'Ghana', '2026-06-21 13:00', 'group', 'G', 'scheduled'),
('mg5', 'Spain', 'Uruguay', '2026-06-26 13:00', 'group', 'G', 'scheduled'),
('mg6', 'Costa Rica', 'Ghana', '2026-06-26 16:00', 'group', 'G', 'scheduled');

-- Group H
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mh1', 'Germany', 'Poland', '2026-06-16 13:00', 'group', 'H', 'scheduled'),
('mh2', 'Switzerland', 'Iraq', '2026-06-16 19:00', 'group', 'H', 'scheduled'),
('mh3', 'Germany', 'Iraq', '2026-06-21 19:00', 'group', 'H', 'scheduled'),
('mh4', 'Switzerland', 'Poland', '2026-06-22 16:00', 'group', 'H', 'scheduled'),
('mh5', 'Germany', 'Switzerland', '2026-06-26 19:00', 'group', 'H', 'scheduled'),
('mh6', 'Iraq', 'Poland', '2026-06-27 13:00', 'group', 'H', 'scheduled');

-- Group I
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mi1', 'Italy', 'Egypt', '2026-06-17 19:00', 'group', 'I', 'scheduled'),
('mi2', 'Colombia', 'UAE', '2026-06-18 16:00', 'group', 'I', 'scheduled'),
('mi3', 'Italy', 'UAE', '2026-06-22 19:00', 'group', 'I', 'scheduled'),
('mi4', 'Colombia', 'Egypt', '2026-06-23 16:00', 'group', 'I', 'scheduled'),
('mi5', 'Italy', 'Colombia', '2026-06-27 16:00', 'group', 'I', 'scheduled'),
('mi6', 'UAE', 'Egypt', '2026-06-27 19:00', 'group', 'I', 'scheduled');

-- Group J
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mj1', 'Belgium', 'Sweden', '2026-06-12 16:00', 'group', 'J', 'scheduled'),
('mj2', 'Chile', 'Qatar', '2026-06-13 16:00', 'group', 'J', 'scheduled'),
('mj3', 'Belgium', 'Qatar', '2026-06-18 13:00', 'group', 'J', 'scheduled'),
('mj4', 'Chile', 'Sweden', '2026-06-19 16:00', 'group', 'J', 'scheduled'),
('mj5', 'Belgium', 'Chile', '2026-06-24 16:00', 'group', 'J', 'scheduled'),
('mj6', 'Qatar', 'Sweden', '2026-06-25 13:00', 'group', 'J', 'scheduled');

-- Group K
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mk1', 'Netherlands', 'Mali', '2026-06-14 16:00', 'group', 'K', 'scheduled'),
('mk2', 'Austria', 'Panama', '2026-06-15 16:00', 'group', 'K', 'scheduled'),
('mk3', 'Netherlands', 'Panama', '2026-06-20 16:00', 'group', 'K', 'scheduled'),
('mk4', 'Austria', 'Mali', '2026-06-21 13:00', 'group', 'K', 'scheduled'),
('mk5', 'Netherlands', 'Austria', '2026-06-26 16:00', 'group', 'K', 'scheduled'),
('mk6', 'Panama', 'Mali', '2026-06-27 13:00', 'group', 'K', 'scheduled');

-- Group L
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('ml1', 'Czech Republic', 'Ivory Coast', '2026-06-14 19:00', 'group', 'L', 'scheduled'),
('ml2', 'Ukraine', 'New Zealand', '2026-06-15 19:00', 'group', 'L', 'scheduled'),
('ml3', 'Czech Republic', 'New Zealand', '2026-06-20 19:00', 'group', 'L', 'scheduled'),
('ml4', 'Ukraine', 'Ivory Coast', '2026-06-22 19:00', 'group', 'L', 'scheduled'),
('ml5', 'Czech Republic', 'Ukraine', '2026-06-27 19:00', 'group', 'L', 'scheduled'),
('ml6', 'New Zealand', 'Ivory Coast', '2026-06-28 13:00', 'group', 'L', 'scheduled');

-- Round of 32
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, status) VALUES
('r32_1', 'TBD', 'TBD', '2026-06-29 16:00', 'round_of_32', 'scheduled'),
('r32_2', 'TBD', 'TBD', '2026-06-29 19:00', 'round_of_32', 'scheduled'),
('r32_3', 'TBD', 'TBD', '2026-06-30 13:00', 'round_of_32', 'scheduled'),
('r32_4', 'TBD', 'TBD', '2026-06-30 16:00', 'round_of_32', 'scheduled'),
('r32_5', 'TBD', 'TBD', '2026-06-30 19:00', 'round_of_32', 'scheduled'),
('r32_6', 'TBD', 'TBD', '2026-07-01 13:00', 'round_of_32', 'scheduled'),
('r32_7', 'TBD', 'TBD', '2026-07-01 16:00', 'round_of_32', 'scheduled'),
('r32_8', 'TBD', 'TBD', '2026-07-01 19:00', 'round_of_32', 'scheduled'),
('r32_9', 'TBD', 'TBD', '2026-07-02 13:00', 'round_of_32', 'scheduled'),
('r32_10', 'TBD', 'TBD', '2026-07-02 16:00', 'round_of_32', 'scheduled'),
('r32_11', 'TBD', 'TBD', '2026-07-02 19:00', 'round_of_32', 'scheduled'),
('r32_12', 'TBD', 'TBD', '2026-07-03 13:00', 'round_of_32', 'scheduled'),
('r32_13', 'TBD', 'TBD', '2026-07-03 16:00', 'round_of_32', 'scheduled'),
('r32_14', 'TBD', 'TBD', '2026-07-03 19:00', 'round_of_32', 'scheduled'),
('r32_15', 'TBD', 'TBD', '2026-07-04 13:00', 'round_of_32', 'scheduled'),
('r32_16', 'TBD', 'TBD', '2026-07-04 16:00', 'round_of_32', 'scheduled');

-- Round of 16
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, status) VALUES
('r16_1', 'TBD', 'TBD', '2026-07-05 16:00', 'round_of_16', 'scheduled'),
('r16_2', 'TBD', 'TBD', '2026-07-05 19:00', 'round_of_16', 'scheduled'),
('r16_3', 'TBD', 'TBD', '2026-07-06 16:00', 'round_of_16', 'scheduled'),
('r16_4', 'TBD', 'TBD', '2026-07-06 19:00', 'round_of_16', 'scheduled'),
('r16_5', 'TBD', 'TBD', '2026-07-07 16:00', 'round_of_16', 'scheduled'),
('r16_6', 'TBD', 'TBD', '2026-07-07 19:00', 'round_of_16', 'scheduled'),
('r16_7', 'TBD', 'TBD', '2026-07-08 16:00', 'round_of_16', 'scheduled'),
('r16_8', 'TBD', 'TBD', '2026-07-08 19:00', 'round_of_16', 'scheduled');

-- Quarter-finals
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, status) VALUES
('qf1', 'TBD', 'TBD', '2026-07-09 16:00', 'quarter', 'scheduled'),
('qf2', 'TBD', 'TBD', '2026-07-09 19:00', 'quarter', 'scheduled'),
('qf3', 'TBD', 'TBD', '2026-07-10 16:00', 'quarter', 'scheduled'),
('qf4', 'TBD', 'TBD', '2026-07-10 19:00', 'quarter', 'scheduled');

-- Semi-finals
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, status) VALUES
('sf1', 'TBD', 'TBD', '2026-07-12 16:00', 'semi', 'scheduled'),
('sf2', 'TBD', 'TBD', '2026-07-12 19:00', 'semi', 'scheduled');

-- 3rd Place & Final
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, status) VALUES
('tp1', 'TBD', 'TBD', '2026-07-14 16:00', 'third_place', 'scheduled'),
('fn1', 'TBD', 'TBD', '2026-07-15 18:00', 'final', 'scheduled');

-- ==================== CHAT ROOMS ====================
INSERT OR IGNORE INTO chat_rooms (id, type, name, description) VALUES
('room_global', 'global', 'Global Chat', 'Worldwide fan discussion'),
('room_group_a', 'group', 'Group A', 'Group A discussion'),
('room_group_b', 'group', 'Group B', 'Group B discussion'),
('room_group_c', 'group', 'Group C', 'Group C discussion'),
('room_group_d', 'group', 'Group D', 'Group D discussion'),
('room_group_e', 'group', 'Group E', 'Group E discussion'),
('room_group_f', 'group', 'Group F', 'Group F discussion'),
('room_group_g', 'group', 'Group G', 'Group G discussion'),
('room_group_h', 'group', 'Group H', 'Group H discussion'),
('room_group_i', 'group', 'Group I', 'Group I discussion'),
('room_group_j', 'group', 'Group J', 'Group J discussion'),
('room_group_k', 'group', 'Group K', 'Group K discussion'),
('room_group_l', 'group', 'Group L', 'Group L discussion');
