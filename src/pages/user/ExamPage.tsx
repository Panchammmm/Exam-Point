
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { examService } from '@/services/examService';
import { Exam, Question } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Clock, BookOpen, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExamPage: React.FC = () => {
  const { id } = useParams<{id: string;}>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
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
        description: `Your score: ${submission.score}%`
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

  const isTimeRunningOut = timeLeft <= 300; // Last 5 minutes

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" data-id="vvi6dvf7g" data-path="src/pages/user/ExamPage.tsx">
        <LoadingSpinner size="lg" text="Loading exam..." data-id="bwnh1rxq2" data-path="src/pages/user/ExamPage.tsx" />
      </div>);

  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" data-id="sf7uypnxe" data-path="src/pages/user/ExamPage.tsx">
        <div className="text-center" data-id="366ntavql" data-path="src/pages/user/ExamPage.tsx">
          <h1 className="text-2xl font-bold text-gray-900 mb-2" data-id="o0k5n6wu2" data-path="src/pages/user/ExamPage.tsx">Exam not found</h1>
          <Button onClick={() => navigate('/dashboard')} data-id="5om17b17f" data-path="src/pages/user/ExamPage.tsx">Back to Dashboard</Button>
        </div>
      </div>);

  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" data-id="sstmexdah" data-path="src/pages/user/ExamPage.tsx">
      <div className="max-w-4xl mx-auto" data-id="nyzcwnn6n" data-path="src/pages/user/ExamPage.tsx">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6" data-id="icc7exzxe" data-path="src/pages/user/ExamPage.tsx">
          <div className="flex justify-between items-center" data-id="6a2g950bn" data-path="src/pages/user/ExamPage.tsx">
            <div data-id="a3tjdzzfs" data-path="src/pages/user/ExamPage.tsx">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center" data-id="lom7fs26v" data-path="src/pages/user/ExamPage.tsx">
                <BookOpen className="w-6 h-6 mr-2 text-indigo-600" data-id="md61l7dto" data-path="src/pages/user/ExamPage.tsx" />
                {exam.title}
              </h1>
              <p className="text-gray-600 mt-1" data-id="xugdubne4" data-path="src/pages/user/ExamPage.tsx">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </p>
            </div>
            <div className="text-right" data-id="g7jt0iocq" data-path="src/pages/user/ExamPage.tsx">
              <div className={`text-2xl font-bold ${isTimeRunningOut ? 'text-red-600' : 'text-indigo-600'}`} data-id="8k7va4bbs" data-path="src/pages/user/ExamPage.tsx">
                <Clock className="w-5 h-5 inline mr-1" data-id="rq8woam1k" data-path="src/pages/user/ExamPage.tsx" />
                {formatTime(timeLeft)}
              </div>
              {isTimeRunningOut &&
              <p className="text-red-500 text-sm mt-1" data-id="38dip2eip" data-path="src/pages/user/ExamPage.tsx">Time running out!</p>
              }
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4" data-id="1w5nln1el" data-path="src/pages/user/ExamPage.tsx">
            <Progress value={getProgress()} className="h-2" data-id="eccn2atdf" data-path="src/pages/user/ExamPage.tsx" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6" data-id="7csdbjmil" data-path="src/pages/user/ExamPage.tsx">
          <CardHeader data-id="6va7c56p4" data-path="src/pages/user/ExamPage.tsx">
            <CardTitle className="text-lg" data-id="ykgs9d5pv" data-path="src/pages/user/ExamPage.tsx">
              {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent data-id="hdy1b7c46" data-path="src/pages/user/ExamPage.tsx">
            <RadioGroup
              value={answers[currentQuestion.id]?.toString() || ''}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))} data-id="g11co6owd" data-path="src/pages/user/ExamPage.tsx">

              {currentQuestion.options.map((option, index) =>
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50" data-id="j8up2bg4g" data-path="src/pages/user/ExamPage.tsx">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} data-id="fil8faptd" data-path="src/pages/user/ExamPage.tsx" />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer" data-id="ec8z4a7fi" data-path="src/pages/user/ExamPage.tsx">
                    {option}
                  </Label>
                </div>
              )}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center" data-id="zp9j3m3qm" data-path="src/pages/user/ExamPage.tsx">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0} data-id="upi700jic" data-path="src/pages/user/ExamPage.tsx">

            Previous
          </Button>

          <div className="flex space-x-2" data-id="33shg3m4t" data-path="src/pages/user/ExamPage.tsx">
            {currentQuestionIndex === exam.questions.length - 1 ?
            <Button
              onClick={() => setShowSubmitDialog(true)}
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting} data-id="unovwwy48" data-path="src/pages/user/ExamPage.tsx">

                <CheckCircle className="w-4 h-4 mr-2" data-id="z1xfbnq0t" data-path="src/pages/user/ExamPage.tsx" />
                Submit Exam
              </Button> :

            <Button onClick={handleNextQuestion} data-id="itibvs202" data-path="src/pages/user/ExamPage.tsx">
                Next
              </Button>
            }
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog} data-id="sr7zjunv8" data-path="src/pages/user/ExamPage.tsx">
          <AlertDialogContent data-id="9delsy66t" data-path="src/pages/user/ExamPage.tsx">
            <AlertDialogHeader data-id="hgm0g5xi2" data-path="src/pages/user/ExamPage.tsx">
              <AlertDialogTitle data-id="fioyx681l" data-path="src/pages/user/ExamPage.tsx">Submit Exam?</AlertDialogTitle>
              <AlertDialogDescription data-id="9svy3dzo1" data-path="src/pages/user/ExamPage.tsx">
                Are you sure you want to submit your exam? You cannot change your answers after submission.
                <br data-id="t7xvfhh1e" data-path="src/pages/user/ExamPage.tsx" /><br data-id="qqrdc22f3" data-path="src/pages/user/ExamPage.tsx" />
                Answered questions: {Object.keys(answers).length} of {exam.questions.length}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter data-id="413s6tqx3" data-path="src/pages/user/ExamPage.tsx">
              <Button
                variant="outline"
                onClick={() => setShowSubmitDialog(false)}
                disabled={isSubmitting} data-id="ytegss72u" data-path="src/pages/user/ExamPage.tsx">

                Cancel
              </Button>
              <AlertDialogAction
                onClick={() => handleSubmitExam()}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700" data-id="hmknahyro" data-path="src/pages/user/ExamPage.tsx">

                {isSubmitting ? <LoadingSpinner size="sm" data-id="1nc6fr5cu" data-path="src/pages/user/ExamPage.tsx" /> : 'Submit Exam'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Warning for unanswered questions */}
        {Object.keys(answers).length < exam.questions.length &&
        <Alert className="mt-4" data-id="1i6xwue5i" data-path="src/pages/user/ExamPage.tsx">
            <AlertDescription data-id="xpo0frn9e" data-path="src/pages/user/ExamPage.tsx">
              You have {exam.questions.length - Object.keys(answers).length} unanswered questions.
            </AlertDescription>
          </Alert>
        }
      </div>
    </div>);

};

export default ExamPage;