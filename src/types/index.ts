
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: string;
  title: string;
  timeLimit: number; // in minutes
  password: string;
  questions: Question[];
  isPublished: boolean;
  createdAt: string;
  createdBy: string;
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
  timeLimit: number;
  password: string;
  questions: Omit<Question, 'id'>[];
}