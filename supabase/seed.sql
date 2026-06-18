insert into app_settings (
  couple_name,
  site_title,
  start_date,
  wy_display_name,
  yyh_display_name,
  allow_guest_request
) values (
  'WY 和 YYH',
  'Wish You, Yield Happiness',
  '2025-01-14',
  'WY',
  'YYH',
  true
) on conflict do nothing;

insert into anniversaries (
  title, date, type, repeat, note, visibility
) values (
  '在一起纪念日',
  '2025-01-14',
  '在一起',
  'yearly',
  '这是 WY 和 YYH 正式在一起的日子。',
  'public'
);

insert into love_records (
  title, content, date, author_role, mood, tags, is_favorite, visibility
) values
(
  '一起吃了草莓蛋糕',
  '今天去了那家粉色的小店，草莓蛋糕超级甜，像一个软乎乎的纪念章。',
  '2026-06-18',
  'YYH',
  '甜蜜',
  array['约会', '甜品', '开心'],
  true,
  'public'
),
(
  '下雨天一起散步',
  '虽然下雨了，但是一起撑伞走路也很浪漫。',
  '2026-06-12',
  'WY',
  '平静',
  array['日常', '散步'],
  false,
  'private'
);

insert into wishes (
  title, description, status, target_date, creator_role, visibility
) values
(
  '一起去看海',
  '想和你一起坐在海边看日落。',
  'planning',
  '2026-08-01',
  'YYH',
  'public'
),
(
  '一起做一次蛋糕',
  '做一个粉色草莓蛋糕。',
  'todo',
  '2026-07-01',
  'WY',
  'private'
);

insert into message_notes (
  content, author_role, date, theme, is_pinned, visibility
) values
(
  '今天也很喜欢你，要早点睡哦。',
  'WY',
  '2026-06-18',
  'pink',
  true,
  'public'
),
(
  '下次还想和你一起去吃草莓蛋糕。',
  'YYH',
  '2026-06-16',
  'purple',
  false,
  'private'
);
