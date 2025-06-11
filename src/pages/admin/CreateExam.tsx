import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examService } from '@/services/examService';
import { CreateExamData, Question } from '@/types';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, Save, ArrowLeft, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuestionForm extends Omit<Question, 'id'> {}

const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [examData, setExamData] = useState({
    title: '',
    timeLimit: 30,
    password: ''
  });

  const [questions, setQuestions] = useState<QuestionForm[]>([
  {
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  }]
  );

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleExamDataChange = (field: string, value: string | number) => {
    setExamData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (questionIndex: number, field: string, value: string | number) => {
    setQuestions((prev) => prev.map((question, index) =>
    index === questionIndex ?
    { ...question, [field]: value } :
    question
    ));
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions((prev) => prev.map((question, index) =>
    index === questionIndex ?
    {
      ...question,
      options: question.options.map((option, oIndex) =>
      oIndex === optionIndex ? value : option
      )
    } :
    question
    ));
  };

  const addQuestion = () => {
    setQuestions((prev) => [
    ...prev,
    {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }]
    );
  };

  const removeQuestion = (questionIndex: number) => {
    if (questions.length > 1) {
      setQuestions((prev) => prev.filter((_, index) => index !== questionIndex));
    }
  };

  const handleQuestionsExtracted = (extractedQuestions: any[]) => {
    console.log('Extracted questions:', extractedQuestions);

    const formattedQuestions: QuestionForm[] = extractedQuestions.map((q) => {
      if (q.type === 'multiple-choice') {
        // Find the correct answer index
        const correctIndex = q.options.findIndex((option: string) =>
        option === q.correctAnswer || option.includes(q.correctAnswer)
        );

        return {
          text: q.question,
          options: q.options.length >= 4 ? q.options.slice(0, 4) : [...q.options, ...Array(4 - q.options.length).fill('')],
          correctAnswer: correctIndex >= 0 ? correctIndex : 0
        };
      } else {
        // For text questions, convert to multiple choice with empty options
        return {
          text: q.question,
          options: ['', '', '', ''],
          correctAnswer: 0
        };
      }
    });

    setQuestions(formattedQuestions);
    setShowFileUpload(false);

    toast({
      title: "Questions imported successfully",
      description: `${extractedQuestions.length} questions have been added. You can now edit them.`
    });
  };

  const validateForm = (): string[] => {
    const validationErrors: string[] = [];

    // Validate exam data
    if (!examData.title.trim()) {
      validationErrors.push('Exam title is required');
    }
    if (examData.timeLimit < 1) {
      validationErrors.push('Time limit must be at least 1 minute');
    }
    // if (!examData.password.trim()) {
    //   validationErrors.push('Exam password is required');
    // }

    // Validate questions
    questions.forEach((question, qIndex) => {
      if (!question.text.trim()) {
        validationErrors.push(`Question ${qIndex + 1}: Question text is required`);
      }

      const emptyOptions = question.options.filter((option) => !option.trim()).length;
      if (emptyOptions > 0) {
        validationErrors.push(`Question ${qIndex + 1}: All options must be filled`);
      }

      if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
        validationErrors.push(`Question ${qIndex + 1}: Valid correct answer must be selected`);
      }
    });

    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        timeLimit: examData.timeLimit,
        password: examData.password,
        questions: questions
      };

      const newExam = await examService.createExam(createData);

      toast({
        title: "Exam created successfully!",
        description: `"${newExam.title}" has been created as a draft.`
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

  if (showFileUpload) {
    return (
      <Layout data-id="hoc39t4gk" data-path="src/pages/admin/CreateExam.tsx">
        <div className="max-w-4xl mx-auto space-y-6" data-id="h2w28x66z" data-path="src/pages/admin/CreateExam.tsx">
          <div className="flex items-center space-x-4" data-id="vntyi619j" data-path="src/pages/admin/CreateExam.tsx">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFileUpload(false)} data-id="17w9h6y4q" data-path="src/pages/admin/CreateExam.tsx">
              <ArrowLeft className="w-4 h-4 mr-2" data-id="s260fbrbj" data-path="src/pages/admin/CreateExam.tsx" />
              Back to Manual Entry
            </Button>
            <div data-id="5i1ya6olu" data-path="src/pages/admin/CreateExam.tsx">
              <h1 className="text-3xl font-bold text-gray-900" data-id="ncl1k7nm3" data-path="src/pages/admin/CreateExam.tsx">Import Questions from File</h1>
              <p className="text-gray-600" data-id="37z4udy4r" data-path="src/pages/admin/CreateExam.tsx">Upload a PDF or Word document to automatically extract questions</p>
            </div>
          </div>
          
          <FileUpload
            onQuestionsExtracted={handleQuestionsExtracted}
            onClose={() => setShowFileUpload(false)} data-id="sd4tbc71z" data-path="src/pages/admin/CreateExam.tsx" 
          />

        </div>
      </Layout>);

  }

  return (
    <Layout data-id="a584kumxh" data-path="src/pages/admin/CreateExam.tsx">
      <div className="space-y-6" data-id="ujrg81hwv" data-path="src/pages/admin/CreateExam.tsx">
        {/* Header */}
        <div className="flex items-center space-x-4" data-id="8lxqs15ly" data-path="src/pages/admin/CreateExam.tsx">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin')} data-id="fqx2zo963" data-path="src/pages/admin/CreateExam.tsx">

            <ArrowLeft className="w-4 h-4 mr-2" data-id="9nzv3d7ax" data-path="src/pages/admin/CreateExam.tsx" />
            Back to Dashboard
          </Button>
          <div data-id="pki11np02" data-path="src/pages/admin/CreateExam.tsx">
            <h1 className="text-3xl font-bold text-gray-900" data-id="nu9n82cut" data-path="src/pages/admin/CreateExam.tsx">Create New Exam</h1>
            <p className="text-gray-600" data-id="32d5qckx2" data-path="src/pages/admin/CreateExam.tsx">Set up a new exam with questions and options</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" data-id="cs53zdn2i" data-path="src/pages/admin/CreateExam.tsx">
          {/* Validation Errors */}
          {errors.length > 0 &&
          <Alert variant="destructive" data-id="0nip1d3i5" data-path="src/pages/admin/CreateExam.tsx">
              <AlertDescription data-id="yd6lrbsl1" data-path="src/pages/admin/CreateExam.tsx">
                <ul className="list-disc list-inside space-y-1" data-id="4e0xktmuj" data-path="src/pages/admin/CreateExam.tsx">
                  {errors.map((error, index) =>
                <li key={index} data-id="pkrjdrfl0" data-path="src/pages/admin/CreateExam.tsx">{error}</li>
                )}
                </ul>
              </AlertDescription>
            </Alert>
          }

          {/* Exam Details */}
          <Card data-id="nctguwe9r" data-path="src/pages/admin/CreateExam.tsx">
            <CardHeader data-id="9j3ylgtxe" data-path="src/pages/admin/CreateExam.tsx">
              <CardTitle data-id="qj3wdmzlw" data-path="src/pages/admin/CreateExam.tsx">Exam Details</CardTitle>
              <CardDescription data-id="snhvt4tfu" data-path="src/pages/admin/CreateExam.tsx">
                Basic information about the exam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" data-id="wo2379guv" data-path="src/pages/admin/CreateExam.tsx">
              <div className="grid gap-4 md:grid-cols-2" data-id="dwq3kp80w" data-path="src/pages/admin/CreateExam.tsx">
                <div className="space-y-2" data-id="z8ufsmdg9" data-path="src/pages/admin/CreateExam.tsx">
                  <Label htmlFor="title" data-id="7w64ayuoq" data-path="src/pages/admin/CreateExam.tsx">Exam Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter exam title"
                    value={examData.title}
                    onChange={(e) => handleExamDataChange('title', e.target.value)}
                    required data-id="uj2kkcut1" data-path="src/pages/admin/CreateExam.tsx" />

                </div>
                <div className="space-y-2" data-id="jfr64uwqg" data-path="src/pages/admin/CreateExam.tsx">
                  <Label htmlFor="timeLimit" data-id="dsxn0rtvp" data-path="src/pages/admin/CreateExam.tsx">Time Limit (minutes) *</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="1"
                    placeholder="30"
                    value={examData.timeLimit}
                    onChange={(e) => handleExamDataChange('timeLimit', parseInt(e.target.value) || 0)}
                    required data-id="scbg95ffn" data-path="src/pages/admin/CreateExam.tsx" />

                </div>
              </div>
              <div className="space-y-2" data-id="g7i9wd9da" data-path="src/pages/admin/CreateExam.tsx">
                <Label htmlFor="password" data-id="ylxfgw4k3" data-path="src/pages/admin/CreateExam.tsx">Access Password</Label>
                <Input
                  id="password"
                  type="text"
                  placeholder="Enter exam access password"
                  value={examData.password}
                  onChange={(e) => handleExamDataChange('password', e.target.value)}
                  // required data-id="o4y6lrzkc" data-path="src/pages/admin/CreateExam.tsx" 
                  />

                <p className="text-sm text-gray-500" data-id="vfyibfpp1" data-path="src/pages/admin/CreateExam.tsx">
                  Students will need this password to start the exam. Leave it blank to allow open access.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Questions Section */}
          <Card data-id="zrr8npknm" data-path="src/pages/admin/CreateExam.tsx">
            <CardHeader data-id="0emr0jyi1" data-path="src/pages/admin/CreateExam.tsx">
              <div className="flex justify-between items-center" data-id="0l8r8uv8p" data-path="src/pages/admin/CreateExam.tsx">
                <div data-id="3uvq8a5cj" data-path="src/pages/admin/CreateExam.tsx">
                  <CardTitle data-id="h8unsnxat" data-path="src/pages/admin/CreateExam.tsx">Questions</CardTitle>
                  <CardDescription data-id="yfqm2twcs" data-path="src/pages/admin/CreateExam.tsx">
                    Add questions manually or import from a file
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFileUpload(true)}
                  className="flex items-center gap-2" data-id="kndpfy87z" data-path="src/pages/admin/CreateExam.tsx">
                  <Upload className="w-4 h-4" data-id="gx4mlr3yl" data-path="src/pages/admin/CreateExam.tsx" />
                  Import from File
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6" data-id="mm9facsqb" data-path="src/pages/admin/CreateExam.tsx">
              {questions.map((question, questionIndex) =>
              <div key={questionIndex} className="space-y-4 p-4 border rounded-lg" data-id="6hmp3hp1j" data-path="src/pages/admin/CreateExam.tsx">
                  <div className="flex justify-between items-center" data-id="l5oqlk8nb" data-path="src/pages/admin/CreateExam.tsx">
                    <h3 className="text-lg font-semibold" data-id="1k7ewbnnt" data-path="src/pages/admin/CreateExam.tsx">Question {questionIndex + 1}</h3>
                    {questions.length > 1 &&
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeQuestion(questionIndex)} data-id="48lurtdu3" data-path="src/pages/admin/CreateExam.tsx">

                        <Trash2 className="w-4 h-4" data-id="2lcy9sykq" data-path="src/pages/admin/CreateExam.tsx" />
                      </Button>
                  }
                  </div>

                  <div className="space-y-2" data-id="e29wbg2s7" data-path="src/pages/admin/CreateExam.tsx">
                    <Label htmlFor={`question-${questionIndex}`} data-id="rtdsag897" data-path="src/pages/admin/CreateExam.tsx">Question Text *</Label>
                    <Textarea
                    id={`question-${questionIndex}`}
                    placeholder="Enter your question here..."
                    value={question.text}
                    onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                    required data-id="wqwfafg19" data-path="src/pages/admin/CreateExam.tsx" />

                  </div>

                  <div className="space-y-3" data-id="f4yifq3m9" data-path="src/pages/admin/CreateExam.tsx">
                    <Label data-id="w8i07rvgw" data-path="src/pages/admin/CreateExam.tsx">Options *</Label>
                    <RadioGroup
                    value={question.correctAnswer.toString()}
                    onValueChange={(value) =>
                    handleQuestionChange(questionIndex, 'correctAnswer', parseInt(value))
                    } data-id="4jl89db88" data-path="src/pages/admin/CreateExam.tsx">

                      {question.options.map((option, optionIndex) =>
                    <div key={optionIndex} className="flex items-center space-x-2" data-id="163ew3fpp" data-path="src/pages/admin/CreateExam.tsx">
                          <RadioGroupItem
                        value={optionIndex.toString()}
                        id={`q${questionIndex}-option${optionIndex}`} data-id="t84kwldad" data-path="src/pages/admin/CreateExam.tsx" />

                          <Input
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                        handleOptionChange(questionIndex, optionIndex, e.target.value)
                        }
                        className="flex-1"
                        required data-id="w12l3tmmp" data-path="src/pages/admin/CreateExam.tsx" />

                          <Label
                        htmlFor={`q${questionIndex}-option${optionIndex}`}
                        className="text-sm text-gray-500 min-w-fit" data-id="w4wuvlohc" data-path="src/pages/admin/CreateExam.tsx">

                            {optionIndex === question.correctAnswer ? '(Correct)' : ''}
                          </Label>
                        </div>
                    )}
                    </RadioGroup>
                    <p className="text-sm text-gray-500" data-id="fjp999q5q" data-path="src/pages/admin/CreateExam.tsx">
                      Select the radio button next to the correct answer
                    </p>
                  </div>

                  {questionIndex < questions.length - 1 &&
                <Separator className="mt-6" data-id="de2d0k4j9" data-path="src/pages/admin/CreateExam.tsx" />
                }
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={addQuestion}
                className="w-full" data-id="rp5bjtwuc" data-path="src/pages/admin/CreateExam.tsx">

                <Plus className="w-4 h-4 mr-2" data-id="sfaatw7o7" data-path="src/pages/admin/CreateExam.tsx" />
                Add Another Question
              </Button>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4" data-id="j35eqfslh" data-path="src/pages/admin/CreateExam.tsx">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
              disabled={isSubmitting} data-id="qf8ffsblx" data-path="src/pages/admin/CreateExam.tsx">

              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} data-id="zevyw94pv" data-path="src/pages/admin/CreateExam.tsx">
              {isSubmitting ?
              <LoadingSpinner size="sm" data-id="mxgq6kpst" data-path="src/pages/admin/CreateExam.tsx" /> :

              <>
                  <Save className="w-4 h-4 mr-2" data-id="jfe3vw0j6" data-path="src/pages/admin/CreateExam.tsx" />
                  Create Exam
                </>
              }
            </Button>
          </div>
        </form>
      </div>
    </Layout>);

};

export default CreateExam;