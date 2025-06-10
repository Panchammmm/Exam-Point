
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

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
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
  };

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
      <Layout data-id="i1pb7zkmk" data-path="src/pages/admin/ExamManagement.tsx">
        <div className="flex justify-center items-center h-64" data-id="xt2vfof7a" data-path="src/pages/admin/ExamManagement.tsx">
          <LoadingSpinner size="lg" text="Loading exams..." data-id="wwc4wdk2c" data-path="src/pages/admin/ExamManagement.tsx" />
        </div>
      </Layout>);

  }

  return (
    <Layout data-id="zdo2j8bkt" data-path="src/pages/admin/ExamManagement.tsx">
      <div className="space-y-6" data-id="dsqwspzvw" data-path="src/pages/admin/ExamManagement.tsx">
        {/* Header */}
        <div className="flex items-center justify-between" data-id="nw6ozuunj" data-path="src/pages/admin/ExamManagement.tsx">
          <div className="flex items-center space-x-4" data-id="r0o7zqlg6" data-path="src/pages/admin/ExamManagement.tsx">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')} data-id="e8xtl652s" data-path="src/pages/admin/ExamManagement.tsx">

              <ArrowLeft className="w-4 h-4 mr-2" data-id="l0j2a0jw4" data-path="src/pages/admin/ExamManagement.tsx" />
              Back to Dashboard
            </Button>
            <div data-id="ir8upu7jy" data-path="src/pages/admin/ExamManagement.tsx">
              <h1 className="text-3xl font-bold text-gray-900" data-id="d6o6p9xd9" data-path="src/pages/admin/ExamManagement.tsx">Exam Management</h1>
              <p className="text-gray-600" data-id="wjukrww1l" data-path="src/pages/admin/ExamManagement.tsx">Create, edit, and manage your exams</p>
            </div>
          </div>
          <Button asChild data-id="7dy89blms" data-path="src/pages/admin/ExamManagement.tsx">
            <Link to="/admin/create-exam" data-id="1yu5pvuzr" data-path="src/pages/admin/ExamManagement.tsx">
              <Plus className="w-4 h-4 mr-2" data-id="8h0mgfpbq" data-path="src/pages/admin/ExamManagement.tsx" />
              Create New Exam
            </Link>
          </Button>
        </div>

        {/* Exams List */}
        {exams.length === 0 ?
        <Card data-id="p7z9bkqd2" data-path="src/pages/admin/ExamManagement.tsx">
            <CardContent className="text-center py-12" data-id="y1h4t6m86" data-path="src/pages/admin/ExamManagement.tsx">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" data-id="v36to8ltc" data-path="src/pages/admin/ExamManagement.tsx" />
              <h3 className="text-lg font-medium text-gray-900 mb-2" data-id="ktzmml5bz" data-path="src/pages/admin/ExamManagement.tsx">No exams created yet</h3>
              <p className="text-gray-600 mb-4" data-id="y8vfo6f9j" data-path="src/pages/admin/ExamManagement.tsx">
                Create your first exam to start assessing students.
              </p>
              <Button asChild data-id="ybaodsxqz" data-path="src/pages/admin/ExamManagement.tsx">
                <Link to="/admin/create-exam" data-id="gvli1i4zg" data-path="src/pages/admin/ExamManagement.tsx">
                  <Plus className="w-4 h-4 mr-2" data-id="o5pjws5rd" data-path="src/pages/admin/ExamManagement.tsx" />
                  Create Your First Exam
                </Link>
              </Button>
            </CardContent>
          </Card> :

        <div className="grid gap-4" data-id="u7zw5rlnj" data-path="src/pages/admin/ExamManagement.tsx">
            {exams.map((exam) =>
          <Card key={exam.id} className="hover:shadow-md transition-shadow" data-id="xrpjqwsco" data-path="src/pages/admin/ExamManagement.tsx">
                <CardHeader data-id="cmpwz58pp" data-path="src/pages/admin/ExamManagement.tsx">
                  <div className="flex items-center justify-between" data-id="giec7yqac" data-path="src/pages/admin/ExamManagement.tsx">
                    <div className="flex-1" data-id="s7kp9typh" data-path="src/pages/admin/ExamManagement.tsx">
                      <CardTitle className="flex items-center space-x-2" data-id="fcorucple" data-path="src/pages/admin/ExamManagement.tsx">
                        <BookOpen className="w-5 h-5 text-indigo-600" data-id="96piduzde" data-path="src/pages/admin/ExamManagement.tsx" />
                        <span data-id="3zognoszt" data-path="src/pages/admin/ExamManagement.tsx">{exam.title}</span>
                        <Badge variant={exam.isPublished ? 'default' : 'secondary'} data-id="pputc13t3" data-path="src/pages/admin/ExamManagement.tsx">
                          {exam.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1" data-id="no2upkyvv" data-path="src/pages/admin/ExamManagement.tsx">
                        Created on {formatDate(exam.createdAt)}
                      </CardDescription>
                    </div>
                    <DropdownMenu data-id="a2w74euk4" data-path="src/pages/admin/ExamManagement.tsx">
                      <DropdownMenuTrigger asChild data-id="33nf74rvz" data-path="src/pages/admin/ExamManagement.tsx">
                        <Button variant="ghost" size="sm" data-id="ihytml9xy" data-path="src/pages/admin/ExamManagement.tsx">
                          <MoreVertical className="w-4 h-4" data-id="dq5k3yvfo" data-path="src/pages/admin/ExamManagement.tsx" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" data-id="xim0jq4ef" data-path="src/pages/admin/ExamManagement.tsx">
                        <DropdownMenuItem onClick={() => handlePublishToggle(exam)} data-id="ar48m3nv8" data-path="src/pages/admin/ExamManagement.tsx">
                          {exam.isPublished ?
                      <>
                              <EyeOff className="w-4 h-4 mr-2" data-id="qh6rix5n5" data-path="src/pages/admin/ExamManagement.tsx" />
                              Unpublish
                            </> :

                      <>
                              <Eye className="w-4 h-4 mr-2" data-id="p48lsxwy1" data-path="src/pages/admin/ExamManagement.tsx" />
                              Publish
                            </>
                      }
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/admin/exams/${exam.id}/edit`)} data-id="bw3emmqbd" data-path="src/pages/admin/ExamManagement.tsx">
                          <Edit className="w-4 h-4 mr-2" data-id="fipckvyee" data-path="src/pages/admin/ExamManagement.tsx" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                      onClick={() => setExamToDelete(exam)}
                      className="text-red-600" data-id="ubs22jar5" data-path="src/pages/admin/ExamManagement.tsx">

                          <Trash2 className="w-4 h-4 mr-2" data-id="9ij0a0x30" data-path="src/pages/admin/ExamManagement.tsx" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent data-id="lwb73x5cg" data-path="src/pages/admin/ExamManagement.tsx">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600" data-id="ap57w5chr" data-path="src/pages/admin/ExamManagement.tsx">
                    <div className="flex items-center space-x-2" data-id="mczqxrif5" data-path="src/pages/admin/ExamManagement.tsx">
                      <Clock className="w-4 h-4" data-id="ouepuzhxz" data-path="src/pages/admin/ExamManagement.tsx" />
                      <span data-id="0vpjzf7ts" data-path="src/pages/admin/ExamManagement.tsx">{exam.timeLimit} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2" data-id="j94qf2aw0" data-path="src/pages/admin/ExamManagement.tsx">
                      <BookOpen className="w-4 h-4" data-id="gtfhkhrwk" data-path="src/pages/admin/ExamManagement.tsx" />
                      <span data-id="k6id1r2yn" data-path="src/pages/admin/ExamManagement.tsx">{exam.questions.length} questions</span>
                    </div>
                    <div className="flex items-center space-x-2" data-id="eilh7vetf" data-path="src/pages/admin/ExamManagement.tsx">
                      <span className="font-medium" data-id="kj7opob8s" data-path="src/pages/admin/ExamManagement.tsx">Password:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs" data-id="h0968bhxa" data-path="src/pages/admin/ExamManagement.tsx">
                        {exam.password}
                      </code>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-2" data-id="tg6eje5dm" data-path="src/pages/admin/ExamManagement.tsx">
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/exams/${exam.id}`)} data-id="ebuxlt8qa" data-path="src/pages/admin/ExamManagement.tsx">

                      <Eye className="w-4 h-4 mr-2" data-id="4hvhr18rs" data-path="src/pages/admin/ExamManagement.tsx" />
                      View Details
                    </Button>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/exams/${exam.id}/edit`)} data-id="a9n1jx56o" data-path="src/pages/admin/ExamManagement.tsx">

                      <Edit className="w-4 h-4 mr-2" data-id="wqcfrpiiu" data-path="src/pages/admin/ExamManagement.tsx" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
          )}
          </div>
        }

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!examToDelete} onOpenChange={() => setExamToDelete(null)} data-id="9lf032bap" data-path="src/pages/admin/ExamManagement.tsx">
          <AlertDialogContent data-id="yjzk8pqhp" data-path="src/pages/admin/ExamManagement.tsx">
            <AlertDialogHeader data-id="d4utklquk" data-path="src/pages/admin/ExamManagement.tsx">
              <AlertDialogTitle data-id="5s2au1a6k" data-path="src/pages/admin/ExamManagement.tsx">Delete Exam</AlertDialogTitle>
              <AlertDialogDescription data-id="gpeevwewx" data-path="src/pages/admin/ExamManagement.tsx">
                Are you sure you want to delete "{examToDelete?.title}"? This action cannot be undone.
                All associated submissions will also be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter data-id="ztaipyp68" data-path="src/pages/admin/ExamManagement.tsx">
              <AlertDialogCancel disabled={isDeleting} data-id="4y8o2n89h" data-path="src/pages/admin/ExamManagement.tsx">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteExam}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700" data-id="cqq4u6cvy" data-path="src/pages/admin/ExamManagement.tsx">

                {isDeleting ? <LoadingSpinner size="sm" data-id="hye2updu2" data-path="src/pages/admin/ExamManagement.tsx" /> : 'Delete Exam'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>);

};

export default ExamManagement;