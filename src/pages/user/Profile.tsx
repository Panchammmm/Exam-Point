
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { examService } from '@/services/examService';
import { ExamSubmission } from '@/types';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trophy, Calendar, Clock, BookOpen, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubmissions = async () => {
      if (!user) return;

      try {
        const userSubmissions = await examService.getUserSubmissions(user.id);
        setSubmissions(userSubmissions.sort((a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        ));
      } catch (error) {
        console.error('Error loading submissions:', error);
        toast({
          title: "Error",
          description: "Failed to load exam history. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSubmissions();
  }, [user, toast]);

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default'; // Green
    if (score >= 70) return 'secondary'; // Blue
    if (score >= 50) return 'outline'; // Gray
    return 'destructive'; // Red
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateStats = () => {
    if (submissions.length === 0) {
      return {
        totalExams: 0,
        averageScore: 0,
        highestScore: 0,
        totalTimeSpent: 0
      };
    }

    const totalScore = submissions.reduce((sum, sub) => sum + sub.score, 0);
    const totalTime = submissions.reduce((sum, sub) => sum + sub.timeSpent, 0);

    return {
      totalExams: submissions.length,
      averageScore: Math.round(totalScore / submissions.length),
      highestScore: Math.max(...submissions.map((sub) => sub.score)),
      totalTimeSpent: totalTime
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <Layout data-id="lorors6x2" data-path="src/pages/user/Profile.tsx">
        <div className="flex justify-center items-center h-64" data-id="8kr4yz984" data-path="src/pages/user/Profile.tsx">
          <LoadingSpinner size="lg" text="Loading profile..." data-id="jg4znavt5" data-path="src/pages/user/Profile.tsx" />
        </div>
      </Layout>);

  }

  return (
    <Layout data-id="zsq8mltlh" data-path="src/pages/user/Profile.tsx">
      <div className="space-y-6" data-id="478rcx4es" data-path="src/pages/user/Profile.tsx">
        {/* Header */}
        <div className="text-center" data-id="xpxpgdtsv" data-path="src/pages/user/Profile.tsx">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-id="1xwn6namf" data-path="src/pages/user/Profile.tsx">My Profile</h1>
          <p className="text-gray-600" data-id="3y5m6wsmf" data-path="src/pages/user/Profile.tsx">Track your exam performance and progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-id="qyy1e7fqe" data-path="src/pages/user/Profile.tsx">
          <Card data-id="j72ylwjcs" data-path="src/pages/user/Profile.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="vknzv6udw" data-path="src/pages/user/Profile.tsx">
              <CardTitle className="text-sm font-medium" data-id="m860ti1qt" data-path="src/pages/user/Profile.tsx">Total Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-indigo-600" data-id="32o18ztw5" data-path="src/pages/user/Profile.tsx" />
            </CardHeader>
            <CardContent data-id="gb45eag7f" data-path="src/pages/user/Profile.tsx">
              <div className="text-2xl font-bold" data-id="yqxefhhew" data-path="src/pages/user/Profile.tsx">{stats.totalExams}</div>
            </CardContent>
          </Card>

          <Card data-id="j70v3kmt6" data-path="src/pages/user/Profile.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="kr65y2qc4" data-path="src/pages/user/Profile.tsx">
              <CardTitle className="text-sm font-medium" data-id="whmm9yagm" data-path="src/pages/user/Profile.tsx">Average Score</CardTitle>
              <Target className="h-4 w-4 text-blue-600" data-id="iz8goytqy" data-path="src/pages/user/Profile.tsx" />
            </CardHeader>
            <CardContent data-id="9gp8ftezb" data-path="src/pages/user/Profile.tsx">
              <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`} data-id="ts54sr8xo" data-path="src/pages/user/Profile.tsx">
                {stats.averageScore}%
              </div>
            </CardContent>
          </Card>

          <Card data-id="m0f8ptfvk" data-path="src/pages/user/Profile.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="qqhxwe279" data-path="src/pages/user/Profile.tsx">
              <CardTitle className="text-sm font-medium" data-id="7ofcvjm74" data-path="src/pages/user/Profile.tsx">Highest Score</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" data-id="icniwk9c4" data-path="src/pages/user/Profile.tsx" />
            </CardHeader>
            <CardContent data-id="4u86l9gcx" data-path="src/pages/user/Profile.tsx">
              <div className={`text-2xl font-bold ${getScoreColor(stats.highestScore)}`} data-id="yf9dxfw4s" data-path="src/pages/user/Profile.tsx">
                {stats.highestScore}%
              </div>
            </CardContent>
          </Card>

          <Card data-id="zlqz048ye" data-path="src/pages/user/Profile.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="0uun3wmvr" data-path="src/pages/user/Profile.tsx">
              <CardTitle className="text-sm font-medium" data-id="9sa0a7nlo" data-path="src/pages/user/Profile.tsx">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-green-600" data-id="nmkpozp9h" data-path="src/pages/user/Profile.tsx" />
            </CardHeader>
            <CardContent data-id="qi7knrw6p" data-path="src/pages/user/Profile.tsx">
              <div className="text-2xl font-bold" data-id="aa3vo4bgv" data-path="src/pages/user/Profile.tsx">{stats.totalTimeSpent}m</div>
            </CardContent>
          </Card>
        </div>

        {/* Exam History */}
        <Card data-id="1ik0cfrw7" data-path="src/pages/user/Profile.tsx">
          <CardHeader data-id="7d80dkdcd" data-path="src/pages/user/Profile.tsx">
            <CardTitle data-id="ist4ggdrz" data-path="src/pages/user/Profile.tsx">Exam History</CardTitle>
            <CardDescription data-id="e2hx4nju2" data-path="src/pages/user/Profile.tsx">
              Your completed exams and scores
            </CardDescription>
          </CardHeader>
          <CardContent data-id="5h5dc171d" data-path="src/pages/user/Profile.tsx">
            {submissions.length === 0 ?
            <div className="text-center py-8" data-id="o5oxu4ivy" data-path="src/pages/user/Profile.tsx">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" data-id="l0dctt2k5" data-path="src/pages/user/Profile.tsx" />
                <h3 className="text-lg font-medium text-gray-900 mb-2" data-id="09km1ibwe" data-path="src/pages/user/Profile.tsx">No exams completed yet</h3>
                <p className="text-gray-600 mb-4" data-id="i2j7pw7da" data-path="src/pages/user/Profile.tsx">Start taking exams to see your results here.</p>
                <Button onClick={() => window.location.href = '/dashboard'} data-id="2tfdz51yi" data-path="src/pages/user/Profile.tsx">
                  Go to Dashboard
                </Button>
              </div> :

            <div className="space-y-4" data-id="6znyzv6cm" data-path="src/pages/user/Profile.tsx">
                {submissions.map((submission, index) =>
              <div key={submission.id} data-id="k8ky4dz8g" data-path="src/pages/user/Profile.tsx">
                    <div className="flex items-center justify-between" data-id="3tabszlt0" data-path="src/pages/user/Profile.tsx">
                      <div className="flex-1" data-id="vbvt4880g" data-path="src/pages/user/Profile.tsx">
                        <h3 className="font-semibold text-gray-900" data-id="87yeemn05" data-path="src/pages/user/Profile.tsx">
                          {submission.examTitle}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1" data-id="nfb7xzurc" data-path="src/pages/user/Profile.tsx">
                          <div className="flex items-center space-x-1" data-id="ox6sfttmq" data-path="src/pages/user/Profile.tsx">
                            <Calendar className="w-4 h-4" data-id="kjbpeiani" data-path="src/pages/user/Profile.tsx" />
                            <span data-id="7zv377g34" data-path="src/pages/user/Profile.tsx">{formatDate(submission.submittedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1" data-id="wrajggu0w" data-path="src/pages/user/Profile.tsx">
                            <Clock className="w-4 h-4" data-id="bks6xbnza" data-path="src/pages/user/Profile.tsx" />
                            <span data-id="h9y62k48z" data-path="src/pages/user/Profile.tsx">{formatTime(submission.submittedAt)}</span>
                          </div>
                          <span data-id="fyr176bmy" data-path="src/pages/user/Profile.tsx">Time: {submission.timeSpent}m</span>
                        </div>
                      </div>
                      <div className="text-right" data-id="xv77qice6" data-path="src/pages/user/Profile.tsx">
                        <Badge variant={getScoreBadgeVariant(submission.score)} className="text-lg px-3 py-1" data-id="i94wr6zqh" data-path="src/pages/user/Profile.tsx">
                          {submission.score}%
                        </Badge>
                      </div>
                    </div>
                    {index < submissions.length - 1 && <Separator className="mt-4" data-id="r6eeoycea" data-path="src/pages/user/Profile.tsx" />}
                  </div>
              )}
              </div>
            }
          </CardContent>
        </Card>
      </div>
    </Layout>);

};

export default Profile;