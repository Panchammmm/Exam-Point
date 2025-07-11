import {
  Exam,
  CreateExamData,
  Question,
  ExamSubmission,
  StudentRanking,
  ExamRanking,
  ExamSubmissionWithRank,
  ExamSection,
  QuestionBank,
  CreateQuestionBankData,
  QuestionFilter,
  ExamProgress } from
'@/types';

// Mock question bank data
const mockQuestionBanks: QuestionBank[] = [
{
  id: '1',
  subject: 'Math',
  topic: 'Algebra',
  difficulty: 'medium',
  tags: ['equations', 'algebra'],
  questions: [
  {
    id: 'q1',
    text: 'Solve for x: 2x + 5 = 15',
    options: ['5', '10', '15', '20'],
    correctAnswer: 0,
    subject: 'Math',
    topic: 'Algebra',
    difficulty: 'medium'
  },
  {
    id: 'q2',
    text: 'What is the value of x in 3x - 7 = 14?',
    options: ['6', '7', '8', '9'],
    correctAnswer: 1,
    subject: 'Math',
    topic: 'Algebra',
    difficulty: 'medium'
  }],

  createdAt: new Date().toISOString(),
  createdBy: 'admin@example.com'
},
{
  id: '2',
  subject: 'Science',
  topic: 'Physics',
  difficulty: 'hard',
  tags: ['motion', 'physics'],
  questions: [
  {
    id: 'q3',
    text: 'What is the formula for kinetic energy?',
    options: ['KE = mv²', 'KE = ½mv²', 'KE = m²v', 'KE = 2mv'],
    correctAnswer: 1,
    subject: 'Science',
    topic: 'Physics',
    difficulty: 'hard'
  }],

  createdAt: new Date().toISOString(),
  createdBy: 'admin@example.com'
}];


// Mock exam data with sections
const mockExams: Exam[] = [
{
  id: '1',
  title: 'SSC Combined Graduate Level',
  description: 'Comprehensive examination covering multiple subjects',
  timeLimit: 120,
  password: 'ssc123',
  isPublished: true,
  isDraft: false,
  createdAt: '2024-01-15T10:00:00Z',
  createdBy: 'admin@example.com',
  totalQuestions: 8,
  allowBreaks: true,
  breakTimeLimit: 900, // 15 minutes
  sections: [
  {
    id: 'sec1',
    title: 'General Intelligence & Reasoning',
    description: 'Logical reasoning and problem-solving questions',
    order: 1,
    questions: [
    {
      id: '1',
      text: 'Complete the series: 2, 4, 8, 16, ?',
      options: ['24', '32', '28', '20'],
      correctAnswer: 1,
      subject: 'Reasoning',
      sectionId: 'sec1'
    },
    {
      id: '2',
      text: 'If A = 1, B = 2, C = 3, then CAB = ?',
      options: ['312', '123', '321', '132'],
      correctAnswer: 0,
      subject: 'Reasoning',
      sectionId: 'sec1'
    },
    {
      id: '3',
      text: 'Find the odd one out: Dog, Cat, Lion, Car',
      options: ['Dog', 'Cat', 'Lion', 'Car'],
      correctAnswer: 3,
      subject: 'Reasoning',
      sectionId: 'sec1'
    }]

  },
  {
    id: 'sec2',
    title: 'General Knowledge & Current Affairs',
    description: 'Questions on general awareness and current events',
    order: 2,
    questions: [
    {
      id: '4',
      text: 'Who is the current Prime Minister of India?',
      options: ['Narendra Modi', 'Rahul Gandhi', 'Amit Shah', 'Manmohan Singh'],
      correctAnswer: 0,
      subject: 'General Knowledge',
      sectionId: 'sec2'
    },
    {
      id: '5',
      text: 'Which is the largest planet in our solar system?',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 2,
      subject: 'General Knowledge',
      sectionId: 'sec2'
    }]

  },
  {
    id: 'sec3',
    title: 'Quantitative Aptitude',
    description: 'Mathematical and numerical ability questions',
    order: 3,
    questions: [
    {
      id: '6',
      text: 'What is 25% of 80?',
      options: ['15', '20', '25', '30'],
      correctAnswer: 1,
      subject: 'Math',
      sectionId: 'sec3'
    },
    {
      id: '7',
      text: 'If the area of a square is 64 sq cm, what is its perimeter?',
      options: ['16 cm', '24 cm', '32 cm', '48 cm'],
      correctAnswer: 2,
      subject: 'Math',
      sectionId: 'sec3'
    },
    {
      id: '8',
      text: 'What is the compound interest on Rs. 1000 at 10% per annum for 2 years?',
      options: ['Rs. 200', 'Rs. 210', 'Rs. 220', 'Rs. 230'],
      correctAnswer: 1,
      subject: 'Math',
      sectionId: 'sec3'
    }]

  }],
  questions: [
    {
      id: '1',
      text: 'Complete the series: 2, 4, 8, 16, ?',
      options: ['24', '32', '28', '20'],
      correctAnswer: 1,
      subject: 'Reasoning',
      sectionId: 'sec1'
    },
    {
      id: '2',
      text: 'If A = 1, B = 2, C = 3, then CAB = ?',
      options: ['312', '123', '321', '132'],
      correctAnswer: 0,
      subject: 'Reasoning',
      sectionId: 'sec1'
    },
    {
      id: '3',
      text: 'Find the odd one out: Dog, Cat, Lion, Car',
      options: ['Dog', 'Cat', 'Lion', 'Car'],
      correctAnswer: 3,
      subject: 'Reasoning',
      sectionId: 'sec1'
    },
    {
      id: '4',
      text: 'Who is the current Prime Minister of India?',
      options: ['Narendra Modi', 'Rahul Gandhi', 'Amit Shah', 'Manmohan Singh'],
      correctAnswer: 0,
      subject: 'General Knowledge',
      sectionId: 'sec2'
    },
    {
      id: '5',
      text: 'Which is the largest planet in our solar system?',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 2,
      subject: 'General Knowledge',
      sectionId: 'sec2'
    },
    {
      id: '6',
      text: 'What is 25% of 80?',
      options: ['15', '20', '25', '30'],
      correctAnswer: 1,
      subject: 'Math',
      sectionId: 'sec3'
    },
    {
      id: '7',
      text: 'If the area of a square is 64 sq cm, what is its perimeter?',
      options: ['16 cm', '24 cm', '32 cm', '48 cm'],
      correctAnswer: 2,
      subject: 'Math',
      sectionId: 'sec3'
    },
    {
      id: '8',
      text: 'What is the compound interest on Rs. 1000 at 10% per annum for 2 years?',
      options: ['Rs. 200', 'Rs. 210', 'Rs. 220', 'Rs. 230'],
      correctAnswer: 1,
      subject: 'Math',
      sectionId: 'sec3'
    }
  ]
},
{
  id: '2',
  title: 'Railway Recruitment Board Exam',
  description: 'Technical and general knowledge examination',
  timeLimit: 90,
  password: 'rail456',
  isPublished: false,
  isDraft: true,
  createdAt: '2024-01-20T14:30:00Z',
  createdBy: 'admin@example.com',
  totalQuestions: 4,
  allowBreaks: true,
  breakTimeLimit: 600, // 10 minutes
  sections: [
  {
    id: 'sec4',
    title: 'Technical Section',
    description: 'Technical questions related to railway operations',
    order: 1,
    questions: [
    {
      id: '9',
      text: 'What is the standard gauge of Indian Railways?',
      options: ['1435 mm', '1676 mm', '1000 mm', '1524 mm'],
      correctAnswer: 1,
      subject: 'Technical',
      sectionId: 'sec4'
    },
    {
      id: '10',
      text: 'Which signal indicates "Stop"?',
      options: ['Green', 'Yellow', 'Red', 'Blue'],
      correctAnswer: 2,
      subject: 'Technical',
      sectionId: 'sec4'
    }]

  },
  {
    id: 'sec5',
    title: 'General Awareness',
    description: 'General knowledge questions',
    order: 2,
    questions: [
    {
      id: '11',
      text: 'When was Indian Railways established?',
      options: ['1853', '1854', '1855', '1856'],
      correctAnswer: 0,
      subject: 'General Knowledge',
      sectionId: 'sec5'
    },
    {
      id: '12',
      text: 'Which is the longest railway platform in India?',
      options: ['Gorakhpur', 'Kharagpur', 'Kollam', 'Bilaspur'],
      correctAnswer: 0,
      subject: 'General Knowledge',
      sectionId: 'sec5'
    }]

  }],
  questions: [
    {
      id: '9',
      text: 'What is the standard gauge of Indian Railways?',
      options: ['1435 mm', '1676 mm', '1000 mm', '1524 mm'],
      correctAnswer: 1,
      subject: 'Technical',
      sectionId: 'sec4'
    },
    {
      id: '10',
      text: 'Which signal indicates "Stop"?',
      options: ['Green', 'Yellow', 'Red', 'Blue'],
      correctAnswer: 2,
      subject: 'Technical',
      sectionId: 'sec4'
    },
    {
      id: '11',
      text: 'When was Indian Railways established?',
      options: ['1853', '1854', '1855', '1856'],
      correctAnswer: 0,
      subject: 'General Knowledge',
      sectionId: 'sec5'
    },
    {
      id: '12',
      text: 'Which is the longest railway platform in India?',
      options: ['Gorakhpur', 'Kharagpur', 'Kollam', 'Bilaspur'],
      correctAnswer: 0,
      subject: 'General Knowledge',
      sectionId: 'sec5'
    }
  ]
}];


// Mock submissions data
const mockSubmissions: ExamSubmission[] = [
{
  id: '1',
  userId: '1',
  userEmail: 'user@example.com',
  userName: 'John Doe',
  examId: '1',
  examTitle: 'SSC Combined Graduate Level',
  answers: { '1': 1, '2': 0, '3': 3, '4': 0, '5': 2, '6': 1, '7': 2, '8': 1 },
  score: 8,
  totalMarks: 8,
  submittedAt: '2024-01-16T15:30:00Z',
  timeSpent: 105,
  sectionScores: { 'sec1': 3, 'sec2': 2, 'sec3': 3 },
  breakTimeUsed: 300 // 5 minutes
}];

// Mock exam progress data (for break functionality)
const mockExamProgress: Record<string, ExamProgress> = {};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const examService = {
  // Question Bank Methods
  async getQuestionBanks(): Promise<QuestionBank[]> {
    await delay(500);
    return mockQuestionBanks;
  },

  async createQuestionBank(data: CreateQuestionBankData): Promise<QuestionBank> {
    await delay(1000);

    const newBank: QuestionBank = {
      id: (mockQuestionBanks.length + 1).toString(),
      ...data,
      questions: data.questions.map((q, index) => ({
        ...q,
        id: `qb${mockQuestionBanks.length + 1}_${index + 1}`,
        createdAt: new Date().toISOString()
      })),
      createdAt: new Date().toISOString(),
      createdBy: 'admin@example.com'
    };

    mockQuestionBanks.push(newBank);
    return newBank;
  },

  async getQuestionsByFilter(filter: QuestionFilter): Promise<Question[]> {
    await delay(500);

    let allQuestions: Question[] = [];
    mockQuestionBanks.forEach((bank) => {
      allQuestions = [...allQuestions, ...bank.questions];
    });

    let filtered = allQuestions;

    if (filter.subject) {
      filtered = filtered.filter((q) => q.subject === filter.subject);
    }
    if (filter.topic) {
      filtered = filtered.filter((q) => q.topic === filter.topic);
    }
    if (filter.difficulty) {
      filtered = filtered.filter((q) => q.difficulty === filter.difficulty);
    }
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter((q) =>
      q.tags?.some((tag) => filter.tags?.includes(tag))
      );
    }
    if (filter.search) {
      filtered = filtered.filter((q) =>
      q.text.toLowerCase().includes(filter.search!.toLowerCase()) ||
      q.options.some((opt) => opt.toLowerCase().includes(filter.search!.toLowerCase()))
      );
    }

    return filtered;
  },

  async addQuestionToBank(bankId: string, question: Omit<Question, 'id'>): Promise<Question> {
    await delay(500);

    const bank = mockQuestionBanks.find((b) => b.id === bankId);
    if (!bank) {
      throw new Error('Question bank not found');
    }

    const newQuestion: Question = {
      ...question,
      id: `${bankId}_q${bank.questions.length + 1}`,
      createdAt: new Date().toISOString()
    };

    bank.questions.push(newQuestion);
    return newQuestion;
  },

  async bulkAddQuestions(bankId: string, questions: Omit<Question, 'id'>[]): Promise<Question[]> {
    await delay(1000);

    const bank = mockQuestionBanks.find((b) => b.id === bankId);
    if (!bank) {
      throw new Error('Question bank not found');
    }

    const newQuestions: Question[] = questions.map((q, index) => ({
      ...q,
      id: `${bankId}_bulk${Date.now()}_${index}`,
      createdAt: new Date().toISOString()
    }));

    bank.questions.push(...newQuestions);
    return newQuestions;
  },

  // Exam Methods (Updated)
  async getPublishedExams(): Promise<Exam[]> {
    await delay(500);
    return mockExams.filter((exam) => exam.isPublished && !exam.isDraft);
  },

  async getAllExams(): Promise<Exam[]> {
    await delay(500);
    return mockExams;
  },

  async getDraftExams(): Promise<Exam[]> {
    await delay(500);
    return mockExams.filter((exam) => exam.isDraft);
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

    const totalQuestions = examData.sections.reduce((sum, section) => sum + section.questions.length, 0);

    const sectionsWithIds = examData.sections.map((section, sectionIndex) => ({
      ...section,
      id: `sec${mockExams.length + 1}_${sectionIndex + 1}`,
      questions: section.questions.map((q, questionIndex) => ({
        ...q,
        id: `${mockExams.length + 1}_${sectionIndex + 1}_${questionIndex + 1}`,
        sectionId: `sec${mockExams.length + 1}_${sectionIndex + 1}`
      }))
    }));

    const allQuestions = sectionsWithIds.flatMap(section => section.questions);

    const newExam: Exam = {
      id: (mockExams.length + 1).toString(),
      title: examData.title,
      description: examData.description,
      timeLimit: examData.timeLimit,
      password: examData.password,
      isPublished: false,
      isDraft: true,
      createdAt: new Date().toISOString(),
      createdBy: 'admin@example.com',
      totalQuestions,
      allowBreaks: examData.allowBreaks,
      breakTimeLimit: examData.breakTimeLimit,
      sections: sectionsWithIds,
      questions: allQuestions
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
    return this.updateExam(id, { isPublished: true, isDraft: false });
  },

  async unpublishExam(id: string): Promise<Exam> {
    return this.updateExam(id, { isPublished: false });
  },

  async saveToDraft(id: string): Promise<Exam> {
    return this.updateExam(id, { isDraft: true, isPublished: false });
  },

  // Exam Progress Methods (for break functionality)
  async getExamProgress(userId: string, examId: string): Promise<ExamProgress | null> {
    await delay(300);
    const key = `${userId}_${examId}`;
    return mockExamProgress[key] || null;
  },

  async saveExamProgress(userId: string, examId: string, progress: ExamProgress): Promise<void> {
    await delay(300);
    const key = `${userId}_${examId}`;
    mockExamProgress[key] = progress;
  },

  async clearExamProgress(userId: string, examId: string): Promise<void> {
    await delay(300);
    const key = `${userId}_${examId}`;
    delete mockExamProgress[key];
  },

  async submitExam(
  examId: string,
  userId: string,
  userEmail: string,
  userName: string,
  answers: Record<string, number>,
  timeSpent: number,
  breakTimeUsed?: number)
  : Promise<ExamSubmission> {
    await delay(1000);

    const exam = await this.getExamById(examId);

    // Calculate total score and section scores
    let totalScore = 0;
    const sectionScores: Record<string, number> = {};

    exam.sections.forEach((section) => {
      let sectionScore = 0;
      section.questions.forEach((question) => {
        if (answers[question.id] === question.correctAnswer) {
          sectionScore++;
          totalScore++;
        }
      });
      sectionScores[section.id] = sectionScore;
    });

    const submission: ExamSubmission = {
      id: (mockSubmissions.length + 1).toString(),
      userId,
      userEmail,
      userName,
      examId,
      examTitle: exam.title,
      answers,
      score: totalScore,
      totalMarks: exam.totalQuestions,
      submittedAt: new Date().toISOString(),
      timeSpent,
      sectionScores,
      breakTimeUsed: breakTimeUsed || 0
    };

    mockSubmissions.push(submission);

    // Clear exam progress after submission
    await this.clearExamProgress(userId, examId);

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

    const sortedSubmissions = examSubmissions.
    sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeSpent - b.timeSpent;
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