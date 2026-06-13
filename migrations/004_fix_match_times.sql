-- Fix match times to real UTC kickoff times
-- All times converted from official ET/CT/MT/local → UTC

-- Group A
UPDATE matches SET match_date = '2026-06-11 17:00' WHERE id = 'ma1'; -- Mexico vs South Africa (3PM local Mexico City)
UPDATE matches SET match_date = '2026-06-12 02:00' WHERE id = 'ma2'; -- South Korea vs Czechia (10PM ET Jun 11)
UPDATE matches SET match_date = '2026-06-18 16:00' WHERE id = 'ma3'; -- Czechia vs South Africa (12PM ET)
UPDATE matches SET match_date = '2026-06-19 01:00' WHERE id = 'ma4'; -- Mexico vs South Korea (9PM ET Jun 18)
UPDATE matches SET match_date = '2026-06-25 01:00' WHERE id = 'ma5'; -- South Africa vs South Korea (9PM ET Jun 24)
UPDATE matches SET match_date = '2026-06-25 01:00' WHERE id = 'ma6'; -- Czechia vs Mexico (9PM ET Jun 24)

-- Group B
UPDATE matches SET match_date = '2026-06-12 19:00' WHERE id = 'mb1'; -- Canada vs Bosnia (3PM ET)
UPDATE matches SET match_date = '2026-06-13 19:00' WHERE id = 'mb2'; -- Qatar vs Switzerland (3PM ET)
UPDATE matches SET match_date = '2026-06-18 19:00' WHERE id = 'mb3'; -- Switzerland vs Bosnia (3PM ET)
UPDATE matches SET match_date = '2026-06-18 22:00' WHERE id = 'mb4'; -- Canada vs Qatar (6PM ET)
UPDATE matches SET match_date = '2026-06-24 16:00' WHERE id = 'mb5'; -- Switzerland vs Canada (12PM ET)
UPDATE matches SET match_date = '2026-06-24 16:00' WHERE id = 'mb6'; -- Bosnia vs Qatar (12PM ET)

-- Group C
UPDATE matches SET match_date = '2026-06-13 22:00' WHERE id = 'mc1'; -- Brazil vs Morocco (6PM ET)
UPDATE matches SET match_date = '2026-06-14 01:00' WHERE id = 'mc2'; -- Haiti vs Scotland (9PM ET Jun 13)
UPDATE matches SET match_date = '2026-06-19 22:00' WHERE id = 'mc3'; -- Scotland vs Morocco (6PM ET)
UPDATE matches SET match_date = '2026-06-20 01:00' WHERE id = 'mc4'; -- Brazil vs Haiti (9PM ET Jun 19)
UPDATE matches SET match_date = '2026-06-25 00:00' WHERE id = 'mc5'; -- Scotland vs Brazil (8PM ET Jun 24)
UPDATE matches SET match_date = '2026-06-25 00:00' WHERE id = 'mc6'; -- Morocco vs Haiti (8PM ET Jun 24)

-- Group D
UPDATE matches SET match_date = '2026-06-13 01:00' WHERE id = 'md1'; -- USA vs Paraguay (9PM ET Jun 12)
UPDATE matches SET match_date = '2026-06-14 04:00' WHERE id = 'md2'; -- Australia vs Türkiye (12AM ET)
UPDATE matches SET match_date = '2026-06-19 19:00' WHERE id = 'md3'; -- USA vs Australia (3PM ET)
UPDATE matches SET match_date = '2026-06-20 04:00' WHERE id = 'md4'; -- Paraguay vs Türkiye (12AM ET)
UPDATE matches SET match_date = '2026-06-26 02:00' WHERE id = 'md5'; -- USA vs Türkiye (10PM ET Jun 25)
UPDATE matches SET match_date = '2026-06-25 18:00' WHERE id = 'md6'; -- Paraguay vs Australia (2PM ET)

-- Group E
UPDATE matches SET match_date = '2026-06-14 17:00' WHERE id = 'me1'; -- Germany vs Curaçao (1PM ET)
UPDATE matches SET match_date = '2026-06-14 23:00' WHERE id = 'me2'; -- Ivory Coast vs Ecuador (7PM ET)
UPDATE matches SET match_date = '2026-06-20 20:00' WHERE id = 'me3'; -- Germany vs Ivory Coast (4PM ET)
UPDATE matches SET match_date = '2026-06-21 00:00' WHERE id = 'me4'; -- Curaçao vs Ecuador (8PM ET Jun 20)
UPDATE matches SET match_date = '2026-06-26 00:00' WHERE id = 'me5'; -- Ecuador vs Germany (8PM ET Jun 25)
UPDATE matches SET match_date = '2026-06-26 00:00' WHERE id = 'me6'; -- Curaçao vs Ivory Coast (8PM ET Jun 25)

-- Group F
UPDATE matches SET match_date = '2026-06-14 20:00' WHERE id = 'mf1'; -- Netherlands vs Japan (4PM ET)
UPDATE matches SET match_date = '2026-06-15 02:00' WHERE id = 'mf2'; -- Sweden vs Tunisia (10PM ET Jun 14)
UPDATE matches SET match_date = '2026-06-20 17:00' WHERE id = 'mf3'; -- Netherlands vs Sweden (1PM ET)
UPDATE matches SET match_date = '2026-06-21 04:00' WHERE id = 'mf4'; -- Tunisia vs Japan (12AM ET)
UPDATE matches SET match_date = '2026-06-25 23:00' WHERE id = 'mf5'; -- Japan vs Sweden (7PM ET)
UPDATE matches SET match_date = '2026-06-25 23:00' WHERE id = 'mf6'; -- Tunisia vs Netherlands (7PM ET)

-- Group G
UPDATE matches SET match_date = '2026-06-15 19:00' WHERE id = 'mg1'; -- Belgium vs Egypt (3PM ET)
UPDATE matches SET match_date = '2026-06-16 01:00' WHERE id = 'mg2'; -- Iran vs New Zealand (9PM ET Jun 15)
UPDATE matches SET match_date = '2026-06-21 19:00' WHERE id = 'mg3'; -- Belgium vs Iran (3PM ET)
UPDATE matches SET match_date = '2026-06-22 01:00' WHERE id = 'mg4'; -- Egypt vs New Zealand (9PM ET Jun 21)
UPDATE matches SET match_date = '2026-06-26 18:00' WHERE id = 'mg5'; -- Iran vs Egypt (2PM ET)
UPDATE matches SET match_date = '2026-06-26 18:00' WHERE id = 'mg6'; -- New Zealand vs Belgium (2PM ET)

-- Group H
UPDATE matches SET match_date = '2026-06-15 16:00' WHERE id = 'mh1'; -- Spain vs Cape Verde (12PM ET)
UPDATE matches SET match_date = '2026-06-15 22:00' WHERE id = 'mh2'; -- Saudi Arabia vs Uruguay (6PM ET)
UPDATE matches SET match_date = '2026-06-21 16:00' WHERE id = 'mh3'; -- Spain vs Saudi Arabia (12PM ET)
UPDATE matches SET match_date = '2026-06-21 22:00' WHERE id = 'mh4'; -- Cape Verde vs Uruguay (6PM ET)
UPDATE matches SET match_date = '2026-06-26 21:00' WHERE id = 'mh5'; -- Cape Verde vs Saudi Arabia (5PM ET)
UPDATE matches SET match_date = '2026-06-26 21:00' WHERE id = 'mh6'; -- Uruguay vs Spain (5PM ET)

-- Group I
UPDATE matches SET match_date = '2026-06-16 19:00' WHERE id = 'mi1'; -- France vs Senegal (3PM ET)
UPDATE matches SET match_date = '2026-06-16 22:00' WHERE id = 'mi2'; -- Iraq vs Norway (6PM ET)
UPDATE matches SET match_date = '2026-06-22 21:00' WHERE id = 'mi3'; -- France vs Iraq (5PM ET)
UPDATE matches SET match_date = '2026-06-23 00:00' WHERE id = 'mi4'; -- Norway vs Senegal (8PM ET Jun 22)
UPDATE matches SET match_date = '2026-06-26 19:00' WHERE id = 'mi5'; -- Norway vs France (3PM ET)
UPDATE matches SET match_date = '2026-06-26 19:00' WHERE id = 'mi6'; -- Senegal vs Iraq (3PM ET)

-- Group J
UPDATE matches SET match_date = '2026-06-17 01:00' WHERE id = 'mj1'; -- Argentina vs Algeria (9PM ET Jun 16)
UPDATE matches SET match_date = '2026-06-17 04:00' WHERE id = 'mj2'; -- Austria vs Jordan (12AM ET)
UPDATE matches SET match_date = '2026-06-22 17:00' WHERE id = 'mj3'; -- Argentina vs Austria (1PM ET)
UPDATE matches SET match_date = '2026-06-23 03:00' WHERE id = 'mj4'; -- Jordan vs Algeria (11PM ET Jun 22)
UPDATE matches SET match_date = '2026-06-28 02:00' WHERE id = 'mj5'; -- Algeria vs Austria (10PM ET Jun 27)
UPDATE matches SET match_date = '2026-06-28 02:00' WHERE id = 'mj6'; -- Jordan vs Argentina (10PM ET Jun 27)

-- Group K
UPDATE matches SET match_date = '2026-06-17 17:00' WHERE id = 'mk1'; -- Portugal vs DR Congo (1PM ET)
UPDATE matches SET match_date = '2026-06-18 02:00' WHERE id = 'mk2'; -- Uzbekistan vs Colombia (10PM ET Jun 17)
UPDATE matches SET match_date = '2026-06-23 17:00' WHERE id = 'mk3'; -- Portugal vs Uzbekistan (1PM ET)
UPDATE matches SET match_date = '2026-06-24 02:00' WHERE id = 'mk4'; -- Colombia vs DR Congo (10PM ET Jun 23)
UPDATE matches SET match_date = '2026-06-27 23:30' WHERE id = 'mk5'; -- Colombia vs Portugal (7:30PM ET)
UPDATE matches SET match_date = '2026-06-27 23:30' WHERE id = 'mk6'; -- DR Congo vs Uzbekistan (7:30PM ET)

-- Group L
UPDATE matches SET match_date = '2026-06-17 20:00' WHERE id = 'ml1'; -- England vs Croatia (4PM ET)
UPDATE matches SET match_date = '2026-06-17 23:00' WHERE id = 'ml2'; -- Ghana vs Panama (7PM ET)
UPDATE matches SET match_date = '2026-06-23 20:00' WHERE id = 'ml3'; -- England vs Ghana (4PM ET)
UPDATE matches SET match_date = '2026-06-23 23:00' WHERE id = 'ml4'; -- Panama vs Croatia (7PM ET)
UPDATE matches SET match_date = '2026-06-27 21:00' WHERE id = 'ml5'; -- Panama vs England (5PM ET)
UPDATE matches SET match_date = '2026-06-27 21:00' WHERE id = 'ml6'; -- Croatia vs Ghana (5PM ET)
