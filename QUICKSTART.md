# EduManager - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Start MySQL
```bash
# Make sure MySQL is running
# Windows: Start MySQL service from Services
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql
```

### Step 2: Create Database
```bash
mysql -u root -p
```
```sql
CREATE DATABASE edumanager_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 3: Configure Backend
Open `backend/src/main/resources/application.properties` and update:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 4: Start Backend
```bash
cd backend
mvn spring-boot:run
```

Wait for message: `Started EduManagerApiApplication`

### Step 5: Load Test Data
Open a new terminal:
```bash
cd backend
mysql -u root -p edumanager_db < src/main/resources/seed-data.sql
```

### Step 6: Verify It Works
```bash
# Test the API
curl http://localhost:8080/api/students
curl http://localhost:8080/api/agents
curl http://localhost:8080/api/audit-logs
```

You should see JSON data returned!

### Step 7: Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Open browser: `http://localhost:5173`

## 🎉 You're Done!

### Test Accounts
**Admin Users (Utilisateurs):**
- Email: `sarah.elmansouri@edumanager.ma` - Password: `password123`
- Email: `karim.benali@edumanager.ma` - Password: `password123`

### What You Can Do Now

✅ **View Students** - 11 test students across multiple classes  
✅ **View Parents** - 5 parents with linked children  
✅ **View Teachers** - 5 teachers with subjects  
✅ **View Utilisateurs** - 3 admin users  
✅ **View Journal** - 14 activity log entries  
✅ **View Présences** - Attendance records  
✅ **View Notes** - Grade records  
✅ **View Finances** - Payment transactions  

## 🔧 Troubleshooting

### Backend won't start
- Check Java version: `java -version` (need Java 21)
- Check MySQL is running
- Verify database credentials

### Seed data fails
- Make sure backend started at least once (creates tables)
- Check MySQL user has permissions
- Try loading manually through MySQL Workbench

### Frontend can't connect
- Verify backend is running on port 8080
- Check CORS is enabled (already configured)
- Open browser console for errors

## 📊 Sample Data Includes

- **11 Students** across 6 classes
- **5 Parents** with complete profiles
- **5 Teachers** teaching multiple subjects
- **3 Administrative Users** with different permissions
- **Attendance records** for multiple days and sessions
- **Grade records** with various evaluation types
- **Financial transactions** with different payment methods
- **Activity logs** showing recent system actions

## 🎯 Ready for Development!

All backend endpoints are working and match the frontend structure perfectly.

---

**Need Help?** Check `BACKEND_SETUP.md` for detailed documentation.
