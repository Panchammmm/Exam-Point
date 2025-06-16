
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { examService } from '@/services/examService';
import { Exam, Question } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import QuestionNavigationPanel from '@/components/QuestionNavigationPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Clock, BookOpen, CheckCircle, Menu, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ExamPage: React.FC = () => {
  const { id } = useParams<{id: string;}>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForLater, setMarkedForLater] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showNavigationPanel, setShowNavigationPanel] = useState(false);
  const [examStartTime] = useState(Date.now());

  // Load exam data
  useEffect(() => {
    if (!id) return;

    const loadExam = async () => {
      try {
        const examData = await examService.getExamById(id);
        setExam(examData);
        setTimeLeft(examData.timeLimit * 60); // Convert minutes to seconds
      } catch (error) {
        console.error('Error loading exam:', error);
        toast({
          title: "Error",
          description: "Failed to load exam. Please try again.",
          variant: "destructive"
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, [id, navigate, toast]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || !exam) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, exam]);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowNavigationPanel(false);
  };

  const handleMarkForLater = () => {
    setMarkedForLater((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  const handleNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitExam = useCallback(async (autoSubmit = false) => {
    if (!exam || !user || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const timeSpent = Math.round((Date.now() - examStartTime) / 1000 / 60); // Convert to minutes

      const submission = await examService.submitExam(
        exam.id,
        user.id,
        user.email,
        user.name,
        answers,
        timeSpent
      );

      toast({
        title: autoSubmit ? "Time's up!" : "Exam submitted successfully!",
        description: `Your score: ${submission.score}/${submission.totalMarks} marks`
      });

      navigate('/profile');
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast({
        title: "Error",
        description: "Failed to submit exam. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [exam, user, answers, examStartTime, navigate, toast, isSubmitting]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!exam) return 0;
    return (currentQuestionIndex + 1) / exam.questions.length * 100;
  };

  const getAnsweredQuestions = () => {
    if (!exam) return new Set<number>();
    const answeredSet = new Set<number>();
    exam.questions.forEach((question, index) => {
      if (answers[question.id] !== undefined) {
        answeredSet.add(index);
      }
    });
    return answeredSet;
  };

  const isTimeRunningOut = timeLeft <= 300; // Last 5 minutes

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" data-id="xokr4o0xm" data-path="src/pages/user/ExamPage.tsx">
        <LoadingSpinner size="lg" text="Loading exam..." data-id="i8m3bl8o4" data-path="src/pages/user/ExamPage.tsx" />
      </div>);

  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" data-id="ugkwg1mpg" data-path="src/pages/user/ExamPage.tsx">
        <div className="text-center" data-id="re51e26il" data-path="src/pages/user/ExamPage.tsx">
          <h1 className="text-2xl font-bold text-gray-900 mb-2" data-id="jfi1zseog" data-path="src/pages/user/ExamPage.tsx">Exam not found</h1>
          <Button onClick={() => navigate('/dashboard')} data-id="g4frvzhb0" data-path="src/pages/user/ExamPage.tsx">Back to Dashboard</Button>
        </div>
      </div>);

  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const answeredQuestions = getAnsweredQuestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" data-id="bevxqkcw5" data-path="src/pages/user/ExamPage.tsx">
      <div className="max-w-7xl mx-auto" data-id="se7ldlq94" data-path="src/pages/user/ExamPage.tsx">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" data-id="4ouk5mg1r" data-path="src/pages/user/ExamPage.tsx">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6" data-id="dlk7wuj41" data-path="src/pages/user/ExamPage.tsx">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6" data-id="2m2hd9jzj" data-path="src/pages/user/ExamPage.tsx">
              <div className="flex justify-between items-center" data-id="f2d5t6per" data-path="src/pages/user/ExamPage.tsx">
                <div data-id="041q7mqd9" data-path="src/pages/user/ExamPage.tsx">
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center" data-id="6sn2o4p2c" data-path="src/pages/user/ExamPage.tsx">
                    <BookOpen className="w-6 h-6 mr-2 text-indigo-600" data-id="v347fhvxk" data-path="src/pages/user/ExamPage.tsx" />
                    {exam.title}
                  </h1>
                  <p className="text-gray-600 mt-1" data-id="q2zmevqub" data-path="src/pages/user/ExamPage.tsx">
                    Question {currentQuestionIndex + 1} of {exam.questions.length}
                  </p>
                </div>
                <div className="text-right" data-id="ru3d44kl6" data-path="src/pages/user/ExamPage.tsx">
                  <div className={`text-2xl font-bold ${isTimeRunningOut ? 'text-red-600' : 'text-indigo-600'}`} data-id="s93g23zct" data-path="src/pages/user/ExamPage.tsx">
                    <Clock className="w-5 h-5 inline mr-1" data-id="uz5qf8x85" data-path="src/pages/user/ExamPage.tsx" />
                    {formatTime(timeLeft)}
                  </div>
                  {isTimeRunningOut &&
                  <p className="text-red-500 text-sm mt-1" data-id="rkr3wc7w0" data-path="src/pages/user/ExamPage.tsx">Time running out!</p>
                  }
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4" data-id="ag5m3o4at" data-path="src/pages/user/ExamPage.tsx">
                <Progress value={getProgress()} className="h-2" data-id="d212f4jeu" data-path="src/pages/user/ExamPage.tsx" />
              </div>

              {/* Mobile Navigation Toggle */}
              <div className="lg:hidden mt-4" data-id="n0ahh7vf1" data-path="src/pages/user/ExamPage.tsx">
                <Button
                  variant="outline"
                  onClick={() => setShowNavigationPanel(!showNavigationPanel)}
                  className="w-full" data-id="k83rs22f8" data-path="src/pages/user/ExamPage.tsx">

                  {showNavigationPanel ? <X className="w-4 h-4 mr-2" data-id="xs6xprf13" data-path="src/pages/user/ExamPage.tsx" /> : <Menu className="w-4 h-4 mr-2" data-id="bcheq8vc3" data-path="src/pages/user/ExamPage.tsx" />}
                  {showNavigationPanel ? 'Hide' : 'Show'} Question Navigation
                </Button>
              </div>
            </div>

            {/* Mobile Navigation Panel */}
            {showNavigationPanel &&
            <div className="lg:hidden" data-id="24g7hiog7" data-path="src/pages/user/ExamPage.tsx">
                <QuestionNavigationPanel
                totalQuestions={exam.questions.length}
                currentQuestionIndex={currentQuestionIndex}
                answeredQuestions={answeredQuestions}
                markedForLater={markedForLater}
                onQuestionSelect={handleQuestionSelect}
                onMarkForLater={handleMarkForLater}
                onPrevious={handlePreviousQuestion}
                onNext={handleNextQuestion}
                isFirstQuestion={currentQuestionIndex === 0}
                isLastQuestion={currentQuestionIndex === exam.questions.length - 1} data-id="5cjmjkq50" data-path="src/pages/user/ExamPage.tsx" />

              </div>
            }

            {/* Question Card */}
            <Card data-id="v0e393ptw" data-path="src/pages/user/ExamPage.tsx">
              <CardHeader data-id="mdpy82x5j" data-path="src/pages/user/ExamPage.tsx">
                <CardTitle className="text-lg" data-id="0bx8vp3zu" data-path="src/pages/user/ExamPage.tsx">
                  {currentQuestion.text}
                </CardTitle>
              </CardHeader>
              <CardContent data-id="dqthosm2t" data-path="src/pages/user/ExamPage.tsx">
                <RadioGroup
                  value={answers[currentQuestion.id]?.toString() || ''}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))} data-id="sa8dwvtrk" data-path="src/pages/user/ExamPage.tsx">

                  {currentQuestion.options.map((option, index) =>
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50" data-id="v0xtjwmfm" data-path="src/pages/user/ExamPage.tsx">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} data-id="kijoghm1m" data-path="src/pages/user/ExamPage.tsx" />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer" data-id="fsqb6ecx2" data-path="src/pages/user/ExamPage.tsx">
                        {option}
                      </Label>
                    </div>
                  )}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Bottom Navigation */}
            <div className="flex justify-between items-center" data-id="htvy6tyho" data-path="src/pages/user/ExamPage.tsx">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0} data-id="121k7s7fk" data-path="src/pages/user/ExamPage.tsx">

                Previous
              </Button>

              <div className="flex space-x-2" data-id="op1ob8vhb" data-path="src/pages/user/ExamPage.tsx">
                {currentQuestionIndex === exam.questions.length - 1 ?
                <Button
                  onClick={() => setShowSubmitDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting} data-id="f04n2nqhp" data-path="src/pages/user/ExamPage.tsx">

                    <CheckCircle className="w-4 h-4 mr-2" data-id="ztlehejnx" data-path="src/pages/user/ExamPage.tsx" />
                    Submit Exam
                  </Button> :

                <Button onClick={handleNextQuestion} data-id="peecpo7n4" data-path="src/pages/user/ExamPage.tsx">
                    Next
                  </Button>
                }
              </div>
            </div>

            {/* Warning for unanswered questions */}
            {Object.keys(answers).length < exam.questions.length &&
            <Alert data-id="c4g4qvk4e" data-path="src/pages/user/ExamPage.tsx">
                <AlertDescription data-id="pagei39o3" data-path="src/pages/user/ExamPage.tsx">
                  You have {exam.questions.length - Object.keys(answers).length} unanswered questions.
                </AlertDescription>
              </Alert>
            }
          </div>

          {/* Desktop Navigation Panel */}
          <div className="hidden lg:block" data-id="4u76zlefd" data-path="src/pages/user/ExamPage.tsx">
            <div className="sticky top-4" data-id="1bllapcqc" data-path="src/pages/user/ExamPage.tsx">
              <QuestionNavigationPanel
                totalQuestions={exam.questions.length}
                currentQuestionIndex={currentQuestionIndex}
                answeredQuestions={answeredQuestions}
                markedForLater={markedForLater}
                onQuestionSelect={handleQuestionSelect}
                onMarkForLater={handleMarkForLater}
                onPrevious={handlePreviousQuestion}
                onNext={handleNextQuestion}
                isFirstQuestion={currentQuestionIndex === 0}
                isLastQuestion={currentQuestionIndex === exam.questions.length - 1} data-id="zezj1pvaa" data-path="src/pages/user/ExamPage.tsx" />

            </div>
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog} data-id="in5ebxb7f" data-path="src/pages/user/ExamPage.tsx">
          <AlertDialogContent data-id="p9e8g64wd" data-path="src/pages/user/ExamPage.tsx">
            <AlertDialogHeader data-id="68mnro7l6" data-path="src/pages/user/ExamPage.tsx">
              <AlertDialogTitle data-id="l3m1r6bkl" data-path="src/pages/user/ExamPage.tsx">Submit Exam?</AlertDialogTitle>
              <AlertDialogDescription data-id="g26pphthe" data-path="src/pages/user/ExamPage.tsx">
                Are you sure you want to submit your exam? You cannot change your answers after submission.
                <br data-id="xd8v3plpd" data-path="src/pages/user/ExamPage.tsx" /><br data-id="xr2jzo5l8" data-path="src/pages/user/ExamPage.tsx" />
                Answered questions: {Object.keys(answers).length} of {exam.questions.length}
                <br data-id="aqcwm4gg1" data-path="src/pages/user/ExamPage.tsx" />
                Marked for later: {markedForLater.size} questions
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter data-id="6s0xeq63v" data-path="src/pages/user/ExamPage.tsx">
              <Button
                variant="outline"
                onClick={() => setShowSubmitDialog(false)}
                disabled={isSubmitting} data-id="flbf3vo0x" data-path="src/pages/user/ExamPage.tsx">

                Cancel
              </Button>
              <AlertDialogAction
                onClick={() => handleSubmitExam()}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700" data-id="vhi0yyn6l" data-path="src/pages/user/ExamPage.tsx">

                {isSubmitting ? <LoadingSpinner size="sm" data-id="fh0nzf91u" data-path="src/pages/user/ExamPage.tsx" /> : 'Submit Exam'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>);

};

export default ExamPage;