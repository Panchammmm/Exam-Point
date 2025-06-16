
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { examService } from '@/services/examService';
import { ExamSubmission, StudentRanking } from '@/types';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trophy, Calendar, Clock, BookOpen, Target, Award, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [userRanking, setUserRanking] = useState<StudentRanking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfileData = React.useCallback(async () => {
    if (!user) return;

    try {
      const [userSubmissions, rankings] = await Promise.all([
        examService.getUserSubmissions(user.id),
        examService.getStudentRankings()
      ]);

      setSubmissions(userSubmissions.sort((a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      ));

      // Find current user's ranking
      const currentUserRanking = rankings.find((r) => r.userId === user.id);
      setUserRanking(currentUserRanking || null);
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadProfileData();
  }, [user, loadProfileData]);

  const getScoreBadgeVariant = (score: number, totalMarks: number) => {
    const percentage = score / totalMarks * 100;
    if (percentage >= 90) return 'default'; // Green
    if (percentage >= 70) return 'secondary'; // Blue
    if (percentage >= 50) return 'outline'; // Gray
    return 'destructive'; // Red
  };

  const getScoreColor = (score: number, totalMarks: number) => {
    const percentage = score / totalMarks * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank <= 3) return 'text-blue-600';
    if (rank <= 10) return 'text-green-600';
    return 'text-gray-600';
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return 'default';
    if (rank <= 3) return 'secondary';
    return 'outline';
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
        totalScore: 0,
        totalPossibleMarks: 0,
        averagePercentage: 0,
        highestScore: 0,
        highestPossible: 0,
        totalTimeSpent: 0
      };
    }

    const totalScore = submissions.reduce((sum, sub) => sum + sub.score, 0);
    const totalPossibleMarks = submissions.reduce((sum, sub) => sum + sub.totalMarks, 0);
    const totalTime = submissions.reduce((sum, sub) => sum + sub.timeSpent, 0);

    const percentages = submissions.map((sub) => sub.score / sub.totalMarks * 100);
    const averagePercentage = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;

    const highestScoreSubmission = submissions.reduce((max, sub) =>
    sub.score / sub.totalMarks > max.score / max.totalMarks ? sub : max
    );

    return {
      totalExams: submissions.length,
      totalScore,
      totalPossibleMarks,
      averagePercentage: Math.round(averagePercentage),
      highestScore: highestScoreSubmission.score,
      highestPossible: highestScoreSubmission.totalMarks,
      totalTimeSpent: totalTime
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <Layout data-id="temeaksa0" data-path="src/pages/user/Profile.tsx">
        <div className="flex justify-center items-center h-64" data-id="k58kjecwc" data-path="src/pages/user/Profile.tsx">
          <LoadingSpinner size="lg" text="Loading profile..." data-id="dhkudw73b" data-path="src/pages/user/Profile.tsx" />
        </div>
      </Layout>);

  }

  return (
    <Layout data-id="2en2zwfc2" data-path="src/pages/user/Profile.tsx">
      <div className="space-y-6" data-id="z7v5tdrtt" data-path="src/pages/user/Profile.tsx">
        {/* Header */}
        <div className="text-center" data-id="t22iarvbp" data-path="src/pages/user/Profile.tsx">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-id="82dto8drd" data-path="src/pages/user/Profile.tsx">My Profile</h1>
          <p className="text-gray-600" data-id="s3a69amdk" data-path="src/pages/user/Profile.tsx">Track your exam performance and progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5" data-id="lgts55vek" data-path="src/pages/user/Profile.tsx">
          <Card data-id="6hjxhanre" data-path="src/pages/user/Profile.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="172x4d9o7" data-path="src/pages/user/Profile.tsx">
              <CardTitle className="text-sm font-medium" data-id="fpbl7cljv" data-path="src/pages/user/Profile.tsx">Total Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-indigo-600" data-id="3uoher1cj" data-path="src/pages/user/Profile.tsx" />
            </CardHeader>
            <CardContent data-id="agm0jwcml" data-path="src/pages/user/Profile.tsx">
              <div className="text-2xl font-bold" data-id="jcdagzge1" data-path="src/pages/user/Profile.tsx">{stats.totalExams}</div>
            </CardContent>
          </Card>

          <Card data-id="nl7slok32" data-path="src/pages/user/Profile.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="3jf1hraza" data-path="src/pages/user/Profile.tsx">
              <CardTitle className="text-sm font-medium" data-id="fdldywqlu" data-path="src/pages/user/Profile.tsx">Total Score</CardTitle>
              <Target className="h-4 w-4 text-blue-600" data-id="j3yw0ikq9" data-path="src/pages/user/Profile.tsx" />
            </CardHeader>
            <CardContent data-id="ymn7h87b3" data-path="src/pages/user/Profile.tsx">
              <div className="text-2xl font-bold" data-id="318v5zzar" data-path="src/pages/user/Profile.tsx">
                {stats.totalScore}/{stats.totalPossibleMarks}
              </div>
              <p className="text-xs text-muted-foreground" data-id="dqfbtgby0" data-path="src/pages/user/Profile.tsx">marks</p>
            </CardContent>
          </Card>

          <Card data-id="5wi83l6vw" data-path="src/pages/user/Profile.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="9s413pccf" data-path="src/pages/user/Profile.tsx">
              <CardTitle className="text-sm font-medium" data-id="8hv95pst3" data-path="src/pages/user/Profile.tsx">Average</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" data-id="qqaprv5da" data-path="src/pages/user/Profile.tsx" />
            </CardHeader>
            <CardContent data-id="hw6zu24wf" data-path="src/pages/user/Profile.tsx">
              <div className={`text-2xl font-bold ${getScoreColor(stats.averagePercentage, 100)}`} data-id="lmlwzfags" data-path="src/pages/user/Profile.tsx">
                {stats.averagePercentage}%
              </div>
            </CardContent>
          </Card>

          <Card data-id="gb11skjbz" data-path="src/pages/user/Profile.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="5tgb46g9d" data-path="src/pages/user/Profile.tsx">
              <CardTitle className="text-sm font-medium" data-id="ayzre0cqo" data-path="src/pages/user/Profile.tsx">Best Score</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" data-id="wulrk3hww" data-path="src/pages/user/Profile.tsx" />
            </CardHeader>
            <CardContent data-id="xd52stev5" data-path="src/pages/user/Profile.tsx">
              <div className={`text-2xl font-bold ${getScoreColor(stats.highestScore, stats.highestPossible)}`} data-id="fbpojb8x6" data-path="src/pages/user/Profile.tsx">
                {stats.highestScore}/{stats.highestPossible}
              </div>
              <p className="text-xs text-muted-foreground" data-id="vnujf9onw" data-path="src/pages/user/Profile.tsx">
                {Math.round(stats.highestScore / stats.highestPossible * 100)}%
              </p>
            </CardContent>
          </Card>

          <Card data-id="g3moglvnw" data-path="src/pages/user/Profile.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="4des01avq" data-path="src/pages/user/Profile.tsx">
              <CardTitle className="text-sm font-medium" data-id="7hivful8s" data-path="src/pages/user/Profile.tsx">My Rank</CardTitle>
              <Award className="h-4 w-4 text-purple-600" data-id="n5dthq36t" data-path="src/pages/user/Profile.tsx" />
            </CardHeader>
            <CardContent data-id="nb4701rjp" data-path="src/pages/user/Profile.tsx">
              <div className={`text-2xl font-bold ${userRanking ? getRankColor(userRanking.rank) : 'text-gray-400'}`} data-id="28vj12qre" data-path="src/pages/user/Profile.tsx">
                {userRanking ? `#${userRanking.rank}` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground" data-id="mvxnrxz0x" data-path="src/pages/user/Profile.tsx">
                {userRanking ? `out of students` : 'Take exams to rank'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ranking Card */}
        {userRanking &&
        <Card data-id="266j7g4am" data-path="src/pages/user/Profile.tsx">
            <CardHeader data-id="g5tctwjx7" data-path="src/pages/user/Profile.tsx">
              <CardTitle className="flex items-center" data-id="dkzwejcpr" data-path="src/pages/user/Profile.tsx">
                <Trophy className="w-5 h-5 mr-2 text-yellow-600" data-id="ewv1fvccl" data-path="src/pages/user/Profile.tsx" />
                Your Ranking
              </CardTitle>
              <CardDescription data-id="2pa62v6pr" data-path="src/pages/user/Profile.tsx">
                Your current position among all students
              </CardDescription>
            </CardHeader>
            <CardContent data-id="2qmwk46cb" data-path="src/pages/user/Profile.tsx">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg" data-id="apoqtvhvg" data-path="src/pages/user/Profile.tsx">
                <div className="flex items-center space-x-4" data-id="yp5qnxbyy" data-path="src/pages/user/Profile.tsx">
                  <Badge variant={getRankBadgeVariant(userRanking.rank)} className="text-lg px-4 py-2" data-id="r1yvknspv" data-path="src/pages/user/Profile.tsx">
                    Rank #{userRanking.rank}
                  </Badge>
                  {userRanking.rank === 1 && <Award className="w-6 h-6 text-yellow-500" data-id="bywjqqkjx" data-path="src/pages/user/Profile.tsx" />}
                  <div data-id="aeil0h6sy" data-path="src/pages/user/Profile.tsx">
                    <p className="font-semibold" data-id="03f2ti3pr" data-path="src/pages/user/Profile.tsx">{userRanking.userName}</p>
                    <p className="text-sm text-gray-600" data-id="mrfyl2jdp" data-path="src/pages/user/Profile.tsx">{userRanking.userEmail}</p>
                  </div>
                </div>
                <div className="text-right" data-id="myv5urmdr" data-path="src/pages/user/Profile.tsx">
                  <p className="text-lg font-bold" data-id="h3bd4c64a" data-path="src/pages/user/Profile.tsx">{userRanking.totalScore} marks</p>
                  <p className="text-sm text-gray-600" data-id="ft4jn38ic" data-path="src/pages/user/Profile.tsx">{userRanking.totalExams} exams completed</p>
                  <p className="text-xs text-gray-500" data-id="bmajwhb1i" data-path="src/pages/user/Profile.tsx">Average: {userRanking.averageScore} marks/exam</p>
                </div>
              </div>
            </CardContent>
          </Card>
        }

        {/* Exam History */}
        <Card data-id="w90u98qi0" data-path="src/pages/user/Profile.tsx">
          <CardHeader data-id="yahjc6a6j" data-path="src/pages/user/Profile.tsx">
            <CardTitle data-id="uthqc5at2" data-path="src/pages/user/Profile.tsx">Exam History</CardTitle>
            <CardDescription data-id="p1crnn7i3" data-path="src/pages/user/Profile.tsx">
              Your completed exams with scores and rankings
            </CardDescription>
          </CardHeader>
          <CardContent data-id="0cui9hkq4" data-path="src/pages/user/Profile.tsx">
            {submissions.length === 0 ?
            <div className="text-center py-8" data-id="zkmpzt3in" data-path="src/pages/user/Profile.tsx">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" data-id="281b6hoa2" data-path="src/pages/user/Profile.tsx" />
                <h3 className="text-lg font-medium text-gray-900 mb-2" data-id="ir5h6jasw" data-path="src/pages/user/Profile.tsx">No exams completed yet</h3>
                <p className="text-gray-600 mb-4" data-id="h63gvkgr6" data-path="src/pages/user/Profile.tsx">Start taking exams to see your results here.</p>
                <Button onClick={() => window.location.href = '/dashboard'} data-id="zvwh0d9cg" data-path="src/pages/user/Profile.tsx">
                  Go to Dashboard
                </Button>
              </div> :

            <div className="space-y-4" data-id="epcyysv9m" data-path="src/pages/user/Profile.tsx">
                {submissions.map((submission, index) =>
              <div key={submission.id} data-id="j3ef0799x" data-path="src/pages/user/Profile.tsx">
                    <div className="flex items-center justify-between" data-id="5htcib4lq" data-path="src/pages/user/Profile.tsx">
                      <div className="flex-1" data-id="q99x5n6oh" data-path="src/pages/user/Profile.tsx">
                        <h3 className="font-semibold text-gray-900" data-id="fxqtueyl9" data-path="src/pages/user/Profile.tsx">
                          {submission.examTitle}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1" data-id="ykkrojww2" data-path="src/pages/user/Profile.tsx">
                          <div className="flex items-center space-x-1" data-id="dpqthzzd3" data-path="src/pages/user/Profile.tsx">
                            <Calendar className="w-4 h-4" data-id="yymogkeor" data-path="src/pages/user/Profile.tsx" />
                            <span data-id="olstudme9" data-path="src/pages/user/Profile.tsx">{formatDate(submission.submittedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1" data-id="e6wo8wxqm" data-path="src/pages/user/Profile.tsx">
                            <Clock className="w-4 h-4" data-id="fvi5qagds" data-path="src/pages/user/Profile.tsx" />
                            <span data-id="5w4ipuyh2" data-path="src/pages/user/Profile.tsx">{formatTime(submission.submittedAt)}</span>
                          </div>
                          <span data-id="6j4xssur5" data-path="src/pages/user/Profile.tsx">Time: {submission.timeSpent}m</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1" data-id="gq4ju0ovm" data-path="src/pages/user/Profile.tsx">
                        <Badge variant={getScoreBadgeVariant(submission.score, submission.totalMarks)} className="text-lg px-3 py-1" data-id="9bjxb4foi" data-path="src/pages/user/Profile.tsx">
                          {submission.score}/{submission.totalMarks}
                        </Badge>
                        <p className="text-xs text-gray-500" data-id="68l5pelzl" data-path="src/pages/user/Profile.tsx">
                          {Math.round(submission.score / submission.totalMarks * 100)}%
                        </p>
                      </div>
                    </div>
                    {index < submissions.length - 1 && <Separator className="mt-4" data-id="t4bah4ef6" data-path="src/pages/user/Profile.tsx" />}
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