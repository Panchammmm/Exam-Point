
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { examService } from '@/services/examService';
import { Exam } from '@/types';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  BookOpen,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  ArrowLeft } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExamManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadExams = React.useCallback(async () => {
    try {
      const allExams = await examService.getAllExams();
      setExams(allExams.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
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
  }, [toast]);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  const handlePublishToggle = async (exam: Exam) => {
    try {
      if (exam.isPublished) {
        await examService.unpublishExam(exam.id);
        toast({
          title: "Exam unpublished",
          description: `"${exam.title}" is now hidden from students.`
        });
      } else {
        await examService.publishExam(exam.id);
        toast({
          title: "Exam published",
          description: `"${exam.title}" is now available to students.`
        });
      }
      await loadExams();
    } catch (error) {
      console.error('Error toggling exam status:', error);
      toast({
        title: "Error",
        description: "Failed to update exam status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteExam = async () => {
    if (!examToDelete) return;

    setIsDeleting(true);
    try {
      await examService.deleteExam(examToDelete.id);
      toast({
        title: "Exam deleted",
        description: `"${examToDelete.title}" has been permanently deleted.`
      });
      await loadExams();
      setExamToDelete(null);
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast({
        title: "Error",
        description: "Failed to delete exam. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Layout data-id="jqm9k00ic" data-path="src/pages/admin/ExamManagement.tsx">
        <div className="flex justify-center items-center h-64" data-id="dfald8hpr" data-path="src/pages/admin/ExamManagement.tsx">
          <LoadingSpinner size="lg" text="Loading exams..." data-id="s7qud625k" data-path="src/pages/admin/ExamManagement.tsx" />
        </div>
      </Layout>);

  }

  return (
    <Layout data-id="izqk92upf" data-path="src/pages/admin/ExamManagement.tsx">
      <div className="space-y-6" data-id="r02c091rm" data-path="src/pages/admin/ExamManagement.tsx">
        {/* Header */}
        <div className="flex items-center justify-between" data-id="foyk8zuce" data-path="src/pages/admin/ExamManagement.tsx">
          <div className="flex items-center space-x-4" data-id="hf73cvma4" data-path="src/pages/admin/ExamManagement.tsx">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')} data-id="qt9iacica" data-path="src/pages/admin/ExamManagement.tsx">

              <ArrowLeft className="w-4 h-4 mr-2" data-id="lv57gr01j" data-path="src/pages/admin/ExamManagement.tsx" />
              Back to Dashboard
            </Button>
            <div data-id="257updypl" data-path="src/pages/admin/ExamManagement.tsx">
              <h1 className="text-3xl font-bold text-gray-900" data-id="j95ptyvfc" data-path="src/pages/admin/ExamManagement.tsx">Exam Management</h1>
              <p className="text-gray-600" data-id="kigrur0et" data-path="src/pages/admin/ExamManagement.tsx">Create, edit, and manage your exams</p>
            </div>
          </div>
          <Button asChild data-id="9vwz4kq0u" data-path="src/pages/admin/ExamManagement.tsx">
            <Link to="/admin/create-exam" data-id="656bw97mc" data-path="src/pages/admin/ExamManagement.tsx">
              <Plus className="w-4 h-4 mr-2" data-id="wna5g43zf" data-path="src/pages/admin/ExamManagement.tsx" />
              Create New Exam
            </Link>
          </Button>
        </div>

        {/* Exams List */}
        {exams.length === 0 ?
        <Card data-id="orf53s5eu" data-path="src/pages/admin/ExamManagement.tsx">
            <CardContent className="text-center py-12" data-id="f6zwloqak" data-path="src/pages/admin/ExamManagement.tsx">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" data-id="jb3xbs6vq" data-path="src/pages/admin/ExamManagement.tsx" />
              <h3 className="text-lg font-medium text-gray-900 mb-2" data-id="g3ysgzo98" data-path="src/pages/admin/ExamManagement.tsx">No exams created yet</h3>
              <p className="text-gray-600 mb-4" data-id="pqs0k37pb" data-path="src/pages/admin/ExamManagement.tsx">
                Create your first exam to start assessing students.
              </p>
              <Button asChild data-id="kgsggbevu" data-path="src/pages/admin/ExamManagement.tsx">
                <Link to="/admin/create-exam" data-id="4cbz5rf4k" data-path="src/pages/admin/ExamManagement.tsx">
                  <Plus className="w-4 h-4 mr-2" data-id="l58ur5uy3" data-path="src/pages/admin/ExamManagement.tsx" />
                  Create Your First Exam
                </Link>
              </Button>
            </CardContent>
          </Card> :

        <div className="grid gap-4" data-id="gkfrmmbjm" data-path="src/pages/admin/ExamManagement.tsx">
            {exams.map((exam) =>
          <Card key={exam.id} className="hover:shadow-md transition-shadow" data-id="5iikxhrxw" data-path="src/pages/admin/ExamManagement.tsx">
                <CardHeader data-id="ffko5bvlw" data-path="src/pages/admin/ExamManagement.tsx">
                  <div className="flex items-center justify-between" data-id="y944tnd58" data-path="src/pages/admin/ExamManagement.tsx">
                    <div className="flex-1" data-id="12uv49zyj" data-path="src/pages/admin/ExamManagement.tsx">
                      <CardTitle className="flex items-center space-x-2" data-id="v6mj7g9b9" data-path="src/pages/admin/ExamManagement.tsx">
                        <BookOpen className="w-5 h-5 text-indigo-600" data-id="7v1nx7a2w" data-path="src/pages/admin/ExamManagement.tsx" />
                        <span data-id="mf6iyz2tm" data-path="src/pages/admin/ExamManagement.tsx">{exam.title}</span>
                        <Badge variant={exam.isPublished ? 'default' : 'secondary'} data-id="ru2pg3mab" data-path="src/pages/admin/ExamManagement.tsx">
                          {exam.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1" data-id="bggbi5amt" data-path="src/pages/admin/ExamManagement.tsx">
                        Created on {formatDate(exam.createdAt)}
                      </CardDescription>
                    </div>
                    <DropdownMenu data-id="gw07ivbpp" data-path="src/pages/admin/ExamManagement.tsx">
                      <DropdownMenuTrigger asChild data-id="mnoit711d" data-path="src/pages/admin/ExamManagement.tsx">
                        <Button variant="ghost" size="sm" data-id="qd2qd941w" data-path="src/pages/admin/ExamManagement.tsx">
                          <MoreVertical className="w-4 h-4" data-id="fw8xg5ndj" data-path="src/pages/admin/ExamManagement.tsx" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" data-id="r85ad42tv" data-path="src/pages/admin/ExamManagement.tsx">
                        <DropdownMenuItem onClick={() => handlePublishToggle(exam)} data-id="om7wmxo2l" data-path="src/pages/admin/ExamManagement.tsx">
                          {exam.isPublished ?
                      <>
                              <EyeOff className="w-4 h-4 mr-2" data-id="2f4auerjk" data-path="src/pages/admin/ExamManagement.tsx" />
                              Unpublish
                            </> :

                      <>
                              <Eye className="w-4 h-4 mr-2" data-id="d6xd6wzgp" data-path="src/pages/admin/ExamManagement.tsx" />
                              Publish
                            </>
                      }
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/admin/exams/${exam.id}/edit`)} data-id="244x56x57" data-path="src/pages/admin/ExamManagement.tsx">
                          <Edit className="w-4 h-4 mr-2" data-id="c19wjaynl" data-path="src/pages/admin/ExamManagement.tsx" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                      onClick={() => setExamToDelete(exam)}
                      className="text-red-600" data-id="7dy7mskwj" data-path="src/pages/admin/ExamManagement.tsx">

                          <Trash2 className="w-4 h-4 mr-2" data-id="7rh8zmyik" data-path="src/pages/admin/ExamManagement.tsx" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent data-id="l3a46hady" data-path="src/pages/admin/ExamManagement.tsx">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600" data-id="91fgv7ckc" data-path="src/pages/admin/ExamManagement.tsx">
                    <div className="flex items-center space-x-2" data-id="qrn8o7gba" data-path="src/pages/admin/ExamManagement.tsx">
                      <Clock className="w-4 h-4" data-id="50nf8h3ij" data-path="src/pages/admin/ExamManagement.tsx" />
                      <span data-id="xucylhkrp" data-path="src/pages/admin/ExamManagement.tsx">{exam.timeLimit} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2" data-id="i2oaz4bsn" data-path="src/pages/admin/ExamManagement.tsx">
                      <BookOpen className="w-4 h-4" data-id="zepmzq09s" data-path="src/pages/admin/ExamManagement.tsx" />
                      <span data-id="n63bzoy32" data-path="src/pages/admin/ExamManagement.tsx">{exam.questions.length} questions</span>
                    </div>
                    <div className="flex items-center space-x-2" data-id="vs09rzmqq" data-path="src/pages/admin/ExamManagement.tsx">
                      <span className="font-medium" data-id="mlzjlw23c" data-path="src/pages/admin/ExamManagement.tsx">Password:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs" data-id="ah5ob7amq" data-path="src/pages/admin/ExamManagement.tsx">
                        {exam.password}
                      </code>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-2" data-id="7wvqzfele" data-path="src/pages/admin/ExamManagement.tsx">
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/exams/${exam.id}`)} data-id="ciqti18xp" data-path="src/pages/admin/ExamManagement.tsx">

                      <Eye className="w-4 h-4 mr-2" data-id="xsa4l3sbc" data-path="src/pages/admin/ExamManagement.tsx" />
                      View Details
                    </Button>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/exams/${exam.id}/edit`)} data-id="6yi2315bw" data-path="src/pages/admin/ExamManagement.tsx">

                      <Edit className="w-4 h-4 mr-2" data-id="u4cnug1vg" data-path="src/pages/admin/ExamManagement.tsx" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
          )}
          </div>
        }

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!examToDelete} onOpenChange={() => setExamToDelete(null)} data-id="05x58fudo" data-path="src/pages/admin/ExamManagement.tsx">
          <AlertDialogContent data-id="quutd36xu" data-path="src/pages/admin/ExamManagement.tsx">
            <AlertDialogHeader data-id="8f8ud6fie" data-path="src/pages/admin/ExamManagement.tsx">
              <AlertDialogTitle data-id="3ikdbrlcr" data-path="src/pages/admin/ExamManagement.tsx">Delete Exam</AlertDialogTitle>
              <AlertDialogDescription data-id="at6tz4jus" data-path="src/pages/admin/ExamManagement.tsx">
                Are you sure you want to delete "{examToDelete?.title}"? This action cannot be undone.
                All associated submissions will also be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter data-id="xmm1xkt45" data-path="src/pages/admin/ExamManagement.tsx">
              <AlertDialogCancel disabled={isDeleting} data-id="8zp6ol2mh" data-path="src/pages/admin/ExamManagement.tsx">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteExam}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700" data-id="r98hihe9k" data-path="src/pages/admin/ExamManagement.tsx">

                {isDeleting ? <LoadingSpinner size="sm" data-id="q0y20kzej" data-path="src/pages/admin/ExamManagement.tsx" /> : 'Delete Exam'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>);

};

export default ExamManagement;