-- ============================================
-- EDUMANAGER - SCHOOL SETTINGS SEED (IDEMPOTENT)
-- ============================================

START TRANSACTION;

INSERT INTO school_settings (school_name, email, phone, address, created_at, updated_at)
SELECT
  'EduManager',
  'contact@edumanager.ma',
  '0766046660',
  '123 Avenue Hassan II, Marrakech, Maroc',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM school_settings);

UPDATE school_settings
SET
  school_name = 'EduManager',
  email = 'contact@edumanager.ma',
  phone = '0766046660',
  address = '123 Avenue Hassan II, Marrakech, Maroc',
  updated_at = NOW()
WHERE id = (SELECT MIN(id) FROM school_settings);

COMMIT;
