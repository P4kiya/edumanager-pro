export type PaymentFrequency = "MONTHLY" | "TRIMESTRIAL" | "ANNUAL";

export type PaymentMethod = "CASH" | "CHEQUE" | "BANK_TRANSFER" | "OTHER";

export interface Tarif {
  id: number;
  studentId: number;
  studentName: string;
  studentAvatar: string;
  studentInitials: string;
  className: string;
  academicYear: string;
  /** Month the student enrolled: 1–12. 9 = September (start of school year). */
  enrollmentMonth: number;
  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;
  frequency: PaymentFrequency;
  installmentCount: number;
  installmentAmount: number;
  progressPercent: number;
  description?: string;
}

export interface MockStudent {
  id: number;
  name: string;
  initials: string;
  avatar: string;
  className: string;
  parentId: number;
}

export interface MockParent {
  id: number;
  name: string;
  childrenIds: number[];
}

export interface SplitLine {
  studentId: number;
  studentName: string;
  className: string;
  tarifRemaining: number;
  amount: string;
  selected: boolean;
}

// ── Receipt ──────────────────────────────────────────────────────────────────

export interface PaymentLine {
  studentName: string;
  className: string;
  description: string;
  amount: number;
  /** Balance remaining for this student after this payment. */
  remainingAfterPayment: number;
}

export interface ReceiptData {
  receiptNumber: string;
  /** ISO date string (YYYY-MM-DD) */
  issuedAt: string;
  parentName: string;
  academicYear: string;
  paymentMethod: PaymentMethod;
  /** Cheque number, virement ref, bon de caisse, etc. */
  reference?: string;
  lines: PaymentLine[];
  totalAmount: number;
  schoolName: string;
  schoolAddress?: string;
}
