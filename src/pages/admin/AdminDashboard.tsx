
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examService } from '@/services/examService';
import { Exam, ExamSubmission, StudentRanking, ExamRanking } from '@/types';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Eye,
  Calendar,
  Trophy,
  Award,
  Target } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [studentRankings, setStudentRankings] = useState<StudentRanking[]>([]);
  const [examRankings, setExamRankings] = useState<ExamRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [allExams, allSubmissions, rankings, examRanks] = await Promise.all([
          examService.getAllExams(),
          examService.getAllSubmissions(),
          examService.getStudentRankings(),
          examService.getAllExamRankings()
        ]);

        setExams(allExams);
        setSubmissions(allSubmissions);
        setStudentRankings(rankings);
        setExamRankings(examRanks);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

  const loadDashboardData = async () => {
    try {
      const [allExams, allSubmissions, rankings, examRanks] = await Promise.all([
      examService.getAllExams(),
      examService.getAllSubmissions(),
      examService.getStudentRankings(),
      examService.getAllExamRankings()]
      );

      setExams(allExams);
      setSubmissions(allSubmissions);
      setStudentRankings(rankings);
      setExamRankings(examRanks);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = () => {
    const publishedExams = exams.filter((exam) => exam.isPublished);
    const totalStudents = new Set(submissions.map((sub) => sub.userId)).size;

    // Calculate average score in marks instead of percentage
    const totalMarks = submissions.reduce((sum, sub) => sum + sub.totalMarks, 0);
    const totalScored = submissions.reduce((sum, sub) => sum + sub.score, 0);
    const averageScore = totalMarks > 0 ? Math.round(totalScored / totalMarks * 100) : 0;

    return {
      totalExams: exams.length,
      publishedExams: publishedExams.length,
      totalStudents,
      totalSubmissions: submissions.length,
      averageScore
    };
  };

  const getRecentSubmissions = () => {
    return submissions.
    sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).
    slice(0, 5);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreBadgeVariant = (score: number, totalMarks: number) => {
    const percentage = score / totalMarks * 100;
    if (percentage >= 90) return 'default';
    if (percentage >= 70) return 'secondary';
    if (percentage >= 50) return 'outline';
    return 'destructive';
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return 'default';
    if (rank <= 3) return 'secondary';
    return 'outline';
  };

  if (isLoading) {
    return (
      <Layout data-id="ao89kk535" data-path="src/pages/admin/AdminDashboard.tsx">
        <div className="flex justify-center items-center h-64" data-id="xjfktl61k" data-path="src/pages/admin/AdminDashboard.tsx">
          <LoadingSpinner size="lg" text="Loading dashboard..." data-id="amba83nig" data-path="src/pages/admin/AdminDashboard.tsx" />
        </div>
      </Layout>);

  }

  const stats = getStats();
  const recentSubmissions = getRecentSubmissions();

  return (
    <Layout data-id="xk0n9452n" data-path="src/pages/admin/AdminDashboard.tsx">
      <div className="space-y-6" data-id="tdo2psqoo" data-path="src/pages/admin/AdminDashboard.tsx">
        {/* Header */}
        <div className="flex justify-between items-center" data-id="u66r3cu3z" data-path="src/pages/admin/AdminDashboard.tsx">
          <div data-id="jnmb9b5sg" data-path="src/pages/admin/AdminDashboard.tsx">
            <h1 className="text-3xl font-bold text-gray-900" data-id="obmm4asby" data-path="src/pages/admin/AdminDashboard.tsx">Admin Dashboard</h1>
            <p className="text-gray-600" data-id="ht72q3umx" data-path="src/pages/admin/AdminDashboard.tsx">Manage exams and monitor student performance</p>
          </div>
          <Button asChild data-id="au4qzosd0" data-path="src/pages/admin/AdminDashboard.tsx">
            <Link to="/admin/create-exam" data-id="kqva8t96l" data-path="src/pages/admin/AdminDashboard.tsx">
              <Plus className="w-4 h-4 mr-2" data-id="tfxmcis83" data-path="src/pages/admin/AdminDashboard.tsx" />
              Create New Exam
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5" data-id="i0pksgyp0" data-path="src/pages/admin/AdminDashboard.tsx">
          <Card data-id="u683o7678" data-path="src/pages/admin/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="d4yyyqomt" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="zz0ogfsu2" data-path="src/pages/admin/AdminDashboard.tsx">Total Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-indigo-600" data-id="ikr1d204o" data-path="src/pages/admin/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="pxacrkh91" data-path="src/pages/admin/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="mo01am30g" data-path="src/pages/admin/AdminDashboard.tsx">{stats.totalExams}</div>
              <p className="text-xs text-muted-foreground" data-id="pnlzekf77" data-path="src/pages/admin/AdminDashboard.tsx">
                {stats.publishedExams} published
              </p>
            </CardContent>
          </Card>

          <Card data-id="7wp5zmot9" data-path="src/pages/admin/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="v6cnmzv77" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="7xmbo7f3d" data-path="src/pages/admin/AdminDashboard.tsx">Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" data-id="07fynpvv8" data-path="src/pages/admin/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="ja7k12447" data-path="src/pages/admin/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="tql562p0h" data-path="src/pages/admin/AdminDashboard.tsx">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground" data-id="ejuzsg315" data-path="src/pages/admin/AdminDashboard.tsx">
                Active participants
              </p>
            </CardContent>
          </Card>

          <Card data-id="2vjzalvtu" data-path="src/pages/admin/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="imljmjiqy" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="hrrojyu65" data-path="src/pages/admin/AdminDashboard.tsx">Submissions</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" data-id="2ybelcq5l" data-path="src/pages/admin/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="2e4o6zcfe" data-path="src/pages/admin/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="r7i8xdsf7" data-path="src/pages/admin/AdminDashboard.tsx">{stats.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground" data-id="egypumzm9" data-path="src/pages/admin/AdminDashboard.tsx">
                Total attempts
              </p>
            </CardContent>
          </Card>

          <Card data-id="ni6ca37ed" data-path="src/pages/admin/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="9xqh0mxt1" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="44ycbstad" data-path="src/pages/admin/AdminDashboard.tsx">Average Score</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" data-id="cmjx19dto" data-path="src/pages/admin/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="sth4tbm2y" data-path="src/pages/admin/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="mm5dpgzhr" data-path="src/pages/admin/AdminDashboard.tsx">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground" data-id="ooj0xukt9" data-path="src/pages/admin/AdminDashboard.tsx">
                Overall performance
              </p>
            </CardContent>
          </Card>

          <Card data-id="5vtduiw23" data-path="src/pages/admin/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="ega5vxejd" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="03whrlx8a" data-path="src/pages/admin/AdminDashboard.tsx">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" data-id="sth4uapyr" data-path="src/pages/admin/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="v9bpc0w2e" data-path="src/pages/admin/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="kds6oydf9" data-path="src/pages/admin/AdminDashboard.tsx">{submissions.length}</div>
              <p className="text-xs text-muted-foreground" data-id="va2tc0diu" data-path="src/pages/admin/AdminDashboard.tsx">
                New submissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4" data-id="zhogykyil" data-path="src/pages/admin/AdminDashboard.tsx">
          <TabsList data-id="xdssv80yq" data-path="src/pages/admin/AdminDashboard.tsx">
            <TabsTrigger value="overview" data-id="3u8lvjdlr" data-path="src/pages/admin/AdminDashboard.tsx">Overview</TabsTrigger>
            <TabsTrigger value="exams" data-id="qbpord0ed" data-path="src/pages/admin/AdminDashboard.tsx">Recent Exams</TabsTrigger>
            <TabsTrigger value="submissions" data-id="8l1c1ugwl" data-path="src/pages/admin/AdminDashboard.tsx">Recent Submissions</TabsTrigger>
            <TabsTrigger value="rankings" data-id="rikce3ec4" data-path="src/pages/admin/AdminDashboard.tsx">Student Rankings</TabsTrigger>
            <TabsTrigger value="exam-rankings" data-id="nydmmo042" data-path="src/pages/admin/AdminDashboard.tsx">Exam Rankings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4" data-id="u8ejp7qr4" data-path="src/pages/admin/AdminDashboard.tsx">
            <div className="grid gap-4 md:grid-cols-2" data-id="k492nekwg" data-path="src/pages/admin/AdminDashboard.tsx">
              {/* Quick Actions */}
              <Card data-id="mz2rk2jf4" data-path="src/pages/admin/AdminDashboard.tsx">
                <CardHeader data-id="35rmjj1aw" data-path="src/pages/admin/AdminDashboard.tsx">
                  <CardTitle data-id="khynxhh8x" data-path="src/pages/admin/AdminDashboard.tsx">Quick Actions</CardTitle>
                  <CardDescription data-id="uf9jusijw" data-path="src/pages/admin/AdminDashboard.tsx">
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2" data-id="td6o1chxx" data-path="src/pages/admin/AdminDashboard.tsx">
                  <Button asChild className="w-full justify-start" data-id="ebuipqfdd" data-path="src/pages/admin/AdminDashboard.tsx">
                    <Link to="/admin/create-exam" data-id="6dfia8rpg" data-path="src/pages/admin/AdminDashboard.tsx">
                      <Plus className="w-4 h-4 mr-2" data-id="3ri0xgutd" data-path="src/pages/admin/AdminDashboard.tsx" />
                      Create New Exam
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start" data-id="0hub4cg8y" data-path="src/pages/admin/AdminDashboard.tsx">
                    <Link to="/admin/exams" data-id="ryclzh5bm" data-path="src/pages/admin/AdminDashboard.tsx">
                      <BookOpen className="w-4 h-4 mr-2" data-id="x09yrx00n" data-path="src/pages/admin/AdminDashboard.tsx" />
                      Manage Exams
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start" data-id="b85c16e2t" data-path="src/pages/admin/AdminDashboard.tsx">
                    <Link to="/admin/submissions" data-id="r7larwjnd" data-path="src/pages/admin/AdminDashboard.tsx">
                      <Eye className="w-4 h-4 mr-2" data-id="swv9x481l" data-path="src/pages/admin/AdminDashboard.tsx" />
                      View All Submissions
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card data-id="qluhnfpgm" data-path="src/pages/admin/AdminDashboard.tsx">
                <CardHeader data-id="pmbncaqyn" data-path="src/pages/admin/AdminDashboard.tsx">
                  <CardTitle data-id="pdj7vyr57" data-path="src/pages/admin/AdminDashboard.tsx">Recent Activity</CardTitle>
                  <CardDescription data-id="6apz1hxsk" data-path="src/pages/admin/AdminDashboard.tsx">
                    Latest student submissions
                  </CardDescription>
                </CardHeader>
                <CardContent data-id="1yw7cgv4b" data-path="src/pages/admin/AdminDashboard.tsx">
                  {recentSubmissions.length === 0 ?
                  <p className="text-gray-500 text-sm" data-id="z2gcc3xay" data-path="src/pages/admin/AdminDashboard.tsx">No recent submissions</p> :

                  <div className="space-y-3" data-id="ne9j84ind" data-path="src/pages/admin/AdminDashboard.tsx">
                      {recentSubmissions.map((submission) =>
                    <div key={submission.id} className="flex items-center justify-between" data-id="lkg6b9mw6" data-path="src/pages/admin/AdminDashboard.tsx">
                          <div data-id="qgor2mj5r" data-path="src/pages/admin/AdminDashboard.tsx">
                            <p className="text-sm font-medium" data-id="ci2ad9yk0" data-path="src/pages/admin/AdminDashboard.tsx">{submission.userName}</p>
                            <p className="text-xs text-gray-500" data-id="67sjojakb" data-path="src/pages/admin/AdminDashboard.tsx">{submission.examTitle}</p>
                          </div>
                          <div className="text-right" data-id="ah5pyajpm" data-path="src/pages/admin/AdminDashboard.tsx">
                            <Badge variant={getScoreBadgeVariant(submission.score, submission.totalMarks)} data-id="2rdwrmj6z" data-path="src/pages/admin/AdminDashboard.tsx">
                              {submission.score}/{submission.totalMarks}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1" data-id="qbbvik55u" data-path="src/pages/admin/AdminDashboard.tsx">
                              {formatDate(submission.submittedAt)}
                            </p>
                          </div>
                        </div>
                    )}
                    </div>
                  }
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exams" className="space-y-4" data-id="g4icx26ds" data-path="src/pages/admin/AdminDashboard.tsx">
            <Card data-id="ksca5463u" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardHeader data-id="wbhi3rd5k" data-path="src/pages/admin/AdminDashboard.tsx">
                <CardTitle data-id="5av8dmip1" data-path="src/pages/admin/AdminDashboard.tsx">Recent Exams</CardTitle>
                <CardDescription data-id="qvrznn19r" data-path="src/pages/admin/AdminDashboard.tsx">
                  Your recently created exams
                </CardDescription>
              </CardHeader>
              <CardContent data-id="zs91jvm1a" data-path="src/pages/admin/AdminDashboard.tsx">
                {exams.length === 0 ?
                <div className="text-center py-6" data-id="0urt8iwhb" data-path="src/pages/admin/AdminDashboard.tsx">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" data-id="4i77v1cph" data-path="src/pages/admin/AdminDashboard.tsx" />
                    <p className="text-gray-500" data-id="j1qshx9n7" data-path="src/pages/admin/AdminDashboard.tsx">No exams created yet</p>
                    <Button asChild className="mt-2" data-id="juexwwe37" data-path="src/pages/admin/AdminDashboard.tsx">
                      <Link to="/admin/create-exam" data-id="nslrun6sd" data-path="src/pages/admin/AdminDashboard.tsx">Create Your First Exam</Link>
                    </Button>
                  </div> :

                <div className="space-y-3" data-id="g3ngcz8jn" data-path="src/pages/admin/AdminDashboard.tsx">
                    {exams.slice(0, 5).map((exam) =>
                  <div key={exam.id} className="flex items-center justify-between p-3 border rounded-lg" data-id="utxz1bepf" data-path="src/pages/admin/AdminDashboard.tsx">
                        <div data-id="feykr6trw" data-path="src/pages/admin/AdminDashboard.tsx">
                          <h3 className="font-medium" data-id="l4tu5ffuc" data-path="src/pages/admin/AdminDashboard.tsx">{exam.title}</h3>
                          <p className="text-sm text-gray-500" data-id="ynl6n9h5r" data-path="src/pages/admin/AdminDashboard.tsx">
                            {exam.questions.length} questions • {exam.timeLimit} minutes
                          </p>
                        </div>
                        <div className="flex items-center space-x-2" data-id="gnl0ugvd2" data-path="src/pages/admin/AdminDashboard.tsx">
                          <Badge variant={exam.isPublished ? 'default' : 'secondary'} data-id="qe174xv0h" data-path="src/pages/admin/AdminDashboard.tsx">
                            {exam.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                          <Button asChild size="sm" variant="outline" data-id="a5467dhdc" data-path="src/pages/admin/AdminDashboard.tsx">
                            <Link to={`/admin/exams/${exam.id}`} data-id="mzx725ovf" data-path="src/pages/admin/AdminDashboard.tsx">
                              <Eye className="w-4 h-4" data-id="pkecn9xnd" data-path="src/pages/admin/AdminDashboard.tsx" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                  )}
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4" data-id="m5svogi5a" data-path="src/pages/admin/AdminDashboard.tsx">
            <Card data-id="egra9nb1t" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardHeader data-id="lk87wthm3" data-path="src/pages/admin/AdminDashboard.tsx">
                <CardTitle data-id="hfig5mjrl" data-path="src/pages/admin/AdminDashboard.tsx">Recent Submissions</CardTitle>
                <CardDescription data-id="fqe3tkjdy" data-path="src/pages/admin/AdminDashboard.tsx">
                  Latest student exam submissions with scores
                </CardDescription>
              </CardHeader>
              <CardContent data-id="fdv3oyv4y" data-path="src/pages/admin/AdminDashboard.tsx">
                {submissions.length === 0 ?
                <div className="text-center py-6" data-id="6ku5mkjxn" data-path="src/pages/admin/AdminDashboard.tsx">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" data-id="3907aofaf" data-path="src/pages/admin/AdminDashboard.tsx" />
                    <p className="text-gray-500" data-id="sr9wolbbk" data-path="src/pages/admin/AdminDashboard.tsx">No submissions yet</p>
                  </div> :

                <div className="space-y-3" data-id="my4m2hcoa" data-path="src/pages/admin/AdminDashboard.tsx">
                    {recentSubmissions.map((submission) =>
                  <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg" data-id="okaucy7pu" data-path="src/pages/admin/AdminDashboard.tsx">
                        <div data-id="h2rlww0s8" data-path="src/pages/admin/AdminDashboard.tsx">
                          <h3 className="font-medium" data-id="jy5ymszbp" data-path="src/pages/admin/AdminDashboard.tsx">{submission.userName}</h3>
                          <p className="text-sm text-gray-500" data-id="n6cv2edbx" data-path="src/pages/admin/AdminDashboard.tsx">
                            {submission.examTitle} • {formatDate(submission.submittedAt)}
                          </p>
                          <p className="text-xs text-gray-400" data-id="jt8yi7fj1" data-path="src/pages/admin/AdminDashboard.tsx">
                            {submission.userEmail}
                          </p>
                        </div>
                        <div className="text-right" data-id="9vmaaylj8" data-path="src/pages/admin/AdminDashboard.tsx">
                          <Badge variant={getScoreBadgeVariant(submission.score, submission.totalMarks)} className="mb-1" data-id="cxicynjjp" data-path="src/pages/admin/AdminDashboard.tsx">
                            {submission.score}/{submission.totalMarks} marks
                          </Badge>
                          <p className="text-xs text-gray-500" data-id="xoqxapc8o" data-path="src/pages/admin/AdminDashboard.tsx">
                            Time: {submission.timeSpent}m
                          </p>
                          <p className="text-xs text-gray-400" data-id="w9e3avmrp" data-path="src/pages/admin/AdminDashboard.tsx">
                            {Math.round(submission.score / submission.totalMarks * 100)}%
                          </p>
                        </div>
                      </div>
                  )}
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rankings" className="space-y-4" data-id="t1dkes6ji" data-path="src/pages/admin/AdminDashboard.tsx">
            <Card data-id="rirsmddq4" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardHeader data-id="q9s0ew7si" data-path="src/pages/admin/AdminDashboard.tsx">
                <CardTitle className="flex items-center" data-id="97txhpfji" data-path="src/pages/admin/AdminDashboard.tsx">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-600" data-id="4xew3l2gr" data-path="src/pages/admin/AdminDashboard.tsx" />
                  Student Rankings
                </CardTitle>
                <CardDescription data-id="8vwywim2h" data-path="src/pages/admin/AdminDashboard.tsx">
                  Overall student performance rankings based on total scores
                </CardDescription>
              </CardHeader>
              <CardContent data-id="o3vsjw8z2" data-path="src/pages/admin/AdminDashboard.tsx">
                {studentRankings.length === 0 ?
                <div className="text-center py-6" data-id="5slvvjg2a" data-path="src/pages/admin/AdminDashboard.tsx">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-2" data-id="v4obzxhbd" data-path="src/pages/admin/AdminDashboard.tsx" />
                    <p className="text-gray-500" data-id="yt2pgig0h" data-path="src/pages/admin/AdminDashboard.tsx">No rankings available yet</p>
                  </div> :

                <div className="space-y-3" data-id="wz22wmxde" data-path="src/pages/admin/AdminDashboard.tsx">
                    {studentRankings.slice(0, 10).map((student) =>
                  <div key={student.userId} className="flex items-center justify-between p-3 border rounded-lg" data-id="c4f6l7pbu" data-path="src/pages/admin/AdminDashboard.tsx">
                        <div className="flex items-center space-x-3" data-id="j9qlwe4tq" data-path="src/pages/admin/AdminDashboard.tsx">
                          <div className="flex items-center" data-id="z42sd8y2v" data-path="src/pages/admin/AdminDashboard.tsx">
                            <Badge variant={getRankBadgeVariant(student.rank)} className="w-8 h-8 rounded-full flex items-center justify-center" data-id="8rnenmsqv" data-path="src/pages/admin/AdminDashboard.tsx">
                              {student.rank}
                            </Badge>
                            {student.rank === 1 && <Award className="w-4 h-4 text-yellow-500 ml-1" data-id="ln7m2hegd" data-path="src/pages/admin/AdminDashboard.tsx" />}
                          </div>
                          <div data-id="cu1ula9gz" data-path="src/pages/admin/AdminDashboard.tsx">
                            <h3 className="font-medium" data-id="yw3zxt0y9" data-path="src/pages/admin/AdminDashboard.tsx">{student.userName}</h3>
                            <p className="text-sm text-gray-500" data-id="31r5knse7" data-path="src/pages/admin/AdminDashboard.tsx">{student.userEmail}</p>
                          </div>
                        </div>
                        <div className="text-right" data-id="jxzns64wo" data-path="src/pages/admin/AdminDashboard.tsx">
                          <p className="font-semibold" data-id="1tfryvu3r" data-path="src/pages/admin/AdminDashboard.tsx">{student.totalScore} marks</p>
                          <p className="text-sm text-gray-500" data-id="hoocug9gp" data-path="src/pages/admin/AdminDashboard.tsx">{student.totalExams} exams</p>
                          <p className="text-xs text-gray-400" data-id="3m932pl0s" data-path="src/pages/admin/AdminDashboard.tsx">Avg: {student.averageScore}</p>
                        </div>
                      </div>
                  )}
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exam-rankings" className="space-y-4" data-id="sahcogmd6" data-path="src/pages/admin/AdminDashboard.tsx">
            {examRankings.map((examRanking) =>
            <Card key={examRanking.examId} data-id="sydehkohs" data-path="src/pages/admin/AdminDashboard.tsx">
                <CardHeader data-id="yf5iajaya" data-path="src/pages/admin/AdminDashboard.tsx">
                  <CardTitle className="flex items-center" data-id="3c83677hm" data-path="src/pages/admin/AdminDashboard.tsx">
                    <Target className="w-5 h-5 mr-2 text-indigo-600" data-id="5ffzcx5nu" data-path="src/pages/admin/AdminDashboard.tsx" />
                    {examRanking.examTitle} Rankings
                  </CardTitle>
                  <CardDescription data-id="d5f16am22" data-path="src/pages/admin/AdminDashboard.tsx">
                    Student performance rankings for this specific exam
                  </CardDescription>
                </CardHeader>
                <CardContent data-id="08202jubk" data-path="src/pages/admin/AdminDashboard.tsx">
                  {examRanking.submissions.length === 0 ?
                <p className="text-gray-500 text-sm" data-id="671v4mtzh" data-path="src/pages/admin/AdminDashboard.tsx">No submissions for this exam</p> :

                <div className="space-y-3" data-id="siy0p14el" data-path="src/pages/admin/AdminDashboard.tsx">
                      {examRanking.submissions.slice(0, 5).map((submission) =>
                  <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg" data-id="dq14n8d6y" data-path="src/pages/admin/AdminDashboard.tsx">
                          <div className="flex items-center space-x-3" data-id="z78vu0uas" data-path="src/pages/admin/AdminDashboard.tsx">
                            <Badge variant={getRankBadgeVariant(submission.rank)} className="w-8 h-8 rounded-full flex items-center justify-center" data-id="uif58tvm5" data-path="src/pages/admin/AdminDashboard.tsx">
                              {submission.rank}
                            </Badge>
                            <div data-id="qw7gdne0e" data-path="src/pages/admin/AdminDashboard.tsx">
                              <h3 className="font-medium" data-id="ye2hmw2q7" data-path="src/pages/admin/AdminDashboard.tsx">{submission.userName}</h3>
                              <p className="text-sm text-gray-500" data-id="60yh0bikc" data-path="src/pages/admin/AdminDashboard.tsx">{submission.userEmail}</p>
                            </div>
                          </div>
                          <div className="text-right" data-id="em6qvz060" data-path="src/pages/admin/AdminDashboard.tsx">
                            <Badge variant={getScoreBadgeVariant(submission.score, submission.totalMarks)} data-id="8rg3l6fon" data-path="src/pages/admin/AdminDashboard.tsx">
                              {submission.score}/{submission.totalMarks}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1" data-id="gyc568muf" data-path="src/pages/admin/AdminDashboard.tsx">
                              Time: {submission.timeSpent}m
                            </p>
                            <p className="text-xs text-gray-400" data-id="8mp61ydhh" data-path="src/pages/admin/AdminDashboard.tsx">
                              {formatDate(submission.submittedAt)}
                            </p>
                          </div>
                        </div>
                  )}
                    </div>
                }
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>);

};

export default AdminDashboard;