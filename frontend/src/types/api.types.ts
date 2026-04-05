// Backend DTO Types - matching Java DTOs exactly

export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type AgentStatus = 'ACTIVE' | 'INACTIVE';
export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT';
export type AttendanceSession = 'SESSION_1' | 'SESSION_2' | 'SESSION_3' | 'SESSION_4';
export type EvaluationType = 'CONTROL' | 'DS' | 'EXAM' | 'TP' | 'ORAL';
export type Semester = 'S1' | 'S2';
export type TransactionType = 'TUITION' | 'INSCRIPTION' | 'OTHER';
export type TransactionStatus = 'PAID' | 'PENDING' | 'OVERDUE';
export type PaymentMethod = 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'OTHER';

// Student DTOs
export interface StudentDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  address: string;
  birthDate: string; // ISO date string
  status: StudentStatus;
  className: string;
  parentId: number;
  parentName: string;
  createdAt: string; // ISO datetime string
  updatedAt: string;
}

export interface StudentRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  address: string;
  birthDate: string; // YYYY-MM-DD format
  status: StudentStatus;
  className: string;
  parentId: number;
}

// Parent DTOs
export interface ParentDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  arrears: number; // BigDecimal from backend
  childrenIds: number[];
  childrenNames: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ParentRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  arrears?: number;
}

// Agent DTOs
export interface AgentDTO {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: AgentStatus;
  permissions: string[];
  createdAt: string;
}

export interface AgentRequest {
  name: string;
  email: string;
  phone: string;
  password?: string;
  status: AgentStatus;
  permissions: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  status: string;
  role: string;
  message: string;
}

// Attendance DTOs
export interface AttendanceDTO {
  id: number;
  studentId: number;
  studentName: string;
  date: string; // LocalDate ISO format
  session: AttendanceSession;
  status: AttendanceStatus;
  className: string;
  markedByTeacher: string;
  notes?: string;
  createdAt: string;
}

export interface AttendanceRequest {
  studentId: number;
  date: string; // YYYY-MM-DD
  session: AttendanceSession;
  status: AttendanceStatus;
  markedByTeacher: string;
  notes?: string;
}

export interface BulkAttendanceRequest {
  date: string;
  session: AttendanceSession;
  className: string;
  markedByTeacher: string;
}

export interface AttendanceStatsDTO {
  totalDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  attendanceRate: number;
}

// Grade DTOs
export interface GradeDTO {
  id: number;
  studentId: number;
  studentName: string;
  teacherId: number;
  teacherName: string;
  moduleName: string;
  evaluationType: EvaluationType;
  semester: Semester;
  score: number;
  coefficient: number;
  weightedScore: number;
  academicYear: string;
  gradedAt: string; // LocalDate
  createdAt: string;
}

export interface GradeRequest {
  studentId: number;
  teacherId?: number;
  moduleName: string;
  evaluationType: EvaluationType;
  semester: Semester;
  score: number;
  coefficient: number;
  academicYear: string;
  gradedAt: string; // YYYY-MM-DD
}

export interface GradeReportDTO {
  studentId: number;
  studentName: string;
  academicYear: string;
  modules: ModuleReportDTO[];
  overallAverage: number;
}

export interface ModuleReportDTO {
  moduleName: string;
  coefficient: number;
  grades: GradeDTO[];
  moduleAverage: number;
  weightedAverage: number;
}

// Transaction DTOs
export interface TransactionDTO {
  id: number;
  studentId: number;
  studentName: string;
  parentId: number;
  parentName: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  dueDate?: string; // LocalDate
  paidAt?: string; // LocalDateTime
  description: string;
  receiptNumber?: string;
  academicYear: string;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionRequest {
  studentId: number;
  parentId: number;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  dueDate?: string;
  paidAt?: string;
  description: string;
  academicYear: string;
  paymentMethod?: PaymentMethod;
}

// Audit Log DTOs
export interface AuditLogDTO {
  id: number;
  agentId: number;
  agentName: string;
  module: string;
  action: string;
  description: string;
  target?: string;
  ipAddress: string;
  timestamp: string;
}

export interface AuditLogRequest {
  agentId: number;
  module: string;
  action: string;
  description: string;
  target?: string;
  ipAddress: string;
}

// Teacher DTOs (referenced in grades)
export interface TeacherDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  specialization: string;
  status: string;
  subjects: string[];
  assignedClasses: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummaryDTO {
  academicYear: string;
  totalRevenue: number;
  totalPending: number;
  totalOverdue: number;
  transactionCount: number;
}

export interface SchoolSettingsDTO {
  id: number;
  schoolName: string;
  email: string;
  phone: string;
  address: string;
  logoData?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolSettingsRequest {
  schoolName: string;
  email: string;
  phone: string;
  address: string;
  logoData?: string | null;
}

// Paginated Response
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
