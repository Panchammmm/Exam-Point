
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
      <Layout data-id="2e4a73x8i" data-path="src/pages/user/Dashboard.tsx">
        <div className="flex justify-center items-center h-64" data-id="xp9fsvwnm" data-path="src/pages/user/Dashboard.tsx">
          <LoadingSpinner size="lg" text="Loading exams..." data-id="m8tkgih69" data-path="src/pages/user/Dashboard.tsx" />
        </div>
      </Layout>);

  }

  return (
    <Layout data-id="bk46vkp4r" data-path="src/pages/user/Dashboard.tsx">
      <div className="space-y-6" data-id="cd631d9sp" data-path="src/pages/user/Dashboard.tsx">
        {/* Header */}
        <div className="text-center" data-id="ulyzyfb6w" data-path="src/pages/user/Dashboard.tsx">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-id="6ko22jcxu" data-path="src/pages/user/Dashboard.tsx">Available Exams</h1>
          <p className="text-gray-600" data-id="95pmahezg" data-path="src/pages/user/Dashboard.tsx">Choose an exam to start your assessment</p>
        </div>

        {/* Exams Grid */}
        {exams.length === 0 ?
        <div className="text-center py-12" data-id="k2rxa00f5" data-path="src/pages/user/Dashboard.tsx">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" data-id="f2btv64s4" data-path="src/pages/user/Dashboard.tsx" />
            <h3 className="text-lg font-medium text-gray-900 mb-2" data-id="253agxdor" data-path="src/pages/user/Dashboard.tsx">No exams available</h3>
            <p className="text-gray-600" data-id="6n48s876o" data-path="src/pages/user/Dashboard.tsx">Check back later for new exams.</p>
          </div> :

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-id="axsr41t3u" data-path="src/pages/user/Dashboard.tsx">
            {exams.map((exam) =>
          <Card key={exam.id} className="hover:shadow-lg transition-shadow" data-id="vu4d7v7gx" data-path="src/pages/user/Dashboard.tsx">
                <CardHeader data-id="s95fh8p9l" data-path="src/pages/user/Dashboard.tsx">
                  <CardTitle className="flex items-center space-x-2" data-id="w14guq9fs" data-path="src/pages/user/Dashboard.tsx">
                    <BookOpen className="w-5 h-5 text-indigo-600" data-id="eo9bltrsv" data-path="src/pages/user/Dashboard.tsx" />
                    <span data-id="krujrqf1n" data-path="src/pages/user/Dashboard.tsx">{exam.title}</span>
                  </CardTitle>
                  <CardDescription data-id="7a8m2ubw7" data-path="src/pages/user/Dashboard.tsx">
                    {exam.questions.length} questions available
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4" data-id="4imceo8xy" data-path="src/pages/user/Dashboard.tsx">
                  <div className="flex items-center space-x-4 text-sm text-gray-600" data-id="xjyeatph8" data-path="src/pages/user/Dashboard.tsx">
                    <div className="flex items-center space-x-1" data-id="6hc5uo7d9" data-path="src/pages/user/Dashboard.tsx">
                      <Clock className="w-4 h-4" data-id="5tq9y8brv" data-path="src/pages/user/Dashboard.tsx" />
                      <span data-id="0g935rdr9" data-path="src/pages/user/Dashboard.tsx">{formatDuration(exam.timeLimit)}</span>
                    </div>
                    <div className="flex items-center space-x-1" data-id="0b6pkznwa" data-path="src/pages/user/Dashboard.tsx">
                      <Lock className="w-4 h-4" data-id="76qsniebt" data-path="src/pages/user/Dashboard.tsx" />
                      <span data-id="fyrhljym3" data-path="src/pages/user/Dashboard.tsx">Password protected</span>
                    </div>
                  </div>
                  
                  <Dialog data-id="tga4rbpxt" data-path="src/pages/user/Dashboard.tsx">
                    <DialogTrigger asChild data-id="jrwi1k1mm" data-path="src/pages/user/Dashboard.tsx">
                      <Button
                    className="w-full"
                    onClick={() => handleStartExam(exam)} data-id="k7ouneac8" data-path="src/pages/user/Dashboard.tsx">

                        <Play className="w-4 h-4 mr-2" data-id="gyycquh72" data-path="src/pages/user/Dashboard.tsx" />
                        Start Exam
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" data-id="ielxg2z4f" data-path="src/pages/user/Dashboard.tsx">
                      <DialogHeader data-id="hegz8dtx8" data-path="src/pages/user/Dashboard.tsx">
                        <DialogTitle data-id="zn03lrx6f" data-path="src/pages/user/Dashboard.tsx">Enter Exam Password</DialogTitle>
                        <DialogDescription data-id="nysm7fz6v" data-path="src/pages/user/Dashboard.tsx">
                          Please enter the password for "{selectedExam?.title}" to begin the exam.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePasswordSubmit} className="space-y-4" data-id="vl10db265" data-path="src/pages/user/Dashboard.tsx">
                        {passwordError &&
                    <Alert variant="destructive" data-id="am5ytnkkq" data-path="src/pages/user/Dashboard.tsx">
                            <AlertDescription data-id="4ta0e5l75" data-path="src/pages/user/Dashboard.tsx">{passwordError}</AlertDescription>
                          </Alert>
                    }
                        <div className="space-y-2" data-id="s0iei7fd8" data-path="src/pages/user/Dashboard.tsx">
                          <Label htmlFor="examPassword" data-id="is0xfw7jg" data-path="src/pages/user/Dashboard.tsx">Password</Label>
                          <Input
                        id="examPassword"
                        type="password"
                        placeholder="Enter exam password"
                        value={examPassword}
                        onChange={(e) => setExamPassword(e.target.value)}
                        required
                        disabled={isVerifying} data-id="gfu95hgrx" data-path="src/pages/user/Dashboard.tsx" />

                        </div>
                        <div className="flex justify-end space-x-2" data-id="nuty8xzd8" data-path="src/pages/user/Dashboard.tsx">
                          <Button type="submit" disabled={isVerifying} data-id="lnlvtty2j" data-path="src/pages/user/Dashboard.tsx">
                            {isVerifying ? <LoadingSpinner size="sm" data-id="95793atrw" data-path="src/pages/user/Dashboard.tsx" /> : 'Start Exam'}
                          </Button>
                        </div>
                      </form>
                      
                      {/* Demo password hint */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg" data-id="9y53mnvad" data-path="src/pages/user/Dashboard.tsx">
                        <p className="text-xs text-blue-600" data-id="1p3xxna9b" data-path="src/pages/user/Dashboard.tsx">
                          <strong data-id="ud0l7rvhx" data-path="src/pages/user/Dashboard.tsx">Demo Password:</strong> {selectedExam?.id === '1' ? 'js123' : 'react456'}
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