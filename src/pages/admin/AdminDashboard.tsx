
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examService } from '@/services/examService';
import { Exam, ExamSubmission } from '@/types';
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
  Trophy } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadDashboardData = React.useCallback(async () => {
    try {
      const [allExams, allSubmissions] = await Promise.all([
        examService.getAllExams(),
        examService.getAllSubmissions()
      ]);

      setExams(allExams);
      setSubmissions(allSubmissions);
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
  }, [toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const getStats = () => {
    const publishedExams = exams.filter((exam) => exam.isPublished);
    const totalStudents = new Set(submissions.map((sub) => sub.userId)).size;
    const averageScore = submissions.length > 0 ?
    Math.round(submissions.reduce((sum, sub) => sum + sub.score, 0) / submissions.length) :
    0;

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

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    if (score >= 50) return 'outline';
    return 'destructive';
  };

  if (isLoading) {
    return (
      <Layout data-id="jm413pte2" data-path="src/pages/admin/AdminDashboard.tsx">
        <div className="flex justify-center items-center h-64" data-id="an0yvrs04" data-path="src/pages/admin/AdminDashboard.tsx">
          <LoadingSpinner size="lg" text="Loading dashboard..." data-id="kw9tvumoc" data-path="src/pages/admin/AdminDashboard.tsx" />
        </div>
      </Layout>);

  }

  const stats = getStats();
  const recentSubmissions = getRecentSubmissions();

  return (
    <Layout data-id="6axyx4x25" data-path="src/pages/admin/AdminDashboard.tsx">
      <div className="space-y-6" data-id="euesxeoi1" data-path="src/pages/admin/AdminDashboard.tsx">
        {/* Header */}
        <div className="flex justify-between items-center" data-id="h46cj2yi5" data-path="src/pages/admin/AdminDashboard.tsx">
          <div data-id="trvd4y5fa" data-path="src/pages/admin/AdminDashboard.tsx">
            <h1 className="text-3xl font-bold text-gray-900" data-id="bjhab9o2m" data-path="src/pages/admin/AdminDashboard.tsx">Admin Dashboard</h1>
            <p className="text-gray-600" data-id="zhmtnhd28" data-path="src/pages/admin/AdminDashboard.tsx">Manage exams and monitor student performance</p>
          </div>
          <Button asChild data-id="5dblhocbf" data-path="src/pages/admin/AdminDashboard.tsx">
            <Link to="/admin/create-exam" data-id="3m2kvrkm3" data-path="src/pages/admin/AdminDashboard.tsx">
              <Plus className="w-4 h-4 mr-2" data-id="ajlek0epa" data-path="src/pages/admin/AdminDashboard.tsx" />
              Create New Exam
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5" data-id="uwjcxndb4" data-path="src/pages/admin/AdminDashboard.tsx">
          <Card data-id="1b530ypbx" data-path="src/pages/admin/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="9gwg7w3m4" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="j4maxclxh" data-path="src/pages/admin/AdminDashboard.tsx">Total Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-indigo-600" data-id="8s93gtaj3" data-path="src/pages/admin/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="ckvyl32u1" data-path="src/pages/admin/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="bgorvpazy" data-path="src/pages/admin/AdminDashboard.tsx">{stats.totalExams}</div>
              <p className="text-xs text-muted-foreground" data-id="v1j2391cd" data-path="src/pages/admin/AdminDashboard.tsx">
                {stats.publishedExams} published
              </p>
            </CardContent>
          </Card>

          <Card data-id="tmegv4kq3" data-path="src/pages/admin/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="ahi7v4w9x" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="voal3et4v" data-path="src/pages/admin/AdminDashboard.tsx">Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" data-id="nq2rfi34h" data-path="src/pages/admin/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="dpakhr9no" data-path="src/pages/admin/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="vyh8bje3m" data-path="src/pages/admin/AdminDashboard.tsx">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground" data-id="gcpnj3i1b" data-path="src/pages/admin/AdminDashboard.tsx">
                Active participants
              </p>
            </CardContent>
          </Card>

          <Card data-id="tqwumx969" data-path="src/pages/admin/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="50qnp3bo5" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="ibh29elut" data-path="src/pages/admin/AdminDashboard.tsx">Submissions</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" data-id="v3cf9xvtu" data-path="src/pages/admin/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="jyz2b3j0d" data-path="src/pages/admin/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="5lh0sfmbe" data-path="src/pages/admin/AdminDashboard.tsx">{stats.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground" data-id="95rk7jrps" data-path="src/pages/admin/AdminDashboard.tsx">
                Total attempts
              </p>
            </CardContent>
          </Card>

          <Card data-id="d1mk416nx" data-path="src/pages/admin/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="89g80tbo5" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="wwt0z2v8o" data-path="src/pages/admin/AdminDashboard.tsx">Average Score</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" data-id="f7jbwbpny" data-path="src/pages/admin/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="3t0x7tda5" data-path="src/pages/admin/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="us4zbzqdi" data-path="src/pages/admin/AdminDashboard.tsx">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground" data-id="yaeret4t9" data-path="src/pages/admin/AdminDashboard.tsx">
                Overall performance
              </p>
            </CardContent>
          </Card>

          <Card data-id="uyxtxhzzg" data-path="src/pages/admin/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="h8lrf6wy6" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="5ln38uyuh" data-path="src/pages/admin/AdminDashboard.tsx">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" data-id="eaj65g03f" data-path="src/pages/admin/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="8lewz947h" data-path="src/pages/admin/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="yev7mdf58" data-path="src/pages/admin/AdminDashboard.tsx">{submissions.length}</div>
              <p className="text-xs text-muted-foreground" data-id="hjmsm8t9h" data-path="src/pages/admin/AdminDashboard.tsx">
                New submissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4" data-id="2zslot3ym" data-path="src/pages/admin/AdminDashboard.tsx">
          <TabsList data-id="vjrsp4pme" data-path="src/pages/admin/AdminDashboard.tsx">
            <TabsTrigger value="overview" data-id="7thrmabgz" data-path="src/pages/admin/AdminDashboard.tsx">Overview</TabsTrigger>
            <TabsTrigger value="exams" data-id="vjaxcjz0z" data-path="src/pages/admin/AdminDashboard.tsx">Recent Exams</TabsTrigger>
            <TabsTrigger value="submissions" data-id="lsmkkl2vj" data-path="src/pages/admin/AdminDashboard.tsx">Recent Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4" data-id="r7g6u3o0i" data-path="src/pages/admin/AdminDashboard.tsx">
            <div className="grid gap-4 md:grid-cols-2" data-id="r6nk41k18" data-path="src/pages/admin/AdminDashboard.tsx">
              {/* Quick Actions */}
              <Card data-id="dogop8bzi" data-path="src/pages/admin/AdminDashboard.tsx">
                <CardHeader data-id="b84uit28q" data-path="src/pages/admin/AdminDashboard.tsx">
                  <CardTitle data-id="ug3jl98wd" data-path="src/pages/admin/AdminDashboard.tsx">Quick Actions</CardTitle>
                  <CardDescription data-id="dmg7hy4gv" data-path="src/pages/admin/AdminDashboard.tsx">
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2" data-id="nvai9jtb7" data-path="src/pages/admin/AdminDashboard.tsx">
                  <Button asChild className="w-full justify-start" data-id="4z345pwz4" data-path="src/pages/admin/AdminDashboard.tsx">
                    <Link to="/admin/create-exam" data-id="uu6m919pr" data-path="src/pages/admin/AdminDashboard.tsx">
                      <Plus className="w-4 h-4 mr-2" data-id="4x0hillps" data-path="src/pages/admin/AdminDashboard.tsx" />
                      Create New Exam
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start" data-id="90b5zy18c" data-path="src/pages/admin/AdminDashboard.tsx">
                    <Link to="/admin/exams" data-id="7z0sma1xc" data-path="src/pages/admin/AdminDashboard.tsx">
                      <BookOpen className="w-4 h-4 mr-2" data-id="6eyhv4o23" data-path="src/pages/admin/AdminDashboard.tsx" />
                      Manage Exams
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start" data-id="1bnavatio" data-path="src/pages/admin/AdminDashboard.tsx">
                    <Link to="/admin/submissions" data-id="5bvk9t77c" data-path="src/pages/admin/AdminDashboard.tsx">
                      <Eye className="w-4 h-4 mr-2" data-id="dcqmeefg7" data-path="src/pages/admin/AdminDashboard.tsx" />
                      View All Submissions
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card data-id="5ou0ocw54" data-path="src/pages/admin/AdminDashboard.tsx">
                <CardHeader data-id="5igf5i0ip" data-path="src/pages/admin/AdminDashboard.tsx">
                  <CardTitle data-id="41dbpgljr" data-path="src/pages/admin/AdminDashboard.tsx">Recent Activity</CardTitle>
                  <CardDescription data-id="pgf42gd9q" data-path="src/pages/admin/AdminDashboard.tsx">
                    Latest student submissions
                  </CardDescription>
                </CardHeader>
                <CardContent data-id="mzuvb6rpq" data-path="src/pages/admin/AdminDashboard.tsx">
                  {recentSubmissions.length === 0 ?
                  <p className="text-gray-500 text-sm" data-id="p9ne6uamv" data-path="src/pages/admin/AdminDashboard.tsx">No recent submissions</p> :

                  <div className="space-y-3" data-id="bydpycv04" data-path="src/pages/admin/AdminDashboard.tsx">
                      {recentSubmissions.map((submission) =>
                    <div key={submission.id} className="flex items-center justify-between" data-id="56ziviv05" data-path="src/pages/admin/AdminDashboard.tsx">
                          <div data-id="pldacejbm" data-path="src/pages/admin/AdminDashboard.tsx">
                            <p className="text-sm font-medium" data-id="hrooflqi6" data-path="src/pages/admin/AdminDashboard.tsx">{submission.userName}</p>
                            <p className="text-xs text-gray-500" data-id="8p9a38w8c" data-path="src/pages/admin/AdminDashboard.tsx">{submission.examTitle}</p>
                          </div>
                          <div className="text-right" data-id="puxgr985v" data-path="src/pages/admin/AdminDashboard.tsx">
                            <Badge variant={getScoreBadgeVariant(submission.score)} data-id="d7j3ny7ek" data-path="src/pages/admin/AdminDashboard.tsx">
                              {submission.score}%
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1" data-id="ia6mkfoj1" data-path="src/pages/admin/AdminDashboard.tsx">
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

          <TabsContent value="exams" className="space-y-4" data-id="xhkkgfz8b" data-path="src/pages/admin/AdminDashboard.tsx">
            <Card data-id="zt9e2aj4h" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardHeader data-id="vz4ru0jdy" data-path="src/pages/admin/AdminDashboard.tsx">
                <CardTitle data-id="sh2xk4pbs" data-path="src/pages/admin/AdminDashboard.tsx">Recent Exams</CardTitle>
                <CardDescription data-id="8wj8y9w6t" data-path="src/pages/admin/AdminDashboard.tsx">
                  Your recently created exams
                </CardDescription>
              </CardHeader>
              <CardContent data-id="ran6lnv50" data-path="src/pages/admin/AdminDashboard.tsx">
                {exams.length === 0 ?
                <div className="text-center py-6" data-id="925y423fg" data-path="src/pages/admin/AdminDashboard.tsx">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" data-id="thh6gg4ek" data-path="src/pages/admin/AdminDashboard.tsx" />
                    <p className="text-gray-500" data-id="fiftaaw56" data-path="src/pages/admin/AdminDashboard.tsx">No exams created yet</p>
                    <Button asChild className="mt-2" data-id="3cg4e5u8v" data-path="src/pages/admin/AdminDashboard.tsx">
                      <Link to="/admin/create-exam" data-id="hdlm250xt" data-path="src/pages/admin/AdminDashboard.tsx">Create Your First Exam</Link>
                    </Button>
                  </div> :

                <div className="space-y-3" data-id="29u9ixsop" data-path="src/pages/admin/AdminDashboard.tsx">
                    {exams.slice(0, 5).map((exam) =>
                  <div key={exam.id} className="flex items-center justify-between p-3 border rounded-lg" data-id="nqihf3cro" data-path="src/pages/admin/AdminDashboard.tsx">
                        <div data-id="15b0ikzrr" data-path="src/pages/admin/AdminDashboard.tsx">
                          <h3 className="font-medium" data-id="0zdf8gyep" data-path="src/pages/admin/AdminDashboard.tsx">{exam.title}</h3>
                          <p className="text-sm text-gray-500" data-id="2l0pe3m99" data-path="src/pages/admin/AdminDashboard.tsx">
                            {exam.questions.length} questions • {exam.timeLimit} minutes
                          </p>
                        </div>
                        <div className="flex items-center space-x-2" data-id="7f1ysbgns" data-path="src/pages/admin/AdminDashboard.tsx">
                          <Badge variant={exam.isPublished ? 'default' : 'secondary'} data-id="l9vf1bqcv" data-path="src/pages/admin/AdminDashboard.tsx">
                            {exam.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                          <Button asChild size="sm" variant="outline" data-id="7kaujq7gw" data-path="src/pages/admin/AdminDashboard.tsx">
                            <Link to={`/admin/exams/${exam.id}`} data-id="yq7d4inlg" data-path="src/pages/admin/AdminDashboard.tsx">
                              <Eye className="w-4 h-4" data-id="lzqd676af" data-path="src/pages/admin/AdminDashboard.tsx" />
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

          <TabsContent value="submissions" className="space-y-4" data-id="k4r9s0hks" data-path="src/pages/admin/AdminDashboard.tsx">
            <Card data-id="38tgrdd5g" data-path="src/pages/admin/AdminDashboard.tsx">
              <CardHeader data-id="gnyodba6h" data-path="src/pages/admin/AdminDashboard.tsx">
                <CardTitle data-id="lctbe1o7h" data-path="src/pages/admin/AdminDashboard.tsx">Recent Submissions</CardTitle>
                <CardDescription data-id="j73ch0vuk" data-path="src/pages/admin/AdminDashboard.tsx">
                  Latest student exam submissions
                </CardDescription>
              </CardHeader>
              <CardContent data-id="oe9y529m6" data-path="src/pages/admin/AdminDashboard.tsx">
                {submissions.length === 0 ?
                <div className="text-center py-6" data-id="bd2jn3tej" data-path="src/pages/admin/AdminDashboard.tsx">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" data-id="oafmnchwh" data-path="src/pages/admin/AdminDashboard.tsx" />
                    <p className="text-gray-500" data-id="8fgcq1rwc" data-path="src/pages/admin/AdminDashboard.tsx">No submissions yet</p>
                  </div> :

                <div className="space-y-3" data-id="qbn58bsnc" data-path="src/pages/admin/AdminDashboard.tsx">
                    {recentSubmissions.map((submission) =>
                  <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg" data-id="z7ht115z1" data-path="src/pages/admin/AdminDashboard.tsx">
                        <div data-id="moch92v7m" data-path="src/pages/admin/AdminDashboard.tsx">
                          <h3 className="font-medium" data-id="wp2p3qzv9" data-path="src/pages/admin/AdminDashboard.tsx">{submission.userName}</h3>
                          <p className="text-sm text-gray-500" data-id="oiy47l2k4" data-path="src/pages/admin/AdminDashboard.tsx">
                            {submission.examTitle} • {formatDate(submission.submittedAt)}
                          </p>
                        </div>
                        <div className="text-right" data-id="tb98xykpd" data-path="src/pages/admin/AdminDashboard.tsx">
                          <Badge variant={getScoreBadgeVariant(submission.score)} className="mb-1" data-id="v1b2vusi5" data-path="src/pages/admin/AdminDashboard.tsx">
                            {submission.score}%
                          </Badge>
                          <p className="text-xs text-gray-500" data-id="8ngjwoxr1" data-path="src/pages/admin/AdminDashboard.tsx">
                            Time: {submission.timeSpent}m
                          </p>
                        </div>
                      </div>
                  )}
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>);

};

export default AdminDashboard;