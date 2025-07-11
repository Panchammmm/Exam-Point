import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examService } from '@/services/examService';
import { CreateExamData, ExamSection, Question } from '@/types';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import QuestionBank from '@/components/QuestionBank';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, ArrowLeft, Upload, Database, Edit, Copy, Move } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuestionForm extends Omit<Question, 'id'> {}

const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [examData, setExamData] = useState({
    title: '',
    description: '',
    timeLimit: 120,
    password: '',
    allowBreaks: true,
    breakTimeLimit: 900 // 15 minutes in seconds
  });

  const [sections, setSections] = useState<Omit<ExamSection, 'id'>[]>([
  {
    title: 'General Section',
    description: '',
    questions: [],
    order: 1
  }]
  );

  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);

  const [newQuestion, setNewQuestion] = useState<QuestionForm>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    subject: '',
    topic: '',
    difficulty: 'medium',
    tags: [],
    // id: `tmp_${Date.now()}_${Math.random()}`
  });

  const handleExamDataChange = (field: string, value: string | number | boolean) => {
    setExamData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (sectionIndex: number, field: string, value: string) => {
    setSections((prev) => prev.map((section, index) =>
    index === sectionIndex ? { ...section, [field]: value } : section
    ));
  };

  const addSection = () => {
    setSections((prev) => [
    ...prev,
    {
      title: `Section ${prev.length + 1}`,
      description: '',
      questions: [],
      order: prev.length + 1
    }]
    );
  };

  const removeSection = (sectionIndex: number) => {
    if (sections.length > 1) {
      setSections((prev) => prev.filter((_, index) => index !== sectionIndex));
      if (currentSection >= sectionIndex && currentSection > 0) {
        setCurrentSection(currentSection - 1);
      }
    }
  };

  const handleQuestionChange = (field: string, value: string | number | string[]) => {
    setNewQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options.map((option, index) =>
      index === optionIndex ? value : option
      )
    }));
  };

  const addQuestionToSection = () => {
    if (!newQuestion.text || newQuestion.options.some((opt) => !opt.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all question fields",
        variant: "destructive"
      });
      return;
    }

    // setSections((prev) => prev.map((section, index) =>
    // index === currentSection ?
    // {
    //   ...section,
    //   questions: editingQuestion !== null ?
    //   section.questions.map((q, qIndex) => qIndex === editingQuestion ? { ...newQuestion, id: q.id } : q) :
    //   [...section.questions, { ...newQuestion, id: `tmp_${Date.now()}_${Math.random()}` }]
    // } :
    // section
    // ));

    setSections((prev) => prev.map((section, index) =>
    index === currentSection ?
    {
      ...section,
      questions: editingQuestion !== null ?
      section.questions.map((q, qIndex) => qIndex === editingQuestion ? newQuestion : q) :
      [...section.questions, newQuestion]
    } :
    section
    ));

  resetQuestionForm();
  };

  const resetQuestionForm = () => {
    setNewQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      subject: '',
      topic: '',
      difficulty: 'medium',
      tags: []
    });
    setEditingQuestion(null);
  };

  const editQuestion = (questionIndex: number) => {
    const question = sections[currentSection].questions[questionIndex];
    setNewQuestion(question);
    setEditingQuestion(questionIndex);
  };

  const removeQuestion = (questionIndex: number) => {
    setSections((prev) => prev.map((section, index) =>
    index === currentSection ?
    {
      ...section,
      questions: section.questions.filter((_, qIndex) => qIndex !== questionIndex)
    } :
    section
    ));
  };

  const duplicateQuestion = (questionIndex: number) => {
    const question = sections[currentSection].questions[questionIndex];
    setSections((prev) => prev.map((section, index) =>
    index === currentSection ?
    {
      ...section,
      questions: [...section.questions, { ...question }]
    } :
    section
    ));
  };

  const handleQuestionsFromBank = (selectedQuestions: Question[]) => {
    setSections((prev) => prev.map((section, index) =>
    index === currentSection ?
    {
      ...section,
      questions: [...section.questions, ...selectedQuestions]
    } :
    section
    ));

    setShowQuestionBank(false);
    toast({
      title: "Success",
      description: `${selectedQuestions.length} questions added to ${sections[currentSection].title}`
    });
  };

  const validateForm = (): string[] => {
    const validationErrors: string[] = [];

    if (!examData.title.trim()) {
      validationErrors.push('Exam title is required');
    }
    if (examData.timeLimit < 1) {
      validationErrors.push('Time limit must be at least 1 minute');
    }
    if (!examData.password.trim()) {
      validationErrors.push('Exam password is required');
    }

    if (sections.length === 0) {
      validationErrors.push('At least one section is required');
    }

    sections.forEach((section, sIndex) => {
      if (!section.title.trim()) {
        validationErrors.push(`Section ${sIndex + 1}: Title is required`);
      }
      if (section.questions.length === 0) {
        validationErrors.push(`Section ${sIndex + 1}: At least one question is required`);
      }

      section.questions.forEach((question, qIndex) => {
        if (!question.text.trim()) {
          validationErrors.push(`Section ${sIndex + 1}, Question ${qIndex + 1}: Question text is required`);
        }
        if (question.options.some((opt) => !opt.trim())) {
          validationErrors.push(`Section ${sIndex + 1}, Question ${qIndex + 1}: All options must be filled`);
        }
      });
    });

    return validationErrors;
  };

  const handleSubmit = async (isDraft: boolean = true) => {
    setErrors([]);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const createData: CreateExamData = {
        title: examData.title,
        description: examData.description,
        timeLimit: examData.timeLimit,
        password: examData.password,
        allowBreaks: examData.allowBreaks,
        breakTimeLimit: examData.breakTimeLimit,
        sections: sections
      };

      const newExam = await examService.createExam(createData);

      if (!isDraft) {
        await examService.publishExam(newExam.id);
      }

      toast({
        title: "Exam created successfully!",
        description: `"${newExam.title}" has been ${isDraft ? 'saved as draft' : 'published'}.`
      });

      navigate('/admin/exams');
    } catch (error) {
      console.error('Error creating exam:', error);
      toast({
        title: "Error",
        description: "Failed to create exam. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);

  return (
    <Layout data-id="pkmy8lqo4" data-path="src/pages/admin/CreateExam.tsx">
      <div className="space-y-6" data-id="srs6b5zht" data-path="src/pages/admin/CreateExam.tsx">
        {/* Header */}
        <div className="flex items-center justify-between" data-id="t5wmmbs16" data-path="src/pages/admin/CreateExam.tsx">
          <div className="flex items-center space-x-4" data-id="44az7eczn" data-path="src/pages/admin/CreateExam.tsx">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')} data-id="2jk7l66lz" data-path="src/pages/admin/CreateExam.tsx">

              <ArrowLeft className="w-4 h-4 mr-2" data-id="7i4f3ai0x" data-path="src/pages/admin/CreateExam.tsx" />
              Back to Dashboard
            </Button>
            <div data-id="ifgqc0d5g" data-path="src/pages/admin/CreateExam.tsx">
              <h1 className="text-3xl font-bold text-gray-900" data-id="lcdjzfakg" data-path="src/pages/admin/CreateExam.tsx">Create New Exam</h1>
              <p className="text-gray-600" data-id="d599mqaph" data-path="src/pages/admin/CreateExam.tsx">Set up a multi-section exam with questions</p>
            </div>
          </div>
          <div className="text-right" data-id="u19ej8src" data-path="src/pages/admin/CreateExam.tsx">
            <p className="text-sm text-gray-600" data-id="wcjscb4vz" data-path="src/pages/admin/CreateExam.tsx">Total Questions</p>
            <p className="text-2xl font-bold text-blue-600" data-id="mkcxd3lmv" data-path="src/pages/admin/CreateExam.tsx">{totalQuestions}</p>
          </div>
        </div>

        {/* Validation Errors */}
        {errors.length > 0 &&
        <Alert variant="destructive" data-id="82aftoi3a" data-path="src/pages/admin/CreateExam.tsx">
            <AlertDescription data-id="h8reynnvt" data-path="src/pages/admin/CreateExam.tsx">
              <ul className="list-disc list-inside space-y-1" data-id="q0ear60jq" data-path="src/pages/admin/CreateExam.tsx">
                {errors.map((error, index) =>
              <li key={index} data-id="r07qwzpwi" data-path="src/pages/admin/CreateExam.tsx">{error}</li>
              )}
              </ul>
            </AlertDescription>
          </Alert>
        }

        <div className="grid lg:grid-cols-4 gap-6" data-id="1lqxwhyn7" data-path="src/pages/admin/CreateExam.tsx">
          {/* Exam Details */}
          <div className="lg:col-span-1 space-y-6" data-id="8aeu6pf42" data-path="src/pages/admin/CreateExam.tsx">
            <Card data-id="xe9gjy8oc" data-path="src/pages/admin/CreateExam.tsx">
              <CardHeader data-id="pmqrh5rh4" data-path="src/pages/admin/CreateExam.tsx">
                <CardTitle data-id="je2n5pdwz" data-path="src/pages/admin/CreateExam.tsx">Exam Details</CardTitle>
                <CardDescription data-id="brqg2hw0y" data-path="src/pages/admin/CreateExam.tsx">Basic exam information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" data-id="uurx949my" data-path="src/pages/admin/CreateExam.tsx">
                <div className="space-y-2" data-id="gnmbvppge" data-path="src/pages/admin/CreateExam.tsx">
                  <Label htmlFor="title" data-id="s9xu8a0ku" data-path="src/pages/admin/CreateExam.tsx">Exam Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter exam title"
                    value={examData.title}
                    onChange={(e) => handleExamDataChange('title', e.target.value)} data-id="5tgaohonk" data-path="src/pages/admin/CreateExam.tsx" />

                </div>

                <div className="space-y-2" data-id="939mauq1d" data-path="src/pages/admin/CreateExam.tsx">
                  <Label htmlFor="description" data-id="sug7nsvb1" data-path="src/pages/admin/CreateExam.tsx">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter exam description"
                    value={examData.description}
                    onChange={(e) => handleExamDataChange('description', e.target.value)} data-id="g8mqddmag" data-path="src/pages/admin/CreateExam.tsx" />

                </div>

                <div className="space-y-2" data-id="xq18g9z6k" data-path="src/pages/admin/CreateExam.tsx">
                  <Label htmlFor="timeLimit" data-id="bsie2xt2w" data-path="src/pages/admin/CreateExam.tsx">Time Limit (minutes) *</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="1"
                    value={examData.timeLimit}
                    onChange={(e) => handleExamDataChange('timeLimit', parseInt(e.target.value) || 0)} data-id="esev0ccmd" data-path="src/pages/admin/CreateExam.tsx" />

                </div>

                <div className="space-y-2" data-id="nbuhr3ace" data-path="src/pages/admin/CreateExam.tsx">
                  <Label htmlFor="password" data-id="co552oum0" data-path="src/pages/admin/CreateExam.tsx">Access Password *</Label>
                  <Input
                    id="password"
                    type="text"
                    placeholder="Enter access password"
                    value={examData.password}
                    onChange={(e) => handleExamDataChange('password', e.target.value)} data-id="fjtvmsbeh" data-path="src/pages/admin/CreateExam.tsx" />

                </div>

                <div className="space-y-4" data-id="7mwm1fpxt" data-path="src/pages/admin/CreateExam.tsx">
                  <div className="flex items-center justify-between" data-id="rwnluvpq2" data-path="src/pages/admin/CreateExam.tsx">
                    <Label htmlFor="allowBreaks" data-id="yajndgbiv" data-path="src/pages/admin/CreateExam.tsx">Allow Breaks</Label>
                    <Switch
                      id="allowBreaks"
                      checked={examData.allowBreaks}
                      onCheckedChange={(checked) => handleExamDataChange('allowBreaks', checked)} data-id="34gc7dfvd" data-path="src/pages/admin/CreateExam.tsx" />

                  </div>

                  {examData.allowBreaks &&
                  <div className="space-y-2" data-id="42d5jh471" data-path="src/pages/admin/CreateExam.tsx">
                      <Label htmlFor="breakTimeLimit" data-id="jzpvqjrma" data-path="src/pages/admin/CreateExam.tsx">Max Break Time (minutes)</Label>
                      <Input
                      id="breakTimeLimit"
                      type="number"
                      min="1"
                      value={Math.floor(examData.breakTimeLimit / 60)}
                      onChange={(e) => handleExamDataChange('breakTimeLimit', (parseInt(e.target.value) || 0) * 60)} data-id="vno5do3y4" data-path="src/pages/admin/CreateExam.tsx" />

                    </div>
                  }
                </div>
              </CardContent>
            </Card>

            {/* Sections Overview */}
            <Card data-id="n83fav8jc" data-path="src/pages/admin/CreateExam.tsx">
              <CardHeader data-id="bdkw40iip" data-path="src/pages/admin/CreateExam.tsx">
                <CardTitle className="flex items-center justify-between" data-id="uuwma25e4" data-path="src/pages/admin/CreateExam.tsx">
                  Sections
                  <Button size="sm" onClick={addSection} data-id="ada6znfs6" data-path="src/pages/admin/CreateExam.tsx">
                    <Plus className="h-4 w-4" data-id="qrl2c1n00" data-path="src/pages/admin/CreateExam.tsx" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2" data-id="tiuptyzxv" data-path="src/pages/admin/CreateExam.tsx">
                {sections.map((section, index) =>
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  index === currentSection ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`
                  }
                  onClick={() => setCurrentSection(index)} data-id="ieughi814" data-path="src/pages/admin/CreateExam.tsx">

                    <div className="flex items-center justify-between" data-id="svglbzttq" data-path="src/pages/admin/CreateExam.tsx">
                      <div data-id="lgboao8yj" data-path="src/pages/admin/CreateExam.tsx">
                        <p className="font-medium text-sm" data-id="cnt1ikp4u" data-path="src/pages/admin/CreateExam.tsx">{section.title}</p>
                        <p className="text-xs text-gray-600" data-id="nkpa870rv" data-path="src/pages/admin/CreateExam.tsx">{section.questions.length} questions</p>
                      </div>
                      {sections.length > 1 &&
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSection(index);
                      }} data-id="ayc0y3c7y" data-path="src/pages/admin/CreateExam.tsx">

                          <Trash2 className="h-4 w-4" data-id="zmojjtbld" data-path="src/pages/admin/CreateExam.tsx" />
                        </Button>
                    }
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3" data-id="ffv3htfgd" data-path="src/pages/admin/CreateExam.tsx">
            <Card data-id="az7tvhbg7" data-path="src/pages/admin/CreateExam.tsx">
              <CardHeader data-id="wkyybglxu" data-path="src/pages/admin/CreateExam.tsx">
                <div className="flex items-center justify-between" data-id="nifi29oqq" data-path="src/pages/admin/CreateExam.tsx">
                  <div data-id="x3kia9zt4" data-path="src/pages/admin/CreateExam.tsx">
                    <CardTitle data-id="u20lj8u6r" data-path="src/pages/admin/CreateExam.tsx">
                      {sections[currentSection]?.title || 'Section'}
                    </CardTitle>
                    <CardDescription data-id="cuhvbndrk" data-path="src/pages/admin/CreateExam.tsx">
                      Manage questions for this section
                    </CardDescription>
                  </div>
                  <Dialog open={showQuestionBank} onOpenChange={setShowQuestionBank} data-id="9m8dgfama" data-path="src/pages/admin/CreateExam.tsx">
                    <DialogTrigger asChild data-id="05g4l4t6o" data-path="src/pages/admin/CreateExam.tsx">
                        <div className="flex gap-2">
                        <Button variant="outline" data-id="k5z4c4peq" data-path="src/pages/admin/CreateExam.tsx">
                          <Database className="h-4 w-4 mr-2" data-id="6f3cbmjot" data-path="src/pages/admin/CreateExam.tsx" />
                          Question Bank
                        </Button>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[80vh]" data-id="w582swa9h" data-path="src/pages/admin/CreateExam.tsx">
                      <DialogHeader data-id="xkeqlhzkj" data-path="src/pages/admin/CreateExam.tsx">
                        <DialogTitle data-id="4alwm0vm0" data-path="src/pages/admin/CreateExam.tsx">Select Questions from Bank</DialogTitle>
                      </DialogHeader>
                      <div className="overflow-y-auto" data-id="op3wpk2jv" data-path="src/pages/admin/CreateExam.tsx">
                        <QuestionBank
                          isSelectionMode={true}
                          onSelectQuestions={handleQuestionsFromBank} data-id="m47evdgzq" data-path="src/pages/admin/CreateExam.tsx" />

                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-6" data-id="n02540ssi" data-path="src/pages/admin/CreateExam.tsx">
                {/* Section Details */}
                <div className="grid grid-cols-2 gap-4" data-id="t7l34da4p" data-path="src/pages/admin/CreateExam.tsx">
                  <div className="space-y-2" data-id="woj9a05cp" data-path="src/pages/admin/CreateExam.tsx">
                    <Label data-id="6wnj2y1uo" data-path="src/pages/admin/CreateExam.tsx">Section Title *</Label>
                    <Input
                      value={sections[currentSection]?.title || ''}
                      onChange={(e) => handleSectionChange(currentSection, 'title', e.target.value)}
                      placeholder="Enter section title" data-id="p2of5k1a0" data-path="src/pages/admin/CreateExam.tsx" />

                  </div>
                  <div className="space-y-2" data-id="0ki12ltze" data-path="src/pages/admin/CreateExam.tsx">
                    <Label data-id="qtr6of6yd" data-path="src/pages/admin/CreateExam.tsx">Section Description</Label>
                    <Input
                      value={sections[currentSection]?.description || ''}
                      onChange={(e) => handleSectionChange(currentSection, 'description', e.target.value)}
                      placeholder="Enter section description" data-id="6wuggd7b5" data-path="src/pages/admin/CreateExam.tsx" />

                  </div>
                </div>

                <Separator data-id="qdldhlvq9" data-path="src/pages/admin/CreateExam.tsx" />

                <Tabs defaultValue="add-question" data-id="enu74u3ft" data-path="src/pages/admin/CreateExam.tsx">
                  <TabsList className="grid w-full grid-cols-2" data-id="mhg9uwq6m" data-path="src/pages/admin/CreateExam.tsx">
                    <TabsTrigger value="add-question" data-id="q3w3izayv" data-path="src/pages/admin/CreateExam.tsx">Add Question</TabsTrigger>
                    <TabsTrigger value="manage-questions" data-id="tq26bumrp" data-path="src/pages/admin/CreateExam.tsx">Manage Questions ({sections[currentSection]?.questions.length || 0})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="add-question" className="space-y-4" data-id="fydhsurg0" data-path="src/pages/admin/CreateExam.tsx">
                    <div className="space-y-4 p-4 border rounded-lg" data-id="t9dz21dv8" data-path="src/pages/admin/CreateExam.tsx">
                      <div className="space-y-2" data-id="0rz3mcevb" data-path="src/pages/admin/CreateExam.tsx">
                        <Label data-id="14nhe8vrf" data-path="src/pages/admin/CreateExam.tsx">Question Text *</Label>
                        <Textarea
                          placeholder="Enter your question here..."
                          value={newQuestion.text}
                          onChange={(e) => handleQuestionChange('text', e.target.value)} data-id="rixou8uvi" data-path="src/pages/admin/CreateExam.tsx" />

                      </div>

                      <div className="grid grid-cols-3 gap-4" data-id="hgvakuyhd" data-path="src/pages/admin/CreateExam.tsx">
                        <div className="space-y-2" data-id="vjrr2a7x4" data-path="src/pages/admin/CreateExam.tsx">
                          <Label data-id="4nfui04p9" data-path="src/pages/admin/CreateExam.tsx">Subject</Label>
                          <Input
                            placeholder="Enter subject"
                            value={newQuestion.subject}
                            onChange={(e) => handleQuestionChange('subject', e.target.value)} data-id="gswlr06ym" data-path="src/pages/admin/CreateExam.tsx" />

                        </div>
                        <div className="space-y-2" data-id="yynykamq7" data-path="src/pages/admin/CreateExam.tsx">
                          <Label data-id="ahnkkzc32" data-path="src/pages/admin/CreateExam.tsx">Topic</Label>
                          <Input
                            placeholder="Enter topic"
                            value={newQuestion.topic}
                            onChange={(e) => handleQuestionChange('topic', e.target.value)} data-id="4vf5xiu2g" data-path="src/pages/admin/CreateExam.tsx" />

                        </div>
                        <div className="space-y-2" data-id="2weo4251t" data-path="src/pages/admin/CreateExam.tsx">
                          <Label data-id="m5bclbgyv" data-path="src/pages/admin/CreateExam.tsx">Difficulty</Label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={newQuestion.difficulty}
                            onChange={(e) => handleQuestionChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')} data-id="6gojn8zqc" data-path="src/pages/admin/CreateExam.tsx">

                            <option value="easy" data-id="sfmf5k3q5" data-path="src/pages/admin/CreateExam.tsx">Easy</option>
                            <option value="medium" data-id="fcz70f5r8" data-path="src/pages/admin/CreateExam.tsx">Medium</option>
                            <option value="hard" data-id="7ayohwllp" data-path="src/pages/admin/CreateExam.tsx">Hard</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3" data-id="cxfy5lctf" data-path="src/pages/admin/CreateExam.tsx">
                        <Label data-id="w8kmr3wur" data-path="src/pages/admin/CreateExam.tsx">Options *</Label>
                        <RadioGroup
                          value={newQuestion.correctAnswer.toString()}
                          onValueChange={(value) => handleQuestionChange('correctAnswer', parseInt(value))} data-id="06f5j9rg1" data-path="src/pages/admin/CreateExam.tsx">

                          {newQuestion.options.map((option, optionIndex) =>
                          <div key={optionIndex} className="flex items-center space-x-2" data-id="91a7ek4q2" data-path="src/pages/admin/CreateExam.tsx">
                              <RadioGroupItem
                              value={optionIndex.toString()}
                              id={`option${optionIndex}`} data-id="vc0fkle5i" data-path="src/pages/admin/CreateExam.tsx" />

                              <Input
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                              className="flex-1" data-id="gz9poum3r" data-path="src/pages/admin/CreateExam.tsx" />

                              <Label htmlFor={`option${optionIndex}`} className="text-sm text-gray-500 min-w-fit" data-id="qz0ayxzmt" data-path="src/pages/admin/CreateExam.tsx">
                                {optionIndex === newQuestion.correctAnswer ? '(Correct)' : ''}
                              </Label>
                            </div>
                          )}
                        </RadioGroup>
                      </div>

                      <div className="flex justify-end space-x-2" data-id="jjieswx83" data-path="src/pages/admin/CreateExam.tsx">
                        {editingQuestion !== null &&
                        <Button variant="outline" onClick={resetQuestionForm} data-id="s9xiqhmop" data-path="src/pages/admin/CreateExam.tsx">
                            Cancel
                          </Button>
                        }
                        <Button onClick={addQuestionToSection} data-id="ukz08rh5s" data-path="src/pages/admin/CreateExam.tsx">
                          {editingQuestion !== null ? 'Update Question' : 'Add Question'}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="manage-questions" className="space-y-4" data-id="aaujckfhi" data-path="src/pages/admin/CreateExam.tsx">
                    {sections[currentSection]?.questions.length === 0 ?
                    <div className="text-center py-8 text-gray-500" data-id="rkxhnri5j" data-path="src/pages/admin/CreateExam.tsx">
                        No questions added yet. Use the "Add Question" tab or Question Bank to add questions.
                      </div> :

                    <div className="space-y-4" data-id="ctiokzapy" data-path="src/pages/admin/CreateExam.tsx">
                        {sections[currentSection]?.questions.map((question, questionIndex) =>
                      <Card key={questionIndex} data-id="298fw259m" data-path="src/pages/admin/CreateExam.tsx">
                            <CardContent className="p-4" data-id="ehs7pze6h" data-path="src/pages/admin/CreateExam.tsx">
                              <div className="flex items-start justify-between" data-id="oyb8udh06" data-path="src/pages/admin/CreateExam.tsx">
                                <div className="flex-1" data-id="73lrehor5" data-path="src/pages/admin/CreateExam.tsx">
                                  <h4 className="font-medium mb-2" data-id="nc0jwkgle" data-path="src/pages/admin/CreateExam.tsx">Question {questionIndex + 1}</h4>
                                  <p className="text-sm text-gray-700 mb-3" data-id="a1bh42hbj" data-path="src/pages/admin/CreateExam.tsx">{question.text}</p>
                                  
                                  <div className="grid grid-cols-2 gap-2 mb-3" data-id="2d95t3im5" data-path="src/pages/admin/CreateExam.tsx">
                                    {question.options.map((option, optionIndex) =>
                                <div
                                  key={optionIndex}
                                  className={`p-2 rounded border text-sm ${
                                  optionIndex === question.correctAnswer ?
                                  'bg-green-50 border-green-200' :
                                  'bg-gray-50'}`
                                  } data-id="a1o92y6zz" data-path="src/pages/admin/CreateExam.tsx">

                                        {String.fromCharCode(65 + optionIndex)}. {option}
                                        {optionIndex === question.correctAnswer &&
                                  <span className="text-green-600 ml-2" data-id="lkh1jz0ew" data-path="src/pages/admin/CreateExam.tsx">✓</span>
                                  }
                                      </div>
                                )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2" data-id="s7d608gdc" data-path="src/pages/admin/CreateExam.tsx">
                                    {question.subject && <Badge variant="secondary" data-id="k8k3xf2af" data-path="src/pages/admin/CreateExam.tsx">{question.subject}</Badge>}
                                    {question.topic && <Badge variant="outline" data-id="emkyyh853" data-path="src/pages/admin/CreateExam.tsx">{question.topic}</Badge>}
                                    {question.difficulty &&
                                <Badge variant={question.difficulty === 'easy' ? 'default' : question.difficulty === 'medium' ? 'secondary' : 'destructive'} data-id="nng4ujeat" data-path="src/pages/admin/CreateExam.tsx">
                                        {question.difficulty}
                                      </Badge>
                                }
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2" data-id="4z2w57bse" data-path="src/pages/admin/CreateExam.tsx">
                                  <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editQuestion(questionIndex)} data-id="djgcb4igv" data-path="src/pages/admin/CreateExam.tsx">

                                    <Edit className="h-4 w-4" data-id="o8piumczf" data-path="src/pages/admin/CreateExam.tsx" />
                                  </Button>
                                  <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => duplicateQuestion(questionIndex)} data-id="9ppdoihps" data-path="src/pages/admin/CreateExam.tsx">

                                    <Copy className="h-4 w-4" data-id="a3msgw4n4" data-path="src/pages/admin/CreateExam.tsx" />
                                  </Button>
                                  <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeQuestion(questionIndex)} data-id="mpdwxarcd" data-path="src/pages/admin/CreateExam.tsx">

                                    <Trash2 className="h-4 w-4" data-id="xx52lesft" data-path="src/pages/admin/CreateExam.tsx" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                      )}
                      </div>
                    }
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4" data-id="95py6bwvi" data-path="src/pages/admin/CreateExam.tsx">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            disabled={isSubmitting} data-id="ulle43rwb" data-path="src/pages/admin/CreateExam.tsx">

            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting} data-id="ib8w26od7" data-path="src/pages/admin/CreateExam.tsx">

            {isSubmitting ? <LoadingSpinner size="sm" data-id="wu8u9edza" data-path="src/pages/admin/CreateExam.tsx" /> :
            <>
                <Save className="w-4 h-4 mr-2" data-id="48n90o5xt" data-path="src/pages/admin/CreateExam.tsx" />
                Save as Draft
              </>
            }
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting} data-id="fqgsxtmkc" data-path="src/pages/admin/CreateExam.tsx">

            {isSubmitting ? <LoadingSpinner size="sm" data-id="v4d7en831" data-path="src/pages/admin/CreateExam.tsx" /> :
            <>
                <Upload className="w-4 h-4 mr-2" data-id="b01zq0k5y" data-path="src/pages/admin/CreateExam.tsx" />
                Publish Exam
              </>
            }
          </Button>
        </div>
      </div>
    </Layout>);

};

export default CreateExam;