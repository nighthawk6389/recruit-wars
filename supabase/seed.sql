-- ════════════════════════════════════════════════════════════════
--  RECRUIT WARS — seed data
--  Run after schema.sql to populate schools + sample athletes.
-- ════════════════════════════════════════════════════════════════

insert into schools (id, name, full_name, abbrev, color, state) values
  ('lsu',       'LSU',        'Louisiana State University', 'LSU',  '#461D7C', 'LA'),
  ('miami',     'Miami',      'University of Miami',        'MIA',  '#F47321', 'FL'),
  ('tennessee', 'Tennessee',  'University of Tennessee',    'TENN', '#FF8200', 'TN'),
  ('texas',     'Texas',      'University of Texas',        'TEX',  '#BF5700', 'TX'),
  ('georgia',   'Georgia',    'University of Georgia',      'UGA',  '#BA0C2F', 'GA'),
  ('alabama',   'Alabama',    'University of Alabama',      'BAMA', '#9E1B32', 'AL'),
  ('ohiostate', 'Ohio State', 'Ohio State University',      'OSU',  '#BB0000', 'OH'),
  ('oregon',    'Oregon',     'University of Oregon',       'ORE',  '#154733', 'OR')
on conflict (id) do nothing;

insert into athletes
  (slug, name, position, class_year, hometown, state, height, weight, stars, rating,
   bio, photo_url, recruiting_status, nil_valuation, highlight_video_url, offers, socials, approved, featured)
values
  ('jamarcus-lee', 'Ja''Marcus Lee', 'QB', '2026', 'Baton Rouge, LA', 'LA', '6''3"', '205 lbs', 5, 98.4,
   'Dual-threat quarterback with elite arm talent and a 4.5 forty.',
   'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80',
   'Uncommitted', 1250000, 'https://www.youtube.com/embed/dQw4w9WgXcQ',
   array['lsu','miami','tennessee','texas','georgia','alabama'],
   '{"x":"https://x.com","instagram":"https://instagram.com"}'::jsonb, true, true),

  ('deshawn-carter', 'DeShawn Carter', 'WR', '2026', 'Miami, FL', 'FL', '6''1"', '185 lbs', 5, 97.1,
   'Explosive route-runner with track speed and elite ball skills.',
   'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
   'Uncommitted', 880000, 'https://www.youtube.com/embed/dQw4w9WgXcQ',
   array['miami','texas','oregon','ohiostate','georgia'],
   '{"x":"https://x.com"}'::jsonb, true, true),

  ('tyrell-jackson', 'Tyrell Jackson', 'EDGE', '2027', 'Knoxville, TN', 'TN', '6''5"', '245 lbs', 4, 94.8,
   'Relentless pass rusher with a 36-inch vertical and non-stop motor.',
   'https://images.unsplash.com/photo-1577471488278-16eec37ffcc7?w=800&q=80',
   'Uncommitted', 540000, 'https://www.youtube.com/embed/dQw4w9WgXcQ',
   array['tennessee','alabama','georgia','ohiostate'],
   '{"x":"https://x.com"}'::jsonb, true, true)
on conflict (slug) do nothing;

insert into promo_codes (code, percent_off, active) values
  ('GEAUX10', 10, true),
  ('CANES15', 15, true)
on conflict (code) do nothing;
