
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examService } from '@/services/examService';
import { Exam } from '@/types';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Clock, Lock, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [examPassword, setExamPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadExams = async () => {
    try {
      const publishedExams = await examService.getPublishedExams();
      setExams(publishedExams);
    } catch (error) {
      console.error('Error loading exams:', error);
      toast({
        title: "Error",
        description: "Failed to load exams. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExam = (exam: Exam) => {
    setSelectedExam(exam);
    setExamPassword('');
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;

    setPasswordError('');
    setIsVerifying(true);

    try {
      const isValid = await examService.verifyExamPassword(selectedExam.id, examPassword);

      if (isValid) {
        navigate(`/exam/${selectedExam.id}`);
      } else {
        setPasswordError('Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setPasswordError('Failed to verify password. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (isLoading) {
    return (
      <Layout data-id="lm885893m" data-path="src/pages/user/Dashboard.tsx">
        <div className="flex justify-center items-center h-64" data-id="1cvfwqxq1" data-path="src/pages/user/Dashboard.tsx">
          <LoadingSpinner size="lg" text="Loading exams..." data-id="09y5nmrbq" data-path="src/pages/user/Dashboard.tsx" />
        </div>
      </Layout>);

  }

  return (
    <Layout data-id="l8mied4f3" data-path="src/pages/user/Dashboard.tsx">
      <div className="space-y-6" data-id="brpvbd3gt" data-path="src/pages/user/Dashboard.tsx">
        {/* Header */}
        <div className="text-center" data-id="rz0b6aol8" data-path="src/pages/user/Dashboard.tsx">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-id="hzm37v8f5" data-path="src/pages/user/Dashboard.tsx">Available Exams</h1>
          <p className="text-gray-600" data-id="zkgzk1igo" data-path="src/pages/user/Dashboard.tsx">Choose an exam to start your assessment</p>
        </div>

        {/* Exams Grid */}
        {exams.length === 0 ?
        <div className="text-center py-12" data-id="0nsah2x19" data-path="src/pages/user/Dashboard.tsx">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" data-id="m39gjcbwy" data-path="src/pages/user/Dashboard.tsx" />
            <h3 className="text-lg font-medium text-gray-900 mb-2" data-id="3f7nsziwp" data-path="src/pages/user/Dashboard.tsx">No exams available</h3>
            <p className="text-gray-600" data-id="nh4vdwi40" data-path="src/pages/user/Dashboard.tsx">Check back later for new exams.</p>
          </div> :

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-id="eqpvxnd62" data-path="src/pages/user/Dashboard.tsx">
            {exams.map((exam) =>
          <Card key={exam.id} className="hover:shadow-lg transition-shadow" data-id="33fc8ronc" data-path="src/pages/user/Dashboard.tsx">
                <CardHeader data-id="neski5zc4" data-path="src/pages/user/Dashboard.tsx">
                  <CardTitle className="flex items-center space-x-2" data-id="6rtzpukxe" data-path="src/pages/user/Dashboard.tsx">
                    <BookOpen className="w-5 h-5 text-indigo-600" data-id="3w8ypszmg" data-path="src/pages/user/Dashboard.tsx" />
                    <span data-id="srno13djz" data-path="src/pages/user/Dashboard.tsx">{exam.title}</span>
                  </CardTitle>
                  <CardDescription data-id="th4up26e2" data-path="src/pages/user/Dashboard.tsx">
                    {exam.questions.length} questions available
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4" data-id="pb4gyasuc" data-path="src/pages/user/Dashboard.tsx">
                  <div className="flex items-center space-x-4 text-sm text-gray-600" data-id="h68wbttwg" data-path="src/pages/user/Dashboard.tsx">
                    <div className="flex items-center space-x-1" data-id="cx4w7smp3" data-path="src/pages/user/Dashboard.tsx">
                      <Clock className="w-4 h-4" data-id="82i8glai8" data-path="src/pages/user/Dashboard.tsx" />
                      <span data-id="d69ialwiw" data-path="src/pages/user/Dashboard.tsx">{formatDuration(exam.timeLimit)}</span>
                    </div>
                    <div className="flex items-center space-x-1" data-id="wdh5pnjoo" data-path="src/pages/user/Dashboard.tsx">
                      <Lock className="w-4 h-4" data-id="xx19vp1zu" data-path="src/pages/user/Dashboard.tsx" />
                      <span data-id="nx1x14slw" data-path="src/pages/user/Dashboard.tsx">Password protected</span>
                    </div>
                  </div>
                  
                  <Dialog data-id="scrvm1g5o" data-path="src/pages/user/Dashboard.tsx">
                    <DialogTrigger asChild data-id="y43g97rvy" data-path="src/pages/user/Dashboard.tsx">
                      <Button
                    className="w-full"
                    onClick={() => handleStartExam(exam)} data-id="b0qp7xiwx" data-path="src/pages/user/Dashboard.tsx">

                        <Play className="w-4 h-4 mr-2" data-id="ldy7abjcx" data-path="src/pages/user/Dashboard.tsx" />
                        Start Exam
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" data-id="cl1u5doub" data-path="src/pages/user/Dashboard.tsx">
                      <DialogHeader data-id="enpwijc85" data-path="src/pages/user/Dashboard.tsx">
                        <DialogTitle data-id="6agf1gp2g" data-path="src/pages/user/Dashboard.tsx">Enter Exam Password</DialogTitle>
                        <DialogDescription data-id="9e7xe2qc8" data-path="src/pages/user/Dashboard.tsx">
                          Please enter the password for "{selectedExam?.title}" to begin the exam.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePasswordSubmit} className="space-y-4" data-id="t0r0nzxy3" data-path="src/pages/user/Dashboard.tsx">
                        {passwordError &&
                    <Alert variant="destructive" data-id="5s3gb4iq9" data-path="src/pages/user/Dashboard.tsx">
                            <AlertDescription data-id="ub2a9yfeb" data-path="src/pages/user/Dashboard.tsx">{passwordError}</AlertDescription>
                          </Alert>
                    }
                        <div className="space-y-2" data-id="nahg3w3uc" data-path="src/pages/user/Dashboard.tsx">
                          <Label htmlFor="examPassword" data-id="0wur44wml" data-path="src/pages/user/Dashboard.tsx">Password</Label>
                          <Input
                        id="examPassword"
                        type="password"
                        placeholder="Enter exam password"
                        value={examPassword}
                        onChange={(e) => setExamPassword(e.target.value)}
                        required
                        disabled={isVerifying} data-id="ci7327ymj" data-path="src/pages/user/Dashboard.tsx" />

                        </div>
                        <div className="flex justify-end space-x-2" data-id="tl8a6qlxw" data-path="src/pages/user/Dashboard.tsx">
                          <Button type="submit" disabled={isVerifying} data-id="vvndu01kf" data-path="src/pages/user/Dashboard.tsx">
                            {isVerifying ? <LoadingSpinner size="sm" data-id="z0clg1hs7" data-path="src/pages/user/Dashboard.tsx" /> : 'Start Exam'}
                          </Button>
                        </div>
                      </form>
                      
                      {/* Demo password hint */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg" data-id="va16b2234" data-path="src/pages/user/Dashboard.tsx">
                        <p className="text-xs text-blue-600" data-id="p2tolm9mr" data-path="src/pages/user/Dashboard.tsx">
                          <strong data-id="veg359upz" data-path="src/pages/user/Dashboard.tsx">Demo Password:</strong> {selectedExam?.id === '1' ? 'js123' : 'react456'}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
          )}
          </div>
        }
      </div>
    </Layout>);

};

export default Dashboard;