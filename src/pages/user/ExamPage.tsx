
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
  }, [timeLeft, exam, handleSubmitExam]);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" data-id="g5fa3xv0e" data-path="src/pages/user/ExamPage.tsx">
        <LoadingSpinner size="lg" text="Loading exam..." data-id="qabsw4uc4" data-path="src/pages/user/ExamPage.tsx" />
      </div>);

  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" data-id="ulytl9fcl" data-path="src/pages/user/ExamPage.tsx">
        <div className="text-center" data-id="u8b1jtwjz" data-path="src/pages/user/ExamPage.tsx">
          <h1 className="text-2xl font-bold text-gray-900 mb-2" data-id="rblr4essa" data-path="src/pages/user/ExamPage.tsx">Exam not found</h1>
          <Button onClick={() => navigate('/dashboard')} data-id="da2h9jvr5" data-path="src/pages/user/ExamPage.tsx">Back to Dashboard</Button>
        </div>
      </div>);

  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const answeredQuestions = getAnsweredQuestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" data-id="yg5dfyhz0" data-path="src/pages/user/ExamPage.tsx">
      <div className="max-w-7xl mx-auto" data-id="ijrcwzahg" data-path="src/pages/user/ExamPage.tsx">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" data-id="9vifi0fnp" data-path="src/pages/user/ExamPage.tsx">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6" data-id="l2sqtio0b" data-path="src/pages/user/ExamPage.tsx">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6" data-id="3my8deqr6" data-path="src/pages/user/ExamPage.tsx">
              <div className="flex justify-between items-center" data-id="atj04ufqt" data-path="src/pages/user/ExamPage.tsx">
                <div data-id="o703d3k3v" data-path="src/pages/user/ExamPage.tsx">
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center" data-id="id47umerh" data-path="src/pages/user/ExamPage.tsx">
                    <BookOpen className="w-6 h-6 mr-2 text-indigo-600" data-id="bcxr95wv8" data-path="src/pages/user/ExamPage.tsx" />
                    {exam.title}
                  </h1>
                  <p className="text-gray-600 mt-1" data-id="2zpf6xqlb" data-path="src/pages/user/ExamPage.tsx">
                    Question {currentQuestionIndex + 1} of {exam.questions.length}
                  </p>
                </div>
                <div className="text-right" data-id="ziv1w72xu" data-path="src/pages/user/ExamPage.tsx">
                  <div className={`text-2xl font-bold ${isTimeRunningOut ? 'text-red-600' : 'text-indigo-600'}`} data-id="dc279fkxy" data-path="src/pages/user/ExamPage.tsx">
                    <Clock className="w-5 h-5 inline mr-1" data-id="loorsqcre" data-path="src/pages/user/ExamPage.tsx" />
                    {formatTime(timeLeft)}
                  </div>
                  {isTimeRunningOut &&
                  <p className="text-red-500 text-sm mt-1" data-id="5b06ruvpb" data-path="src/pages/user/ExamPage.tsx">Time running out!</p>
                  }
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4" data-id="96lfn12lz" data-path="src/pages/user/ExamPage.tsx">
                <Progress value={getProgress()} className="h-2" data-id="eoj56gx44" data-path="src/pages/user/ExamPage.tsx" />
              </div>

              {/* Mobile Navigation Toggle */}
              <div className="lg:hidden mt-4" data-id="zqx0w3ndh" data-path="src/pages/user/ExamPage.tsx">
                <Button
                  variant="outline"
                  onClick={() => setShowNavigationPanel(!showNavigationPanel)}
                  className="w-full" data-id="xhjrogmju" data-path="src/pages/user/ExamPage.tsx">

                  {showNavigationPanel ? <X className="w-4 h-4 mr-2" data-id="9cc7p8mmg" data-path="src/pages/user/ExamPage.tsx" /> : <Menu className="w-4 h-4 mr-2" data-id="ka9mwe9zg" data-path="src/pages/user/ExamPage.tsx" />}
                  {showNavigationPanel ? 'Hide' : 'Show'} Question Navigation
                </Button>
              </div>
            </div>

            {/* Mobile Navigation Panel */}
            {showNavigationPanel &&
            <div className="lg:hidden" data-id="jyhzbqddj" data-path="src/pages/user/ExamPage.tsx">
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
                isLastQuestion={currentQuestionIndex === exam.questions.length - 1} data-id="s3pr0un8q" data-path="src/pages/user/ExamPage.tsx" />

              </div>
            }

            {/* Question Card */}
            <Card data-id="6hnlthxcr" data-path="src/pages/user/ExamPage.tsx">
              <CardHeader data-id="63gpqz2sm" data-path="src/pages/user/ExamPage.tsx">
                <CardTitle className="text-lg" data-id="21ekpfpyn" data-path="src/pages/user/ExamPage.tsx">
                  {currentQuestion.text}
                </CardTitle>
              </CardHeader>
              <CardContent data-id="sqlywggyq" data-path="src/pages/user/ExamPage.tsx">
                <RadioGroup
                  value={answers[currentQuestion.id]?.toString() || ''}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))} data-id="u4es4nrj4" data-path="src/pages/user/ExamPage.tsx">

                  {currentQuestion.options.map((option, index) =>
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50" data-id="rleu2lrfp" data-path="src/pages/user/ExamPage.tsx">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} data-id="w9xi7xsxr" data-path="src/pages/user/ExamPage.tsx" />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer" data-id="kidqg8jv8" data-path="src/pages/user/ExamPage.tsx">
                        {option}
                      </Label>
                    </div>
                  )}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Bottom Navigation */}
            <div className="flex justify-between items-center" data-id="lqkjoxemv" data-path="src/pages/user/ExamPage.tsx">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0} data-id="3gz6wcsgg" data-path="src/pages/user/ExamPage.tsx">

                Previous
              </Button>

              <div className="flex space-x-2" data-id="a9hcn2cai" data-path="src/pages/user/ExamPage.tsx">
                {currentQuestionIndex === exam.questions.length - 1 ?
                <Button
                  onClick={() => setShowSubmitDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting} data-id="7lavdf0bd" data-path="src/pages/user/ExamPage.tsx">

                    <CheckCircle className="w-4 h-4 mr-2" data-id="fn5bdslv4" data-path="src/pages/user/ExamPage.tsx" />
                    Submit Exam
                  </Button> :

                <Button onClick={handleNextQuestion} data-id="dkaizvtlo" data-path="src/pages/user/ExamPage.tsx">
                    Next
                  </Button>
                }
              </div>
            </div>

            {/* Warning for unanswered questions */}
            {Object.keys(answers).length < exam.questions.length &&
            <Alert data-id="z44seu31t" data-path="src/pages/user/ExamPage.tsx">
                <AlertDescription data-id="8v4oklpei" data-path="src/pages/user/ExamPage.tsx">
                  You have {exam.questions.length - Object.keys(answers).length} unanswered questions.
                </AlertDescription>
              </Alert>
            }
          </div>

          {/* Desktop Navigation Panel */}
          <div className="hidden lg:block" data-id="2hc2751k6" data-path="src/pages/user/ExamPage.tsx">
            <div className="sticky top-4" data-id="r3b9109dw" data-path="src/pages/user/ExamPage.tsx">
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
                isLastQuestion={currentQuestionIndex === exam.questions.length - 1} data-id="jpksvs73e" data-path="src/pages/user/ExamPage.tsx" />

            </div>
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog} data-id="kaijscg06" data-path="src/pages/user/ExamPage.tsx">
          <AlertDialogContent data-id="e7qcphple" data-path="src/pages/user/ExamPage.tsx">
            <AlertDialogHeader data-id="2jm03ad90" data-path="src/pages/user/ExamPage.tsx">
              <AlertDialogTitle data-id="co2xwi2gr" data-path="src/pages/user/ExamPage.tsx">Submit Exam?</AlertDialogTitle>
              <AlertDialogDescription data-id="ulu73pc0z" data-path="src/pages/user/ExamPage.tsx">
                Are you sure you want to submit your exam? You cannot change your answers after submission.
                <br data-id="yjpyvi4nq" data-path="src/pages/user/ExamPage.tsx" /><br data-id="exsudgw9i" data-path="src/pages/user/ExamPage.tsx" />
                Answered questions: {Object.keys(answers).length} of {exam.questions.length}
                <br data-id="9009zhs5u" data-path="src/pages/user/ExamPage.tsx" />
                Marked for later: {markedForLater.size} questions
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter data-id="fdtxlumh5" data-path="src/pages/user/ExamPage.tsx">
              <Button
                variant="outline"
                onClick={() => setShowSubmitDialog(false)}
                disabled={isSubmitting} data-id="19mi4bfbx" data-path="src/pages/user/ExamPage.tsx">

                Cancel
              </Button>
              <AlertDialogAction
                onClick={() => handleSubmitExam()}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700" data-id="v34o7ig89" data-path="src/pages/user/ExamPage.tsx">

                {isSubmitting ? <LoadingSpinner size="sm" data-id="bs7n6teak" data-path="src/pages/user/ExamPage.tsx" /> : 'Submit Exam'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>);

};

export default ExamPage;