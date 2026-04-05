-- ============================================
-- EDUMANAGER SEED DATA
-- Comprehensive test data for development
-- ============================================

-- Clear existing data (in correct order due to foreign keys)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE agent_permissions;
TRUNCATE TABLE agents;
TRUNCATE TABLE attendances;
TRUNCATE TABLE grades;
TRUNCATE TABLE transactions;
TRUNCATE TABLE students;
TRUNCATE TABLE parents;
TRUNCATE TABLE teacher_classes;
TRUNCATE TABLE teacher_subjects;
TRUNCATE TABLE teachers;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- AGENTS (Utilisateurs administratifs)
-- ============================================
-- Password for all: "password123" (hashed with BCrypt)
INSERT INTO agents (id, name, email, password, phone, status, created_at, updated_at) VALUES
(1, 'Sarah El Mansouri', 'sarah.elmansouri@edumanager.ma', '$2a$10$eJ7Qz0E0rXmL9jJ0.qN5XeK5VF5nI4Zc8Z1nX5J7r5K5X5n5Z5n5Z5', '+212 661 234 567', 'ACTIVE', NOW(), NOW()),
(2, 'Karim Benali', 'karim.benali@edumanager.ma', '$2a$10$eJ7Qz0E0rXmL9jJ0.qN5XeK5VF5nI4Zc8Z1nX5J7r5K5X5n5Z5n5Z5', '+212 662 345 678', 'ACTIVE', NOW(), NOW()),
(3, 'Amina Tazi', 'amina.tazi@edumanager.ma', '$2a$10$eJ7Qz0E0rXmL9jJ0.qN5XeK5VF5nI4Zc8Z1nX5J7r5K5X5n5Z5n5Z5', '+212 663 456 789', 'INACTIVE', NOW(), NOW());

-- Agent Permissions
INSERT INTO agent_permissions (agent_id, permission) VALUES
(1, 'students'), (1, 'presences'), (1, 'notes'), (1, 'parents'),
(2, 'students'), (2, 'parents'), (2, 'presences'), (2, 'emploi_du_temps'),
(3, 'finances');

-- ============================================
-- PARENTS
-- ============================================
INSERT INTO parents (id, first_name, last_name, email, phone, address, avatar_url, cin, nationality, profession, arrears, created_at, updated_at) VALUES
(1, 'Mohammed', 'El Amrani', 'm.elamrani@email.com', '06 11 22 33 44', '12 Rue Hassan II, Casablanca', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face', 'K123456', 'Marocaine', 'Ingénieur', 15000.00, NOW(), NOW()),
(2, 'Ahmed', 'Benjelloun', 'a.benjelloun@email.com', '06 22 33 44 55', '45 Avenue Mohammed V, Rabat', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face', 'K234567', 'Marocaine', 'Médecin', 45000.00, NOW(), NOW()),
(3, 'Rachid', 'Alami', 'r.alami@email.com', '06 33 44 55 66', '8 Boulevard Zerktouni, Casablanca', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128&h=128&fit=crop&crop=face', 'K345678', 'Marocaine', 'Avocat', 0.00, NOW(), NOW()),
(4, 'Nadia', 'Fassi', 'n.fassi@email.com', '06 44 55 66 77', '23 Rue Allal Ben Abdellah, Fès', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face', 'K456789', 'Marocaine', 'Professeur', 30000.00, NOW(), NOW()),
(5, 'Youssef', 'Idrissi', 'y.idrissi@email.com', '06 55 66 77 88', '67 Avenue des FAR, Marrakech', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&h=128&fit=crop&crop=face', 'K567890', 'Marocaine', 'Commerçant', 15000.00, NOW(), NOW());

-- ============================================
-- STUDENTS (Étudiants)
-- ============================================
INSERT INTO students (id, first_name, last_name, email, phone, birth_date, address, avatar_url, status, class_name, parent_id, created_at, updated_at) VALUES
-- Parent 1 children
(1, 'Youssef', 'El Amrani', 'youssef.elamrani@email.com', '06 11 22 33 45', '2006-03-15', '12 Rue Hassan II, Casablanca', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face', 'ACTIVE', '6ème A', 1, NOW(), NOW()),
(3, 'Salma', 'El Amrani', 'salma.elamrani@email.com', '06 11 22 33 46', '2008-07-22', '12 Rue Hassan II, Casablanca', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face', 'ACTIVE', '4ème A', 1, NOW(), NOW()),

-- Parent 2 children
(2, 'Fatima Zahra', 'Benjelloun', 'fz.benjelloun@email.com', '06 22 33 44 56', '2006-05-20', '45 Avenue Mohammed V, Rabat', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face', 'ACTIVE', '6ème A', 2, NOW(), NOW()),
(6, 'Omar', 'Benjelloun', 'omar.benjelloun@email.com', '06 22 33 44 57', '2007-11-10', '45 Avenue Mohammed V, Rabat', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face', 'ACTIVE', '5ème A', 2, NOW(), NOW()),
(7, 'Hiba', 'Benjelloun', 'hiba.benjelloun@email.com', '06 22 33 44 58', '2009-02-14', '45 Avenue Mohammed V, Rabat', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face', 'ACTIVE', '3ème A', 2, NOW(), NOW()),

-- Parent 3 children
(4, 'Ahmed', 'Alami', 'ahmed.alami@email.com', '06 33 44 55 67', '2006-09-08', '8 Boulevard Zerktouni, Casablanca', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face', 'ACTIVE', '6ème B', 3, NOW(), NOW()),

-- Parent 4 children
(5, 'Karim', 'Fassi', 'karim.fassi@email.com', '06 44 55 66 78', '2007-01-12', '23 Rue Allal Ben Abdellah, Fès', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face', 'ACTIVE', '5ème B', 4, NOW(), NOW()),
(8, 'Nadia', 'Fassi', 'nadia.fassi@email.com', '06 44 55 66 79', '2008-06-25', '23 Rue Allal Ben Abdellah, Fès', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=face', 'ACTIVE', '4ème B', 4, NOW(), NOW()),

-- Parent 5 children
(9, 'Amine', 'Idrissi', 'amine.idrissi@email.com', '06 55 66 77 89', '2006-12-03', '67 Avenue des FAR, Marrakech', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop&crop=face', 'ACTIVE', '6ème A', 5, NOW(), NOW()),

-- Additional students for testing
(10, 'Leila', 'Zouiten', 'leila.zouiten@email.com', '06 66 77 88 99', '2007-04-18', '89 Rue de la Liberté, Tanger', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=64&h=64&fit=crop&crop=face', 'ACTIVE', '5ème A', 1, NOW(), NOW()),
(11, 'Hassan', 'Cherkaoui', 'hassan.cherkaoui@email.com', '06 77 88 99 00', '2008-08-30', '34 Avenue Atlas, Agadir', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face', 'INACTIVE', '4ème A', 2, NOW(), NOW());

-- ============================================
-- TEACHERS (Professeurs)
-- ============================================
INSERT INTO teachers (id, first_name, last_name, email, phone, avatar_url, specialization, status, created_at, updated_at) VALUES
(1, 'Mohammed', 'Bennani', 'm.bennani@edumanager.ma', '+212 6 12 34 56 78', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face', 'Mathématiques', 'ACTIVE', NOW(), NOW()),
(2, 'Fatima', 'Alaoui', 'f.alaoui@edumanager.ma', '+212 6 23 45 67 89', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face', 'Physique-Chimie', 'ACTIVE', NOW(), NOW()),
(3, 'Youssef', 'El Fassi', 'y.elfassi@edumanager.ma', '+212 6 34 56 78 90', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face', 'Informatique', 'ACTIVE', NOW(), NOW()),
(4, 'Sara', 'Idrissi', 's.idrissi@edumanager.ma', '+212 6 45 67 89 01', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face', 'Français', 'ACTIVE', NOW(), NOW()),
(5, 'Karim', 'Tazi', 'k.tazi@edumanager.ma', '+212 6 56 78 90 12', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face', 'Anglais', 'ACTIVE', NOW(), NOW());

-- Teacher Subjects
INSERT INTO teacher_subjects (teacher_id, subject) VALUES
(1, 'Mathématiques'), (1, 'Algèbre'), (1, 'Géométrie'),
(2, 'Physique'), (2, 'Chimie'),
(3, 'Informatique'), (3, 'Algorithmique'), (3, 'Programmation'),
(4, 'Français'), (4, 'Littérature'),
(5, 'Anglais'), (5, 'Communication');

-- Teacher Classes
INSERT INTO teacher_classes (teacher_id, class_name) VALUES
(1, '6ème A'), (1, '6ème B'), (1, '5ème A'),
(2, '6ème A'), (2, '5ème B'),
(3, '6ème A'), (3, '6ème B'), (3, '5ème A'), (3, '5ème B'),
(4, '6ème A'), (4, '6ème B'),
(5, '5ème A'), (5, '5ème B');

-- ============================================
-- ATTENDANCES (Présences)
-- ============================================
INSERT INTO attendances (student_id, date, session, status, class_name, marked_by_teacher, notes, created_at) VALUES
-- Today's attendance for 6ème A (mixed statuses)
(1, CURDATE(), 'S1', 'PRESENT', '6ème A', 'M. Bennani', NULL, NOW()),
(2, CURDATE(), 'S1', 'PRESENT', '6ème A', 'M. Bennani', NULL, NOW()),
(9, CURDATE(), 'S1', 'ABSENT', '6ème A', 'M. Bennani', 'Non justifié', NOW()),
(1, CURDATE(), 'S2', 'LATE', '6ème A', 'Mme. Alaoui', 'Arrivé 15 minutes en retard', NOW()),
(2, CURDATE(), 'S2', 'PRESENT', '6ème A', 'Mme. Alaoui', NULL, NOW()),

-- Yesterday's attendance
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'S1', 'PRESENT', '6ème A', 'M. Bennani', NULL, NOW()),
(2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'S1', 'PRESENT', '6ème A', 'M. Bennani', NULL, NOW()),
(4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'S1', 'LATE', '6ème B', 'M. Bennani', NULL, NOW()),

-- Last week
(1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'S1', 'PRESENT', '6ème A', 'M. Bennani', NULL, NOW()),
(2, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'S1', 'ABSENT', '6ème A', 'M. Bennani', 'Malade', NOW());

-- ============================================
-- GRADES (Notes)
-- ============================================
INSERT INTO grades (student_id, teacher_id, subject, evaluation_name, evaluation_type, score, max_score, coefficient, semester, academic_year, class_name, created_at, updated_at) VALUES
-- Student 1 (Youssef El Amrani) - 6ème A
(1, 1, 'Mathématiques', 'Contrôle 1', 'WRITTEN', 16.5, 20.0, 2.0, 'S1', '2024-2025', '6ème A', NOW(), NOW()),
(1, 1, 'Mathématiques', 'Devoir Maison', 'HOMEWORK', 18.0, 20.0, 1.0, 'S1', '2024-2025', '6ème A', NOW(), NOW()),
(1, 2, 'Physique-Chimie', 'TP 1', 'PRACTICAL', 15.0, 20.0, 1.5, 'S1', '2024-2025', '6ème A', NOW(), NOW()),
(1, 4, 'Français', 'Contrôle Continu', 'WRITTEN', 14.5, 20.0, 2.0, 'S1', '2024-2025', '6ème A', NOW(), NOW()),

-- Student 2 (Fatima Zahra Benjelloun) - 6ème A
(2, 1, 'Mathématiques', 'Contrôle 1', 'WRITTEN', 17.0, 20.0, 2.0, 'S1', '2024-2025', '6ème A', NOW(), NOW()),
(2, 1, 'Mathématiques', 'Devoir Maison', 'HOMEWORK', 19.0, 20.0, 1.0, 'S1', '2024-2025', '6ème A', NOW(), NOW()),
(2, 2, 'Physique-Chimie', 'TP 1', 'PRACTICAL', 16.5, 20.0, 1.5, 'S1', '2024-2025', '6ème A', NOW(), NOW()),
(2, 4, 'Français', 'Contrôle Continu', 'WRITTEN', 15.5, 20.0, 2.0, 'S1', '2024-2025', '6ème A', NOW(), NOW()),

-- Student 4 (Ahmed Alami) - 6ème B
(4, 1, 'Mathématiques', 'Contrôle 1', 'WRITTEN', 13.5, 20.0, 2.0, 'S1', '2024-2025', '6ème B', NOW(), NOW()),
(4, 1, 'Mathématiques', 'Devoir Maison', 'HOMEWORK', 15.0, 20.0, 1.0, 'S1', '2024-2025', '6ème B', NOW(), NOW());

-- ============================================
-- TRANSACTIONS (Finances)
-- ============================================
INSERT INTO transactions (parent_id, student_id, transaction_type, amount, payment_method, status, reference, description, academic_year, transaction_date, created_at, updated_at) VALUES
-- Parent 1 payments
(1, 1, 'PAYMENT', 5000.00, 'BANK_TRANSFER', 'COMPLETED', 'VIR-2024-001', 'Paiement mensuel Septembre 2024', '2024-2025', '2024-09-05', NOW(), NOW()),
(1, 1, 'PAYMENT', 5000.00, 'CASH', 'COMPLETED', 'CASH-2024-002', 'Paiement mensuel Octobre 2024', '2024-2025', '2024-10-05', NOW(), NOW()),
(1, 3, 'PAYMENT', 3000.00, 'CHEQUE', 'COMPLETED', 'CHQ-123456', 'Paiement partiel Salma', '2024-2025', '2024-09-10', NOW(), NOW()),

-- Parent 2 payments (has arrears)
(2, 2, 'PAYMENT', 10000.00, 'BANK_TRANSFER', 'COMPLETED', 'VIR-2024-003', 'Paiement Fatima Septembre', '2024-2025', '2024-09-01', NOW(), NOW()),
(2, 6, 'TUITION_FEE', 25000.00, 'CASH', 'PENDING', NULL, 'Frais de scolarité Omar', '2024-2025', CURDATE(), NOW(), NOW()),

-- Parent 3 payments (no arrears)
(3, 4, 'PAYMENT', 12000.00, 'BANK_TRANSFER', 'COMPLETED', 'VIR-2024-004', 'Paiement complet Ahmed', '2024-2025', '2024-09-01', NOW(), NOW()),

-- Parent 4 payments
(4, 5, 'PAYMENT', 8000.00, 'CHEQUE', 'COMPLETED', 'CHQ-234567', 'Paiement Karim', '2024-2025', '2024-10-15', NOW(), NOW()),
(4, 8, 'TUITION_FEE', 20000.00, 'CASH', 'PENDING', NULL, 'Frais annuels Nadia', '2024-2025', CURDATE(), NOW(), NOW());

-- ============================================
-- AUDIT LOGS (Journal d'activité)
-- ============================================
INSERT INTO audit_logs (agent_id, agent_name, module, action, description, target, ip_address, timestamp) VALUES
-- Recent activity (today)
(1, 'Sarah El Mansouri', 'Étudiants', 'CREATE', 'Ajout d''un nouvel étudiant', 'Youssef El Amrani', '192.168.1.10', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, 'Sarah El Mansouri', 'Présences', 'UPDATE', 'Marquage présence 6ème A - Session S1', '6ème A', '192.168.1.10', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(2, 'Karim Benali', 'Parents', 'UPDATE', 'Modification coordonnées parent', 'Mohammed El Amrani', '192.168.1.11', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(1, 'Sarah El Mansouri', 'Notes', 'CREATE', 'Saisie notes contrôle Mathématiques', '6ème A', '192.168.1.10', DATE_SUB(NOW(), INTERVAL 4 HOUR)),

-- Yesterday
(2, 'Karim Benali', 'Étudiants', 'UPDATE', 'Modification informations étudiant', 'Fatima Zahra Benjelloun', '192.168.1.11', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 'Sarah El Mansouri', 'Présences', 'UPDATE', 'Marquage présence 6ème A', '6ème A', '192.168.1.10', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 'Amina Tazi', 'Finances', 'CREATE', 'Enregistrement paiement', 'Mohammed El Amrani', '192.168.1.12', DATE_SUB(NOW(), INTERVAL 1 DAY)),

-- Last week
(1, 'Sarah El Mansouri', 'Étudiants', 'DELETE', 'Suppression étudiant inactif', 'Ancien élève', '192.168.1.10', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(2, 'Karim Benali', 'Parents', 'CREATE', 'Ajout nouveau parent', 'Ahmed Benjelloun', '192.168.1.11', DATE_SUB(NOW(), INTERVAL 8 DAY)),
(1, 'Sarah El Mansouri', 'Notes', 'UPDATE', 'Correction notes', '5ème A', '192.168.1.10', DATE_SUB(NOW(), INTERVAL 9 DAY)),
(3, 'Amina Tazi', 'Finances', 'UPDATE', 'Mise à jour paiement', 'Rachid Alami', '192.168.1.12', DATE_SUB(NOW(), INTERVAL 10 DAY)),

-- System events
(1, 'Système', 'Système', 'BACKUP', 'Sauvegarde automatique de la base de données', 'DB Backup', '127.0.0.1', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 'Système', 'Système', 'LOGIN', 'Connexion utilisateur', 'Sarah El Mansouri', '192.168.1.10', NOW());

-- ============================================
-- SEED DATA COMPLETE
-- ============================================
