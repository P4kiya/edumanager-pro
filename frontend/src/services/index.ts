// Central export for all services
export { default as studentService } from './student.service';
export { default as parentService } from './parent.service';
export { default as agentService } from './agent.service';
export { default as attendanceService } from './attendance.service';
export { default as gradeService } from './grade.service';
export { default as transactionService } from './transaction.service';
export { default as auditLogService } from './audit-log.service';
export { default as teacherService } from './teacher.service';
export { apiClient } from './api-client';

// Re-export types for convenience
export type * from '@/types/api.types';
