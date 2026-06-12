-- ============================================
-- Seed Data: 2026 FIFA World Cup (Official Draw)
-- Based on Final Draw results (Dec 5, 2025)
-- ============================================

-- ==================== STANDINGS (48 Teams, 12 Groups) ====================

INSERT OR IGNORE INTO standings (id, team_name, group_name) VALUES
-- Group A: Mexico, South Africa, South Korea, Czechia
('sa1', 'Mexico', 'A'), ('sa2', 'South Africa', 'A'), ('sa3', 'South Korea', 'A'), ('sa4', 'Czechia', 'A'),
-- Group B: Canada, Bosnia and Herzegovina, Qatar, Switzerland
('sb1', 'Canada', 'B'), ('sb2', 'Bosnia and Herzegovina', 'B'), ('sb3', 'Qatar', 'B'), ('sb4', 'Switzerland', 'B'),
-- Group C: Brazil, Morocco, Haiti, Scotland
('sc1', 'Brazil', 'C'), ('sc2', 'Morocco', 'C'), ('sc3', 'Haiti', 'C'), ('sc4', 'Scotland', 'C'),
-- Group D: USA, Paraguay, Australia, Türkiye
('sd1', 'USA', 'D'), ('sd2', 'Paraguay', 'D'), ('sd3', 'Australia', 'D'), ('sd4', 'Türkiye', 'D'),
-- Group E: Germany, Curaçao, Ivory Coast, Ecuador
('se1', 'Germany', 'E'), ('se2', 'Curaçao', 'E'), ('se3', 'Ivory Coast', 'E'), ('se4', 'Ecuador', 'E'),
-- Group F: Netherlands, Japan, Sweden, Tunisia
('sf1', 'Netherlands', 'F'), ('sf2', 'Japan', 'F'), ('sf3', 'Sweden', 'F'), ('sf4', 'Tunisia', 'F'),
-- Group G: Belgium, Egypt, Iran, New Zealand
('sg1', 'Belgium', 'G'), ('sg2', 'Egypt', 'G'), ('sg3', 'Iran', 'G'), ('sg4', 'New Zealand', 'G'),
-- Group H: Spain, Cape Verde, Saudi Arabia, Uruguay
('sh1', 'Spain', 'H'), ('sh2', 'Cape Verde', 'H'), ('sh3', 'Saudi Arabia', 'H'), ('sh4', 'Uruguay', 'H'),
-- Group I: France, Senegal, Iraq, Norway
('si1', 'France', 'I'), ('si2', 'Senegal', 'I'), ('si3', 'Iraq', 'I'), ('si4', 'Norway', 'I'),
-- Group J: Argentina, Algeria, Austria, Jordan
('sj1', 'Argentina', 'J'), ('sj2', 'Algeria', 'J'), ('sj3', 'Austria', 'J'), ('sj4', 'Jordan', 'J'),
-- Group K: Portugal, DR Congo, Uzbekistan, Colombia
('sk1', 'Portugal', 'K'), ('sk2', 'DR Congo', 'K'), ('sk3', 'Uzbekistan', 'K'), ('sk4', 'Colombia', 'K'),
-- Group L: England, Croatia, Ghana, Panama
('sl1', 'England', 'L'), ('sl2', 'Croatia', 'L'), ('sl3', 'Ghana', 'L'), ('sl4', 'Panama', 'L');

-- ==================== MATCHES (72 Group Stage + 32 Knockout) ====================

-- Group A
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('ma1', 'Mexico', 'South Africa', '2026-06-11 14:00', 'group', 'A', 'scheduled'),
('ma2', 'South Korea', 'Czechia', '2026-06-11 21:00', 'group', 'A', 'scheduled'),
('ma3', 'Czechia', 'South Africa', '2026-06-18 11:00', 'group', 'A', 'scheduled'),
('ma4', 'Mexico', 'South Korea', '2026-06-18 20:00', 'group', 'A', 'scheduled'),
('ma5', 'South Africa', 'South Korea', '2026-06-24 21:00', 'group', 'A', 'scheduled'),
('ma6', 'Czechia', 'Mexico', '2026-06-24 21:00', 'group', 'A', 'scheduled');

-- Group B
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mb1', 'Canada', 'Bosnia and Herzegovina', '2026-06-12 14:00', 'group', 'B', 'scheduled'),
('mb2', 'Qatar', 'Switzerland', '2026-06-13 14:00', 'group', 'B', 'scheduled'),
('mb3', 'Switzerland', 'Bosnia and Herzegovina', '2026-06-18 14:00', 'group', 'B', 'scheduled'),
('mb4', 'Canada', 'Qatar', '2026-06-18 17:00', 'group', 'B', 'scheduled'),
('mb5', 'Switzerland', 'Canada', '2026-06-24 15:00', 'group', 'B', 'scheduled'),
('mb6', 'Bosnia and Herzegovina', 'Qatar', '2026-06-24 15:00', 'group', 'B', 'scheduled');

-- Group C
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mc1', 'Brazil', 'Morocco', '2026-06-13 17:00', 'group', 'C', 'scheduled'),
('mc2', 'Haiti', 'Scotland', '2026-06-14 14:00', 'group', 'C', 'scheduled'),
('mc3', 'Scotland', 'Morocco', '2026-06-19 17:00', 'group', 'C', 'scheduled'),
('mc4', 'Brazil', 'Haiti', '2026-06-20 14:00', 'group', 'C', 'scheduled'),
('mc5', 'Scotland', 'Brazil', '2026-06-24 18:00', 'group', 'C', 'scheduled'),
('mc6', 'Morocco', 'Haiti', '2026-06-24 18:00', 'group', 'C', 'scheduled');

-- Group D
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('md1', 'USA', 'Paraguay', '2026-06-12 20:00', 'group', 'D', 'scheduled'),
('md2', 'Australia', 'Türkiye', '2026-06-13 20:00', 'group', 'D', 'scheduled'),
('md3', 'USA', 'Australia', '2026-06-19 14:00', 'group', 'D', 'scheduled'),
('md4', 'Paraguay', 'Türkiye', '2026-06-19 20:00', 'group', 'D', 'scheduled'),
('md5', 'USA', 'Türkiye', '2026-06-25 14:00', 'group', 'D', 'scheduled'),
('md6', 'Paraguay', 'Australia', '2026-06-25 14:00', 'group', 'D', 'scheduled');

-- Group E
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('me1', 'Germany', 'Curaçao', '2026-06-14 20:00', 'group', 'E', 'scheduled'),
('me2', 'Ivory Coast', 'Ecuador', '2026-06-15 14:00', 'group', 'E', 'scheduled'),
('me3', 'Germany', 'Ivory Coast', '2026-06-20 17:00', 'group', 'E', 'scheduled'),
('me4', 'Curaçao', 'Ecuador', '2026-06-20 20:00', 'group', 'E', 'scheduled'),
('me5', 'Ecuador', 'Germany', '2026-06-25 20:00', 'group', 'E', 'scheduled'),
('me6', 'Curaçao', 'Ivory Coast', '2026-06-25 20:00', 'group', 'E', 'scheduled');

-- Group F
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mf1', 'Netherlands', 'Japan', '2026-06-14 16:00', 'group', 'F', 'scheduled'),
('mf2', 'Sweden', 'Tunisia', '2026-06-14 22:00', 'group', 'F', 'scheduled'),
('mf3', 'Netherlands', 'Sweden', '2026-06-20 13:00', 'group', 'F', 'scheduled'),
('mf4', 'Tunisia', 'Japan', '2026-06-21 00:00', 'group', 'F', 'scheduled'),
('mf5', 'Japan', 'Sweden', '2026-06-25 19:00', 'group', 'F', 'scheduled'),
('mf6', 'Tunisia', 'Netherlands', '2026-06-25 19:00', 'group', 'F', 'scheduled');

-- Group G
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mg1', 'Belgium', 'Egypt', '2026-06-15 17:00', 'group', 'G', 'scheduled'),
('mg2', 'Iran', 'New Zealand', '2026-06-15 20:00', 'group', 'G', 'scheduled'),
('mg3', 'Belgium', 'Iran', '2026-06-21 14:00', 'group', 'G', 'scheduled'),
('mg4', 'Egypt', 'New Zealand', '2026-06-21 17:00', 'group', 'G', 'scheduled'),
('mg5', 'Iran', 'Egypt', '2026-06-26 14:00', 'group', 'G', 'scheduled'),
('mg6', 'New Zealand', 'Belgium', '2026-06-26 14:00', 'group', 'G', 'scheduled');

-- Group H
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mh1', 'Spain', 'Cape Verde', '2026-06-15 17:00', 'group', 'H', 'scheduled'),
('mh2', 'Saudi Arabia', 'Uruguay', '2026-06-15 20:00', 'group', 'H', 'scheduled'),
('mh3', 'Spain', 'Saudi Arabia', '2026-06-21 20:00', 'group', 'H', 'scheduled'),
('mh4', 'Cape Verde', 'Uruguay', '2026-06-22 14:00', 'group', 'H', 'scheduled'),
('mh5', 'Cape Verde', 'Saudi Arabia', '2026-06-26 17:00', 'group', 'H', 'scheduled'),
('mh6', 'Uruguay', 'Spain', '2026-06-26 17:00', 'group', 'H', 'scheduled');

-- Group I
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mi1', 'France', 'Senegal', '2026-06-16 15:00', 'group', 'I', 'scheduled'),
('mi2', 'Iraq', 'Norway', '2026-06-16 18:00', 'group', 'I', 'scheduled'),
('mi3', 'France', 'Iraq', '2026-06-22 17:00', 'group', 'I', 'scheduled'),
('mi4', 'Norway', 'Senegal', '2026-06-22 20:00', 'group', 'I', 'scheduled'),
('mi5', 'Norway', 'France', '2026-06-26 15:00', 'group', 'I', 'scheduled'),
('mi6', 'Senegal', 'Iraq', '2026-06-26 15:00', 'group', 'I', 'scheduled');

-- Group J
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mj1', 'Argentina', 'Algeria', '2026-06-16 21:00', 'group', 'J', 'scheduled'),
('mj2', 'Austria', 'Jordan', '2026-06-17 00:00', 'group', 'J', 'scheduled'),
('mj3', 'Argentina', 'Austria', '2026-06-22 13:00', 'group', 'J', 'scheduled'),
('mj4', 'Jordan', 'Algeria', '2026-06-22 23:00', 'group', 'J', 'scheduled'),
('mj5', 'Algeria', 'Austria', '2026-06-27 22:00', 'group', 'J', 'scheduled'),
('mj6', 'Jordan', 'Argentina', '2026-06-27 22:00', 'group', 'J', 'scheduled');

-- Group K
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('mk1', 'Portugal', 'DR Congo', '2026-06-17 13:00', 'group', 'K', 'scheduled'),
('mk2', 'Uzbekistan', 'Colombia', '2026-06-17 22:00', 'group', 'K', 'scheduled'),
('mk3', 'Portugal', 'Uzbekistan', '2026-06-23 13:00', 'group', 'K', 'scheduled'),
('mk4', 'Colombia', 'DR Congo', '2026-06-23 22:00', 'group', 'K', 'scheduled'),
('mk5', 'Colombia', 'Portugal', '2026-06-27 19:30', 'group', 'K', 'scheduled'),
('mk6', 'DR Congo', 'Uzbekistan', '2026-06-27 19:30', 'group', 'K', 'scheduled');

-- Group L
INSERT OR IGNORE INTO matches (id, home_team, away_team, match_date, stage, group_name, status) VALUES
('ml1', 'England', 'Croatia', '2026-06-17 16:00', 'group', 'L', 'scheduled'),
('ml2', 'Ghana', 'Panama', '2026-06-17 19:00', 'group', 'L', 'scheduled'),
('ml3', 'England', 'Ghana', '2026-06-23 16:00', 'group', 'L', 'scheduled'),
('ml4', 'Panama', 'Croatia', '2026-06-23 19:00', 'group', 'L', 'scheduled'),
('ml5', 'Panama', 'England', '2026-06-28 14:00', 'group', 'L', 'scheduled'),
('ml6', 'Croatia', 'Ghana', '2026-06-28 14:00', 'group', 'L', 'scheduled');

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
