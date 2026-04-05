# EduManager Backend - Setup Checklist

## ✅ Pre-Setup Checklist

- [ ] Java 21 installed (`java -version`)
- [ ] Maven 3.6+ installed (`mvn -version`)
- [ ] MySQL 8.0+ installed and running
- [ ] MySQL root password known
- [ ] Git repository cloned

## ✅ Database Setup

- [ ] MySQL service is running
- [ ] Database `edumanager_db` created
  ```sql
  CREATE DATABASE edumanager_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```
- [ ] Database connection verified
  ```bash
  mysql -u root -p edumanager_db
  ```

## ✅ Backend Configuration

- [ ] `application.properties` updated with MySQL password
  ```properties
  spring.datasource.password=YOUR_PASSWORD
  ```
- [ ] Port 8080 is available (or changed in config)

## ✅ Build & Run

- [ ] Dependencies installed
  ```bash
  cd backend
  mvn clean install
  ```
- [ ] Application starts successfully
  ```bash
  mvn spring-boot:run
  ```
- [ ] No errors in console
- [ ] Tables auto-created in database
  - agents
  - agent_permissions
  - students
  - parents
  - teachers
  - teacher_subjects
  - teacher_classes
  - attendances
  - grades
  - transactions
  - audit_logs

## ✅ Load Seed Data

- [ ] Backend has run at least once (tables created)
- [ ] Seed data loaded successfully
  ```bash
  mysql -u root -p edumanager_db < src/main/resources/seed-data.sql
  ```
- [ ] Verify data loaded
  ```sql
  SELECT COUNT(*) FROM students;    -- Should be 11
  SELECT COUNT(*) FROM parents;     -- Should be 5
  SELECT COUNT(*) FROM teachers;    -- Should be 5
  SELECT COUNT(*) FROM agents;      -- Should be 3
  SELECT COUNT(*) FROM audit_logs;  -- Should be 14
  ```

## ✅ API Testing

- [ ] Students endpoint works
  ```bash
  curl http://localhost:8080/api/students
  ```
- [ ] Agents endpoint works
  ```bash
  curl http://localhost:8080/api/agents
  ```
- [ ] Audit logs endpoint works
  ```bash
  curl http://localhost:8080/api/audit-logs
  ```
- [ ] Parents endpoint works
  ```bash
  curl http://localhost:8080/api/parents
  ```
- [ ] Teachers endpoint works
  ```bash
  curl http://localhost:8080/api/teachers
  ```

## ✅ Frontend Integration

- [ ] Frontend dependencies installed
  ```bash
  cd frontend
  npm install
  ```
- [ ] Frontend starts successfully
  ```bash
  npm run dev
  ```
- [ ] Frontend can connect to backend (check console for errors)
- [ ] All pages load without errors:
  - [ ] Tableau de bord
  - [ ] Utilisateurs (Agents)
  - [ ] Journal (Audit Logs)
  - [ ] Finances
  - [ ] Étudiants
  - [ ] Présences
  - [ ] Notes & Bulletins
  - [ ] Emploi du temps
  - [ ] Professeurs
  - [ ] Parents & Tuteurs

## ✅ Data Verification

- [ ] Students page shows 11 students
- [ ] Parents page shows 5 parents
- [ ] Teachers page shows 5 teachers
- [ ] Utilisateurs page shows 3 agents
- [ ] Journal page shows activity logs
- [ ] Student details open correctly
- [ ] Parent details show linked children
- [ ] Financial data displays properly

## ✅ Common Issues Fixed

- [ ] CORS enabled in SecurityConfig (already done)
- [ ] All entities have proper relationships (already done)
- [ ] Seed data has correct foreign keys (already done)
- [ ] DTOs match frontend expectations (already done)

## 🎯 Success Criteria

All of the following should work:

1. ✅ Backend starts without errors
2. ✅ All database tables created
3. ✅ Seed data loads successfully
4. ✅ All API endpoints return data
5. ✅ Frontend connects to backend
6. ✅ All frontend pages display data
7. ✅ No console errors in browser
8. ✅ Can create, read, update, delete records

## 📝 Notes

### Test User Credentials
- Email: `sarah.elmansouri@edumanager.ma`
- Password: `password123` (not hashed yet)

### Database Info
- Database: `edumanager_db`
- Character Set: `utf8mb4`
- Collation: `utf8mb4_unicode_ci`

### Port Configuration
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173` (Vite default)

## 🆘 Troubleshooting

### Backend won't start
1. Check Java version (must be 21)
2. Check MySQL is running
3. Verify database exists
4. Check application.properties credentials
5. Look at console error messages

### Seed data won't load
1. Stop backend
2. Load seed data
3. Start backend again
4. Or: Let backend create tables first, then load seed data

### Frontend can't connect
1. Verify backend is running on 8080
2. Check browser console for CORS errors
3. Verify CORS is enabled in SecurityConfig
4. Clear browser cache

### No data showing
1. Verify seed data loaded: `SELECT COUNT(*) FROM students;`
2. Check API endpoints with curl
3. Check browser console for errors
4. Verify frontend is calling correct endpoint URLs

## ✅ When Everything Works

You should see:
- Backend running on port 8080
- Frontend running on port 5173
- All pages load data correctly
- Can navigate between all sections
- Data displays properly formatted
- No errors in browser console
- No errors in backend console

---

**Estimated Setup Time:** 10-15 minutes  
**Status:** Ready for development!  

🎉 **Congratulations!** Your EduManager system is fully set up and ready to use!
