
import { Exam, CreateExamData, Question, ExamSubmission } from '@/types';

// Mock exam data
let mockExams: Exam[] = [
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
    id: '4',
    text: 'What is JSX?',
    options: ['A JavaScript framework', 'A syntax extension for JavaScript', 'A CSS preprocessor', 'A database'],
    correctAnswer: 1
  },
  {
    id: '5',
    text: 'Which hook is used for state management in functional components?',
    options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    correctAnswer: 1
  }]

}];


// Mock submissions data
let mockSubmissions: ExamSubmission[] = [
{
  id: '1',
  userId: '1',
  userEmail: 'user@example.com',
  userName: 'John Doe',
  examId: '1',
  examTitle: 'JavaScript Fundamentals',
  answers: { '1': 2, '2': 0, '3': 2 },
  score: 100,
  submittedAt: '2024-01-16T15:30:00Z',
  timeSpent: 25
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

    // Calculate score
    let correctAnswers = 0;
    exam.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round(correctAnswers / exam.questions.length * 100);

    const submission: ExamSubmission = {
      id: (mockSubmissions.length + 1).toString(),
      userId,
      userEmail,
      userName,
      examId,
      examTitle: exam.title,
      answers,
      score,
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
  }
};