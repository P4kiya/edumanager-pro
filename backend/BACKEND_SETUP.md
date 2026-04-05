# EduManager Backend - Setup & Seed Data Guide

## Overview
Complete Spring Boot backend for EduManager with comprehensive seed data for testing.

## Prerequisites
- Java 21
- MySQL 8.0+
- Maven 3.6+

## Quick Start

### 1. Database Setup

Create the MySQL database:
```sql
CREATE DATABASE edumanager_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Database Connection

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/edumanager_db?createDatabaseIfNotExist=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE
```

### 3. Build and Run

```bash
# Navigate to backend directory
cd backend

# Clean and install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 4. Load Seed Data

After the application starts and creates all tables, load the seed data:

```bash
# Connect to MySQL
mysql -u root -p edumanager_db

# Load seed data
source src/main/resources/seed-data.sql
```

Or using a single command:
```bash
mysql -u root -p edumanager_db < src/main/resources/seed-data.sql
```

## API Endpoints

### Agents (Utilisateurs) - NEW
- `GET    /api/agents` - Get all agents
- `GET    /api/agents/{id}` - Get agent by ID
- `POST   /api/agents` - Create new agent
- `PUT    /api/agents/{id}` - Update agent
- `DELETE /api/agents/{id}` - Delete agent

### Audit Logs (Journal) - NEW
- `GET    /api/audit-logs` - Get all logs
- `GET    /api/audit-logs/agent/{agentId}` - Get logs by agent
- `GET    /api/audit-logs/module/{module}` - Get logs by module
- `GET    /api/audit-logs/date-range?start=...&end=...` - Get logs by date range
- `POST   /api/audit-logs` - Create new log entry

### Students
- `GET    /api/students` - Get all students
- `GET    /api/students/{id}` - Get student by ID
- `POST   /api/students` - Create new student
- `PUT    /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### Parents
- `GET    /api/parents` - Get all parents
- `GET    /api/parents/{id}` - Get parent by ID
- `POST   /api/parents` - Create new parent
- `PUT    /api/parents/{id}` - Update parent
- `DELETE /api/parents/{id}` - Delete parent

### Teachers
- `GET    /api/teachers` - Get all teachers
- `GET    /api/teachers/{id}` - Get teacher by ID
- `POST   /api/teachers` - Create new teacher
- `PUT    /api/teachers/{id}` - Update teacher
- `DELETE /api/teachers/{id}` - Delete teacher

### Attendance (Présences)
- `GET    /api/attendances` - Get all attendances
- `GET    /api/attendances/student/{studentId}` - Get by student
- `GET    /api/attendances/date/{date}` - Get by date
- `POST   /api/attendances` - Mark attendance
- `POST   /api/attendances/bulk` - Bulk attendance marking

### Grades (Notes)
- `GET    /api/grades` - Get all grades
- `GET    /api/grades/student/{studentId}` - Get by student
- `GET    /api/grades/report/{studentId}?semester={S1|S2}` - Get student report
- `POST   /api/grades` - Create grade
- `PUT    /api/grades/{id}` - Update grade
- `DELETE /api/grades/{id}` - Delete grade

### Transactions (Finances)
- `GET    /api/transactions` - Get all transactions
- `GET    /api/transactions/parent/{parentId}` - Get by parent
- `GET    /api/transactions/summary` - Financial summary
- `POST   /api/transactions` - Create transaction
- `POST   /api/transactions/split-payment` - Process split payment

## Seed Data Contents

### Agents (3 users)
1. **Sarah El Mansouri** - Active (students, presences, notes, parents)
2. **Karim Benali** - Active (students, parents, presences, emploi_du_temps)
3. **Amina Tazi** - Inactive (finances)

Default password for all: `password123` (will be hashed in production)

### Parents (5 parents)
- Mohammed El Amrani (2 children, 15,000 MAD arrears)
- Ahmed Benjelloun (3 children, 45,000 MAD arrears)
- Rachid Alami (1 child, no arrears)
- Nadia Fassi (2 children, 30,000 MAD arrears)
- Youssef Idrissi (1 child, 15,000 MAD arrears)

### Students (11 students)
- Distributed across classes: 6ème A, 6ème B, 5ème A, 5ème B, 4ème A, 4ème B
- Mix of active and inactive statuses
- Linked to parents with realistic family structures

### Teachers (5 teachers)
- Mohammed Bennani (Mathématiques)
- Fatima Alaoui (Physique-Chimie)
- Youssef El Fassi (Informatique)
- Sara Idrissi (Français)
- Karim Tazi (Anglais)

### Attendance Records
- Today's attendance for multiple students and sessions
- Historical attendance data (yesterday, last week)
- Mix of present, late, and absent statuses

### Grades
- Multiple evaluation types: WRITTEN, HOMEWORK, PRACTICAL
- Different subjects and coefficients
- Semester S1 data for academic year 2024-2025

### Transactions
- Payment records with various methods (CASH, CHEQUE, BANK_TRANSFER)
- Mix of completed and pending transactions
- Linked to specific students and academic year

### Audit Logs (14 entries)
- Recent activity (today, yesterday, last week)
- Various actions: CREATE, UPDATE, DELETE, VIEW
- Different modules: Étudiants, Parents, Présences, Notes, Finances
- System events (backup, login)

## Data Relationships

```
Parent (1) ──── (N) Students
Student (1) ──── (N) Grades
Student (1) ──── (N) Attendances
Student (1) ──── (N) Transactions
Parent (1) ──── (N) Transactions
Teacher (1) ──── (N) Grades
```

## Security Configuration

The current `SecurityConfig` disables CSRF and allows all requests. For production:

1. Enable authentication
2. Implement JWT tokens
3. Add role-based access control
4. Hash passwords with BCrypt
5. Enable HTTPS

## Testing the API

Use tools like:
- **Postman** - Import the collection (create one)
- **curl** - Command line testing
- **Frontend Application** - React app

Example curl request:
```bash
# Get all students
curl http://localhost:8080/api/students

# Get all agents
curl http://localhost:8080/api/agents

# Get audit logs
curl http://localhost:8080/api/audit-logs
```

## Troubleshooting

### Tables not created
- Check `spring.jpa.hibernate.ddl-auto=update` in application.properties
- Verify MySQL connection
- Check logs for errors

### Seed data fails
- Ensure tables are created first (run app once)
- Check foreign key constraints
- Verify MySQL user has INSERT permissions

### Port 8080 already in use
Change port in application.properties:
```properties
server.port=8081
```

## Development Notes

### New Entities Added
1. **Agent** - Administrative users with permissions
2. **AuditLog** - Activity tracking for the Journal feature

### Enhanced Entities
1. **Student** - Added `address` field
2. **Parent** - Added `avatarUrl`, `cin`, `nationality`, `profession` fields

### TODO for Production
- [ ] Implement password hashing (BCrypt)
- [ ] Add JWT authentication
- [ ] Implement proper authorization
- [ ] Add input validation
- [ ] Add pagination for large datasets
- [ ] Implement proper error handling
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add unit and integration tests
- [ ] Configure CORS properly
- [ ] Add logging framework
- [ ] Implement caching where appropriate

## Support

For issues or questions, check:
- Application logs: `logs/spring-boot-application.log`
- MySQL logs
- Console output

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Author:** EduManager Team
