-- Member 데이터 삽입
INSERT INTO member (social_type, provider_id, created_at, updated_at)
VALUES
  ('TOSS', 'toss_user_001', NOW(), NOW()),
  ('TOSS', 'toss_user_002', NOW(), NOW()),
  ('TOSS', 'toss_user_003', NOW(), NOW());

-- Task 데이터 삽입 (member_id는 provider_id로 조회)
INSERT INTO task (name, start_time, end_time, is_completed, member_id, created_at, updated_at)
VALUES
  ('아침 운동', '06:00:00', '07:00:00', false, (SELECT id FROM member WHERE provider_id = 'toss_user_001'), NOW(), NOW()),
  ('독서하기', '08:00:00', '09:00:00', true, (SELECT id FROM member WHERE provider_id = 'toss_user_001'), NOW(), NOW()),
  ('회의 준비', '10:00:00', '11:30:00', false, (SELECT id FROM member WHERE provider_id = 'toss_user_001'), NOW(), NOW()),
  ('점심 식사', '12:00:00', '13:00:00', false, (SELECT id FROM member WHERE provider_id = 'toss_user_002'), NOW(), NOW()),
  ('코드 리뷰', '14:00:00', '16:00:00', false, (SELECT id FROM member WHERE provider_id = 'toss_user_002'), NOW(), NOW()),
  ('저녁 식사', '18:00:00', '19:00:00', false, (SELECT id FROM member WHERE provider_id = 'toss_user_003'), NOW(), NOW()),
  ('영화 보기', '20:00:00', '22:00:00', false, (SELECT id FROM member WHERE provider_id = 'toss_user_003'), NOW(), NOW()),
  ('일기 쓰기', '22:30:00', '23:00:00', false, (SELECT id FROM member WHERE provider_id = 'toss_user_003'), NOW(), NOW());
