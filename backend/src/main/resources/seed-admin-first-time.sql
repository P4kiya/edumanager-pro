-- ============================================
-- EDUMANAGER - FIRST ADMIN SEED (IDEMPOTENT)
-- Inserts the initial administrator only once.
-- ============================================

START TRANSACTION;

-- 1) Insert admin only if email does not exist yet
INSERT INTO agents (name, email, password, phone, status, created_at, updated_at)
SELECT
  'Othmane Aitsalah',
  'pakiyaasiv1@gmail.com',
  'Othmane26',
  '+212766046660',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1
  FROM agents
  WHERE email = 'pakiyaasiv1@gmail.com'
);

-- 2) Ensure base admin permissions exist for this account
INSERT INTO agent_permissions (agent_id, permission)
SELECT a.id, p.permission
FROM agents a
JOIN (
  SELECT 'students' AS permission
  UNION ALL SELECT 'parents'
  UNION ALL SELECT 'presences'
  UNION ALL SELECT 'notes'
  UNION ALL SELECT 'finances'
  UNION ALL SELECT 'journal'
  UNION ALL SELECT 'parametres'
) p
WHERE a.email = 'pakiyaasiv1@gmail.com'
  AND NOT EXISTS (
    SELECT 1
    FROM agent_permissions ap
    WHERE ap.agent_id = a.id
      AND ap.permission = p.permission
  );

COMMIT;

-- Expected admin profile after insert:
-- Nom complet: Othmane Aitsalah
-- Rôle (app): Administrateur
-- Email: pakiyaasiv1@gmail.com
-- Téléphone: +212766046660
-- Mot de passe: Othmane26
