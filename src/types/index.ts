export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  subject?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  sectionId?: string;
  createdAt?: string;
  createdBy?: string;
  id?: string;
}

export interface QuestionBank {
  id: string;
  subject: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  questions: Question[];
  createdAt: string;
  createdBy: string;
}

export interface ExamSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  timeLimit?: number; // in minutes, optional per-section time limit
  order: number;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  timeLimit: number; // in minutes
  questions: Question[];
  password: string;
  sections: ExamSection[];
  isPublished: boolean;
  isDraft: boolean;
  createdAt: string;
  createdBy: string;
  totalQuestions: number;
  allowBreaks: boolean;
  breakTimeLimit?: number; // in minutes, max break time allowed
}

export interface ExamSubmission {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  examId: string;
  examTitle: string;
  answers: Record<string, number>;
  score: number;
  totalMarks: number;
  submittedAt: string;
  timeSpent: number;
  sectionScores?: Record<string, number>;
  breakTimeUsed?: number;
}

export interface StudentRanking {
  userId: string;
  userName: string;
  userEmail: string;
  totalScore: number;
  totalExams: number;
  averageScore: number;
  rank: number;
}

export interface ExamRanking {
  examId: string;
  examTitle: string;
  submissions: ExamSubmissionWithRank[];
}

export interface ExamSubmissionWithRank extends ExamSubmission {
  rank: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface CreateExamData {
  title: string;
  description?: string;
  timeLimit: number;
  password: string;
  sections: Omit<ExamSection, 'id'>[];
  allowBreaks: boolean;
  breakTimeLimit?: number;
}

export interface CreateQuestionBankData {
  subject: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  questions: Omit<Question, 'id'>[];
}

export interface QuestionFilter {
  subject?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  search?: string;
}

export interface ExamProgress {
  currentSectionIndex: number;
  currentQuestionIndex: number;
  answers: Record<string, number>;
  timeSpent: number;
  isOnBreak: boolean;
  breakTimeUsed: number;
  lastActiveTime: number;
}

export interface BreakSession {
  startTime: number;
  endTime?: number;
  duration: number;
}

export interface FileUploadProps {
  onFileUpload: (file: File) => void;
  // define your props here
}