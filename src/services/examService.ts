
import { Exam, CreateExamData, Question, ExamSubmission, StudentRanking, ExamRanking, ExamSubmissionWithRank } from '@/types';

// Mock exam data
const mockExams: Exam[] = [
{
  id: '1',
  title: 'JavaScript Fundamentals',
  timeLimit: 30,
  password: 'js123',
  isPublished: true,
  createdAt: '2024-01-15T10:00:00Z',
  createdBy: 'admin@example.com',
  questions: [
  {
    id: '1',
    text: 'What is the output of console.log(typeof null)?',
    options: ['null', 'undefined', 'object', 'string'],
    correctAnswer: 2
  },
  {
    id: '2',
    text: 'Which method is used to add an element to the end of an array?',
    options: ['push()', 'pop()', 'shift()', 'unshift()'],
    correctAnswer: 0
  },
  {
    id: '3',
    text: 'What does the "this" keyword refer to in JavaScript?',
    options: ['The current function', 'The global object', 'The calling object', 'None of the above'],
    correctAnswer: 2
  },
  {
    id: '4',
    text: 'Which of the following is not a JavaScript data type?',
    options: ['Number', 'String', 'Boolean', 'Float'],
    correctAnswer: 3
  },
  {
    id: '5',
    text: 'What is closure in JavaScript?',
    options: ['A function with access to outer scope', 'A way to close files', 'A type of loop', 'A CSS property'],
    correctAnswer: 0
  }]

},
{
  id: '2',
  title: 'React Basics',
  timeLimit: 45,
  password: 'react456',
  isPublished: true,
  createdAt: '2024-01-20T14:30:00Z',
  createdBy: 'admin@example.com',
  questions: [
  {
    id: '6',
    text: 'What is JSX?',
    options: ['A JavaScript framework', 'A syntax extension for JavaScript', 'A CSS preprocessor', 'A database'],
    correctAnswer: 1
  },
  {
    id: '7',
    text: 'Which hook is used for state management in functional components?',
    options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    correctAnswer: 1
  },
  {
    id: '8',
    text: 'What is the virtual DOM?',
    options: ['A copy of the real DOM', 'A JavaScript library', 'A CSS framework', 'A database'],
    correctAnswer: 0
  }]

}];

// Mock submissions data
const mockSubmissions: ExamSubmission[] = [
{
  id: '1',
  userId: '1',
  userEmail: 'user@example.com',
  userName: 'John Doe',
  examId: '1',
  examTitle: 'JavaScript Fundamentals',
  answers: { '1': 2, '2': 0, '3': 2, '4': 3, '5': 0 },
  score: 4,
  totalMarks: 5,
  submittedAt: '2024-01-16T15:30:00Z',
  timeSpent: 25
},
{
  id: '2',
  userId: '2',
  userEmail: 'jane@example.com',
  userName: 'Jane Smith',
  examId: '1',
  examTitle: 'JavaScript Fundamentals',
  answers: { '1': 2, '2': 0, '3': 2, '4': 3, '5': 1 },
  score: 3,
  totalMarks: 5,
  submittedAt: '2024-01-16T16:30:00Z',
  timeSpent: 28
},
{
  id: '3',
  userId: '3',
  userEmail: 'bob@example.com',
  userName: 'Bob Johnson',
  examId: '1',
  examTitle: 'JavaScript Fundamentals',
  answers: { '1': 2, '2': 0, '3': 2, '4': 3, '5': 0 },
  score: 5,
  totalMarks: 5,
  submittedAt: '2024-01-16T17:30:00Z',
  timeSpent: 22
},
{
  id: '4',
  userId: '1',
  userEmail: 'user@example.com',
  userName: 'John Doe',
  examId: '2',
  examTitle: 'React Basics',
  answers: { '6': 1, '7': 1, '8': 0 },
  score: 3,
  totalMarks: 3,
  submittedAt: '2024-01-21T15:30:00Z',
  timeSpent: 35
}];


const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const examService = {
  async getPublishedExams(): Promise<Exam[]> {
    await delay(500);
    return mockExams.filter((exam) => exam.isPublished);
  },

  async getAllExams(): Promise<Exam[]> {
    await delay(500);
    return mockExams;
  },

  async getExamById(id: string): Promise<Exam> {
    await delay(500);
    const exam = mockExams.find((e) => e.id === id);
    if (!exam) {
      throw new Error('Exam not found');
    }
    return exam;
  },

  async verifyExamPassword(examId: string, password: string): Promise<boolean> {
    await delay(300);
    const exam = mockExams.find((e) => e.id === examId);
    if (!exam) {
      throw new Error('Exam not found');
    }
    return exam.password === password;
  },

  async createExam(examData: CreateExamData): Promise<Exam> {
    await delay(1000);

    const newExam: Exam = {
      id: (mockExams.length + 1).toString(),
      title: examData.title,
      timeLimit: examData.timeLimit,
      password: examData.password,
      isPublished: false,
      createdAt: new Date().toISOString(),
      createdBy: 'admin@example.com',
      questions: examData.questions.map((q, index) => ({
        ...q,
        id: `${mockExams.length + 1}_${index + 1}`
      }))
    };

    mockExams.push(newExam);
    return newExam;
  },

  async updateExam(id: string, examData: Partial<Exam>): Promise<Exam> {
    await delay(800);

    const examIndex = mockExams.findIndex((e) => e.id === id);
    if (examIndex === -1) {
      throw new Error('Exam not found');
    }

    mockExams[examIndex] = { ...mockExams[examIndex], ...examData };
    return mockExams[examIndex];
  },

  async deleteExam(id: string): Promise<void> {
    await delay(500);

    const examIndex = mockExams.findIndex((e) => e.id === id);
    if (examIndex === -1) {
      throw new Error('Exam not found');
    }

    mockExams.splice(examIndex, 1);
  },

  async publishExam(id: string): Promise<Exam> {
    return this.updateExam(id, { isPublished: true });
  },

  async unpublishExam(id: string): Promise<Exam> {
    return this.updateExam(id, { isPublished: false });
  },

  async submitExam(
  examId: string,
  userId: string,
  userEmail: string,
  userName: string,
  answers: Record<string, number>,
  timeSpent: number)
  : Promise<ExamSubmission> {
    await delay(1000);

    const exam = await this.getExamById(examId);

    // Calculate score (marks)
    let correctAnswers = 0;
    exam.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const totalMarks = exam.questions.length;
    const score = correctAnswers;

    const submission: ExamSubmission = {
      id: (mockSubmissions.length + 1).toString(),
      userId,
      userEmail,
      userName,
      examId,
      examTitle: exam.title,
      answers,
      score,
      totalMarks,
      submittedAt: new Date().toISOString(),
      timeSpent
    };

    mockSubmissions.push(submission);
    return submission;
  },

  async getUserSubmissions(userId: string): Promise<ExamSubmission[]> {
    await delay(500);
    return mockSubmissions.filter((s) => s.userId === userId);
  },

  async getAllSubmissions(): Promise<ExamSubmission[]> {
    await delay(500);
    return mockSubmissions;
  },

  async getSubmissionsByExam(examId: string): Promise<ExamSubmission[]> {
    await delay(500);
    return mockSubmissions.filter((s) => s.examId === examId);
  },

  async getStudentRankings(): Promise<StudentRanking[]> {
    await delay(500);

    // Group submissions by user
    const userStats = new Map<string, {
      userId: string;
      userName: string;
      userEmail: string;
      totalScore: number;
      totalExams: number;
    }>();

    mockSubmissions.forEach((submission) => {
      const existing = userStats.get(submission.userId);
      if (existing) {
        existing.totalScore += submission.score;
        existing.totalExams += 1;
      } else {
        userStats.set(submission.userId, {
          userId: submission.userId,
          userName: submission.userName,
          userEmail: submission.userEmail,
          totalScore: submission.score,
          totalExams: 1
        });
      }
    });

    // Convert to rankings and calculate average
    const rankings: StudentRanking[] = Array.from(userStats.values()).
    map((stats) => ({
      ...stats,
      averageScore: Math.round(stats.totalScore / stats.totalExams * 100) / 100
    })).
    sort((a, b) => b.totalScore - a.totalScore || b.averageScore - a.averageScore).
    map((student, index) => ({
      ...student,
      rank: index + 1
    }));

    return rankings;
  },

  async getExamRankings(examId: string): Promise<ExamRanking> {
    await delay(500);

    const examSubmissions = mockSubmissions.filter((s) => s.examId === examId);
    const exam = mockExams.find((e) => e.id === examId);

    if (!exam) {
      throw new Error('Exam not found');
    }

    // Sort submissions by score (descending) and time spent (ascending for tie-breaking)
    const sortedSubmissions = examSubmissions.
    sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeSpent - b.timeSpent; // Less time is better for same score
    }).
    map((submission, index) => ({
      ...submission,
      rank: index + 1
    }));

    return {
      examId,
      examTitle: exam.title,
      submissions: sortedSubmissions
    };
  },

  async getAllExamRankings(): Promise<ExamRanking[]> {
    await delay(500);

    const examIds = [...new Set(mockSubmissions.map((s) => s.examId))];
    const rankings = await Promise.all(
      examIds.map((examId) => this.getExamRankings(examId))
    );

    return rankings;
  }
};