import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search, Plus, Filter, Upload, Download, Edit, Trash2, Eye, Copy } from 'lucide-react';
import { Question, QuestionBank as QuestionBankType, QuestionFilter } from '@/types';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';

interface QuestionBankProps {
  onSelectQuestions?: (questions: Question[]) => void;
  isSelectionMode?: boolean;
  selectedQuestions?: Question[];
}

const QuestionBank: React.FC<QuestionBankProps> = ({
  onSelectQuestions,
  isSelectionMode = false,
  selectedQuestions = []
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBankType[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [filter, setFilter] = useState<QuestionFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuestionsLocal, setSelectedQuestionsLocal] = useState<Question[]>(selectedQuestions);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // New question form state
  const [newQuestion, setNewQuestion] = useState<{
    text: string;
    options: string[];
    correctAnswer: number;
    subject: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
  }>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    subject: '',
    topic: '',
    difficulty: 'medium',
    tags: []
  });

  // Bulk create state
  const [bulkQuestions, setBulkQuestions] = useState<string>('');
  const [bulkSubject, setBulkSubject] = useState('');
  const [bulkTopic, setBulkTopic] = useState('');
  const [bulkDifficulty, setBulkDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const subjects = ['Math', 'Science', 'English', 'History', 'Geography', 'General Knowledge'];
  const difficulties = ['easy', 'medium', 'hard'];

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, filter, searchTerm]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      const mockQuestions: Question[] = [
      {
        id: '1',
        text: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
        subject: 'Math',
        topic: 'Basic Arithmetic',
        difficulty: 'easy',
        tags: ['addition', 'basic'],
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        text: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        subject: 'Geography',
        topic: 'European Capitals',
        difficulty: 'easy',
        tags: ['capitals', 'europe'],
        createdAt: new Date().toISOString()
      }];

      setQuestions(mockQuestions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = [...questions];

    if (filter.subject) {
      filtered = filtered.filter((q) => q.subject === filter.subject);
    }
    if (filter.topic) {
      filtered = filtered.filter((q) => q.topic === filter.topic);
    }
    if (filter.difficulty) {
      filtered = filtered.filter((q) => q.difficulty === filter.difficulty);
    }
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter((q) =>
      q.tags?.some((tag) => filter.tags?.includes(tag))
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((q) =>
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.options.some((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredQuestions(filtered);
  };

  const handleCreateQuestion = async () => {
    if (!newQuestion.text || !newQuestion.subject || newQuestion.options.some((opt) => !opt)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const question: Question = {
        id: Date.now().toString(),
        ...newQuestion,
        createdAt: new Date().toISOString()
      };

      setQuestions((prev) => [...prev, question]);
      setNewQuestion({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        subject: '',
        topic: '',
        difficulty: 'medium',
        tags: []
      });
      setShowCreateDialog(false);

      toast({
        title: "Success",
        description: "Question created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create question",
        variant: "destructive"
      });
    }
  };

  const handleBulkCreate = async () => {
    if (!bulkQuestions || !bulkSubject) {
      toast({
        title: "Error",
        description: "Please provide questions text and subject",
        variant: "destructive"
      });
      return;
    }

    try {
      // Parse bulk questions (simple format: Question? Option1|Option2|Option3|Option4|CorrectIndex)
      const lines = bulkQuestions.split('\n').filter((line) => line.trim());
      const newQuestions: Question[] = [];

      for (const line of lines) {
        const parts = line.split('|');
        if (parts.length >= 5) {
          const question: Question = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            text: parts[0].trim(),
            options: [parts[1].trim(), parts[2].trim(), parts[3].trim(), parts[4].trim()],
            correctAnswer: parseInt(parts[5]?.trim() || '0'),
            subject: bulkSubject,
            topic: bulkTopic,
            difficulty: bulkDifficulty,
            tags: [],
            createdAt: new Date().toISOString()
          };
          newQuestions.push(question);
        }
      }

      setQuestions((prev) => [...prev, ...newQuestions]);
      setBulkQuestions('');
      setShowBulkUpload(false);

      toast({
        title: "Success",
        description: `${newQuestions.length} questions created successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create bulk questions",
        variant: "destructive"
      });
    }
  };

  const handleSelectQuestion = (question: Question) => {
    if (isSelectionMode) {
      const isSelected = selectedQuestionsLocal.some((q) => q.id === question.id);
      let newSelected;

      if (isSelected) {
        newSelected = selectedQuestionsLocal.filter((q) => q.id !== question.id);
      } else {
        newSelected = [...selectedQuestionsLocal, question];
      }

      setSelectedQuestionsLocal(newSelected);
      onSelectQuestions?.(newSelected);
    }
  };

  const handleFileUpload = (file: File) => {
    // Handle file upload for bulk question import
    toast({
      title: "Info",
      description: "File upload functionality would be implemented here"
    });
  };

  return (
    <div className="space-y-6" data-id="p7qap6ywr" data-path="src/components/QuestionBank.tsx">
      <div className="flex items-center justify-between" data-id="ol4suc5nb" data-path="src/components/QuestionBank.tsx">
        <div data-id="g6mjq79n7" data-path="src/components/QuestionBank.tsx">
          <h2 className="text-2xl font-bold" data-id="4634c3swo" data-path="src/components/QuestionBank.tsx">Question Bank</h2>
          <p className="text-gray-600" data-id="xa4m1f89l" data-path="src/components/QuestionBank.tsx">Manage your question repository</p>
        </div>
        <div className="flex gap-2" data-id="kcmf66t17" data-path="src/components/QuestionBank.tsx">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog} data-id="wqcv5kjcu" data-path="src/components/QuestionBank.tsx">
            <DialogTrigger asChild data-id="8y4jx14tj" data-path="src/components/QuestionBank.tsx">
              <Button data-id="8u31c2us7" data-path="src/components/QuestionBank.tsx">
                <Plus className="h-4 w-4 mr-2" data-id="5n55klwls" data-path="src/components/QuestionBank.tsx" />
                Create Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" data-id="28slbh3qw" data-path="src/components/QuestionBank.tsx">
              <DialogHeader data-id="s6t60x8sl" data-path="src/components/QuestionBank.tsx">
                <DialogTitle data-id="glv57j8ck" data-path="src/components/QuestionBank.tsx">Create New Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4" data-id="2y46uh8cu" data-path="src/components/QuestionBank.tsx">
                <div data-id="a9i4qvxxc" data-path="src/components/QuestionBank.tsx">
                  <Label htmlFor="question-text" data-id="d1rfny2c8" data-path="src/components/QuestionBank.tsx">Question Text</Label>
                  <Textarea
                    id="question-text"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter your question here..."
                    className="mt-1" data-id="xsca4zzvr" data-path="src/components/QuestionBank.tsx" />

                </div>
                
                <div className="grid grid-cols-2 gap-4" data-id="2lpmxhhsy" data-path="src/components/QuestionBank.tsx">
                  <div data-id="k6t7opk4x" data-path="src/components/QuestionBank.tsx">
                    <Label data-id="51b569ygb" data-path="src/components/QuestionBank.tsx">Subject</Label>
                    <Select value={newQuestion.subject} onValueChange={(value) => setNewQuestion((prev) => ({ ...prev, subject: value }))} data-id="6arvkzijr" data-path="src/components/QuestionBank.tsx">
                      <SelectTrigger data-id="u85kk1sr9" data-path="src/components/QuestionBank.tsx">
                        <SelectValue placeholder="Select subject" data-id="550ltgkiu" data-path="src/components/QuestionBank.tsx" />
                      </SelectTrigger>
                      <SelectContent data-id="kouk8qtvo" data-path="src/components/QuestionBank.tsx">
                        {subjects.map((subject) =>
                        <SelectItem key={subject} value={subject} data-id="zid4vpqvx" data-path="src/components/QuestionBank.tsx">{subject}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div data-id="ro4izz04l" data-path="src/components/QuestionBank.tsx">
                    <Label data-id="7nus1aus6" data-path="src/components/QuestionBank.tsx">Topic</Label>
                    <Input
                      value={newQuestion.topic}
                      onChange={(e) => setNewQuestion((prev) => ({ ...prev, topic: e.target.value }))}
                      placeholder="Enter topic" data-id="way1btmdv" data-path="src/components/QuestionBank.tsx" />

                  </div>
                </div>

                <div data-id="fr5kjy7ef" data-path="src/components/QuestionBank.tsx">
                  <Label data-id="jjv5ompdq" data-path="src/components/QuestionBank.tsx">Difficulty</Label>
                  <Select value={newQuestion.difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setNewQuestion((prev) => ({ ...prev, difficulty: value }))} data-id="w3lddzj3k" data-path="src/components/QuestionBank.tsx">
                    <SelectTrigger data-id="s8051wo48" data-path="src/components/QuestionBank.tsx">
                      <SelectValue data-id="3k3hhg8s7" data-path="src/components/QuestionBank.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="285nxwnb6" data-path="src/components/QuestionBank.tsx">
                      {difficulties.map((diff) =>
                      <SelectItem key={diff} value={diff} data-id="xcnl10own" data-path="src/components/QuestionBank.tsx">{diff.charAt(0).toUpperCase() + diff.slice(1)}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div data-id="o1hbcrbbl" data-path="src/components/QuestionBank.tsx">
                  <Label data-id="sudkqew81" data-path="src/components/QuestionBank.tsx">Options</Label>
                  <div className="space-y-2" data-id="sfdl8hiff" data-path="src/components/QuestionBank.tsx">
                    {newQuestion.options.map((option, index) =>
                    <div key={index} className="flex items-center space-x-2" data-id="b5bkogvkb" data-path="src/components/QuestionBank.tsx">
                        <RadioGroup value={newQuestion.correctAnswer.toString()} onValueChange={(value) => setNewQuestion((prev) => ({ ...prev, correctAnswer: parseInt(value) }))} data-id="vqj2joszz" data-path="src/components/QuestionBank.tsx">
                          <div className="flex items-center space-x-2" data-id="k2twlv1n9" data-path="src/components/QuestionBank.tsx">
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} data-id="5fe8h0tjd" data-path="src/components/QuestionBank.tsx" />
                            <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options];
                              newOptions[index] = e.target.value;
                              setNewQuestion((prev) => ({ ...prev, options: newOptions }));
                            }}
                            placeholder={`Option ${index + 1}`} data-id="89sh7cidb" data-path="src/components/QuestionBank.tsx" />

                          </div>
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2" data-id="wepnt9bqy" data-path="src/components/QuestionBank.tsx">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)} data-id="g3rw7jdxq" data-path="src/components/QuestionBank.tsx">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateQuestion} data-id="f2cwkwidl" data-path="src/components/QuestionBank.tsx">
                    Create Question
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload} data-id="zpiena5es" data-path="src/components/QuestionBank.tsx">
            <DialogTrigger asChild data-id="4foix1ksg" data-path="src/components/QuestionBank.tsx">
              <Button variant="outline" data-id="r5jv55adj" data-path="src/components/QuestionBank.tsx">
                <Upload className="h-4 w-4 mr-2" data-id="edj1mpyzg" data-path="src/components/QuestionBank.tsx" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" data-id="ura8nau9d" data-path="src/components/QuestionBank.tsx">
              <DialogHeader data-id="nnegj87x1" data-path="src/components/QuestionBank.tsx">
                <DialogTitle data-id="nlf3dxino" data-path="src/components/QuestionBank.tsx">Bulk Create Questions</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="text" className="w-full" data-id="bi43lfvm7" data-path="src/components/QuestionBank.tsx">
                <TabsList className="grid w-full grid-cols-2" data-id="fodpah9qa" data-path="src/components/QuestionBank.tsx">
                  <TabsTrigger value="text" data-id="uu31tlckp" data-path="src/components/QuestionBank.tsx">Text Format</TabsTrigger>
                  <TabsTrigger value="file" data-id="kzwey3lrb" data-path="src/components/QuestionBank.tsx">File Upload</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4" data-id="y90jhbn2f" data-path="src/components/QuestionBank.tsx">
                  <div className="grid grid-cols-2 gap-4" data-id="1jdkmpdoz" data-path="src/components/QuestionBank.tsx">
                    <div data-id="uot0r59bf" data-path="src/components/QuestionBank.tsx">
                      <Label data-id="c1jkfdk4b" data-path="src/components/QuestionBank.tsx">Subject</Label>
                      <Select value={bulkSubject} onValueChange={setBulkSubject} data-id="31loj1w7y" data-path="src/components/QuestionBank.tsx">
                        <SelectTrigger data-id="yl9idoqmu" data-path="src/components/QuestionBank.tsx">
                          <SelectValue placeholder="Select subject" data-id="g1d5nywwa" data-path="src/components/QuestionBank.tsx" />
                        </SelectTrigger>
                        <SelectContent data-id="s42uu2fi6" data-path="src/components/QuestionBank.tsx">
                          {subjects.map((subject) =>
                          <SelectItem key={subject} value={subject} data-id="b0py3eo76" data-path="src/components/QuestionBank.tsx">{subject}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div data-id="7bn9bryd9" data-path="src/components/QuestionBank.tsx">
                      <Label data-id="9u7llyvwi" data-path="src/components/QuestionBank.tsx">Topic</Label>
                      <Input
                        value={bulkTopic}
                        onChange={(e) => setBulkTopic(e.target.value)}
                        placeholder="Enter topic" data-id="zcxil5ly9" data-path="src/components/QuestionBank.tsx" />

                    </div>
                  </div>

                  <div data-id="wq9ul002r" data-path="src/components/QuestionBank.tsx">
                    <Label data-id="qdgnzkzli" data-path="src/components/QuestionBank.tsx">Difficulty</Label>
                    <Select value={bulkDifficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setBulkDifficulty(value)} data-id="atnk6z7uf" data-path="src/components/QuestionBank.tsx">
                      <SelectTrigger data-id="tbd2onijp" data-path="src/components/QuestionBank.tsx">
                        <SelectValue data-id="nwzu6msog" data-path="src/components/QuestionBank.tsx" />
                      </SelectTrigger>
                      <SelectContent data-id="7jpwfxd01" data-path="src/components/QuestionBank.tsx">
                        {difficulties.map((diff) =>
                        <SelectItem key={diff} value={diff} data-id="q1tjtmjap" data-path="src/components/QuestionBank.tsx">{diff.charAt(0).toUpperCase() + diff.slice(1)}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div data-id="tk9oi65me" data-path="src/components/QuestionBank.tsx">
                    <Label data-id="54svzr3z2" data-path="src/components/QuestionBank.tsx">Questions</Label>
                    <Textarea
                      value={bulkQuestions}
                      onChange={(e) => setBulkQuestions(e.target.value)}
                      placeholder="Enter questions in format: Question?|Option1|Option2|Option3|Option4|CorrectAnswerIndex (each question on new line)"
                      className="h-32" data-id="q1cx0xwhz" data-path="src/components/QuestionBank.tsx" />

                  </div>

                  <Alert data-id="4i7o254uh" data-path="src/components/QuestionBank.tsx">
                    <AlertDescription data-id="ksy25wvjt" data-path="src/components/QuestionBank.tsx">
                      Format: Question?|Option1|Option2|Option3|Option4|CorrectAnswerIndex
                      <br data-id="d63xlsbuu" data-path="src/components/QuestionBank.tsx" />
                      Example: What is 2+2?|2|3|4|5|2
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end space-x-2" data-id="96644pcem" data-path="src/components/QuestionBank.tsx">
                    <Button variant="outline" onClick={() => setShowBulkUpload(false)} data-id="p47g8ob8x" data-path="src/components/QuestionBank.tsx">
                      Cancel
                    </Button>
                    <Button onClick={handleBulkCreate} data-id="ni5sx9dpq" data-path="src/components/QuestionBank.tsx">
                      Create Questions
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="file" className="space-y-4" data-id="3g0f2yda3" data-path="src/components/QuestionBank.tsx">
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    onQuestionsExtracted={(questions) => {
                      // You can handle extracted questions here, e.g., add to state or show a toast
                      toast({
                        title: "Questions Extracted",
                        description: `${questions.length} questions extracted from file.`,
                      });
                    }}
                    data-id="8axy9z155"
                    data-path="src/components/QuestionBank.tsx"
                  />
                  <Alert data-id="nie7wi6hp" data-path="src/components/QuestionBank.tsx">
                    <AlertDescription data-id="3nbm28yqp" data-path="src/components/QuestionBank.tsx">
                      Upload a CSV or Excel file with questions. The file should contain columns for: Question, Option1, Option2, Option3, Option4, CorrectAnswer, Subject, Topic, Difficulty.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card data-id="ouxydhsb0" data-path="src/components/QuestionBank.tsx">
        <CardHeader data-id="7qanpup6c" data-path="src/components/QuestionBank.tsx">
          <CardTitle className="flex items-center gap-2" data-id="rmfpuj29x" data-path="src/components/QuestionBank.tsx">
            <Filter className="h-5 w-5" data-id="j8ou7xb3b" data-path="src/components/QuestionBank.tsx" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="kpeljzbcv" data-path="src/components/QuestionBank.tsx">
          <div className="flex gap-4" data-id="vioqln5x4" data-path="src/components/QuestionBank.tsx">
            <div className="flex-1" data-id="ztw0ktyrf" data-path="src/components/QuestionBank.tsx">
              <Label data-id="1xwo00sbi" data-path="src/components/QuestionBank.tsx">Search</Label>
              <div className="relative" data-id="pnuyoq3v8" data-path="src/components/QuestionBank.tsx">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" data-id="flr9pbpr1" data-path="src/components/QuestionBank.tsx" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10" data-id="l21vxdgug" data-path="src/components/QuestionBank.tsx" />

              </div>
            </div>
            
            <div data-id="s82guuj8m" data-path="src/components/QuestionBank.tsx">
              <Label data-id="rnnc354uw" data-path="src/components/QuestionBank.tsx">Subject</Label>
              <Select value={filter.subject || ''} onValueChange={(value) => setFilter((prev) => ({ ...prev, subject: value || undefined }))} data-id="c1r1p2wba" data-path="src/components/QuestionBank.tsx">
                <SelectTrigger className="w-40" data-id="t5t2luzcx" data-path="src/components/QuestionBank.tsx">
                  <SelectValue placeholder="All subjects" data-id="q4m8jzh6w" data-path="src/components/QuestionBank.tsx" />
                </SelectTrigger>
                <SelectContent data-id="9nuwwwr3g" data-path="src/components/QuestionBank.tsx">
                  <SelectItem value="" data-id="tqh76m364" data-path="src/components/QuestionBank.tsx">All subjects</SelectItem>
                  {subjects.map((subject) =>
                  <SelectItem key={subject} value={subject} data-id="8rcghdn1k" data-path="src/components/QuestionBank.tsx">{subject}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div data-id="ohcvk35zw" data-path="src/components/QuestionBank.tsx">
              <Label data-id="vdc1fx1g9" data-path="src/components/QuestionBank.tsx">Difficulty</Label>
              <Select value={filter.difficulty || ''} onValueChange={(value) => setFilter((prev) => ({ ...prev, difficulty: value as 'easy' | 'medium' | 'hard' || undefined }))} data-id="036ojmpk2" data-path="src/components/QuestionBank.tsx">
                <SelectTrigger className="w-32" data-id="1iuljj01l" data-path="src/components/QuestionBank.tsx">
                  <SelectValue placeholder="All" data-id="e8bkk7yyl" data-path="src/components/QuestionBank.tsx" />
                </SelectTrigger>
                <SelectContent data-id="yhi39dk0l" data-path="src/components/QuestionBank.tsx">
                  <SelectItem value="" data-id="2eaon5ob0" data-path="src/components/QuestionBank.tsx">All</SelectItem>
                  {difficulties.map((diff) =>
                  <SelectItem key={diff} value={diff} data-id="uw42213dz" data-path="src/components/QuestionBank.tsx">{diff.charAt(0).toUpperCase() + diff.slice(1)}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question List */}
      <div className="space-y-4" data-id="teh483zwc" data-path="src/components/QuestionBank.tsx">
        {filteredQuestions.map((question) =>
        <Card key={question.id} className={`${isSelectionMode ? 'cursor-pointer hover:bg-gray-50' : ''} ${selectedQuestionsLocal.some((q) => q.id === question.id) ? 'ring-2 ring-blue-500' : ''}`} data-id="lpsjhcjeo" data-path="src/components/QuestionBank.tsx">
            <CardContent className="p-4" data-id="gr4m98xny" data-path="src/components/QuestionBank.tsx">
              <div className="flex items-start justify-between" data-id="x403zmjbg" data-path="src/components/QuestionBank.tsx">
                <div className="flex-1" data-id="3vab3rzf2" data-path="src/components/QuestionBank.tsx">
                  {isSelectionMode &&
                <div className="flex items-center space-x-2 mb-2" data-id="h907g6zd8" data-path="src/components/QuestionBank.tsx">
                      <Checkbox
                    checked={selectedQuestionsLocal.some((q) => q.id === question.id)}
                    onCheckedChange={() => handleSelectQuestion(question)} data-id="typtqdiei" data-path="src/components/QuestionBank.tsx" />

                      <Label className="text-sm font-medium" data-id="wgmt2yj1j" data-path="src/components/QuestionBank.tsx">Select</Label>
                    </div>
                }
                  
                  <h3 className="font-semibold mb-2" data-id="ippvxqkf2" data-path="src/components/QuestionBank.tsx">{question.text}</h3>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3" data-id="c4l50i9k9" data-path="src/components/QuestionBank.tsx">
                    {question.options.map((option, index) =>
                  <div key={index} className={`p-2 rounded border ${index === question.correctAnswer ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`} data-id="88pdondix" data-path="src/components/QuestionBank.tsx">
                        <span className="text-sm" data-id="a8ankrmus" data-path="src/components/QuestionBank.tsx">{String.fromCharCode(65 + index)}. {option}</span>
                        {index === question.correctAnswer &&
                    <span className="text-green-600 text-xs ml-2" data-id="foz2gmour" data-path="src/components/QuestionBank.tsx">✓ Correct</span>
                    }
                      </div>
                  )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap" data-id="srqfy2x8d" data-path="src/components/QuestionBank.tsx">
                    <Badge variant="secondary" data-id="dmjx7iq46" data-path="src/components/QuestionBank.tsx">{question.subject}</Badge>
                    {question.topic && <Badge variant="outline" data-id="f2ty8895c" data-path="src/components/QuestionBank.tsx">{question.topic}</Badge>}
                    <Badge variant={question.difficulty === 'easy' ? 'default' : question.difficulty === 'medium' ? 'secondary' : 'destructive'} data-id="l3a56qq3y" data-path="src/components/QuestionBank.tsx">
                      {question.difficulty}
                    </Badge>
                    {question.tags?.map((tag) =>
                  <Badge key={tag} variant="outline" className="text-xs" data-id="tq471zt6p" data-path="src/components/QuestionBank.tsx">{tag}</Badge>
                  )}
                  </div>
                </div>
                
                {!isSelectionMode &&
              <div className="flex items-center gap-2" data-id="xhv7dqg25" data-path="src/components/QuestionBank.tsx">
                    <Button variant="ghost" size="sm" data-id="zn5xl6r7l" data-path="src/components/QuestionBank.tsx">
                      <Edit className="h-4 w-4" data-id="n0jnuim9p" data-path="src/components/QuestionBank.tsx" />
                    </Button>
                    <Button variant="ghost" size="sm" data-id="8t5qh53a2" data-path="src/components/QuestionBank.tsx">
                      <Copy className="h-4 w-4" data-id="s87phussb" data-path="src/components/QuestionBank.tsx" />
                    </Button>
                    <Button variant="ghost" size="sm" data-id="8r7zzhtp8" data-path="src/components/QuestionBank.tsx">
                      <Trash2 className="h-4 w-4" data-id="8ja904xrv" data-path="src/components/QuestionBank.tsx" />
                    </Button>
                  </div>
              }
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {isSelectionMode &&
      <div className="sticky bottom-0 bg-white border-t p-4" data-id="xh7vhjukr" data-path="src/components/QuestionBank.tsx">
          <div className="flex items-center justify-between" data-id="kercgzdlp" data-path="src/components/QuestionBank.tsx">
            <span className="text-sm text-gray-600" data-id="6iaycpbzt" data-path="src/components/QuestionBank.tsx">
              {selectedQuestionsLocal.length} questions selected
            </span>
            <Button onClick={() => onSelectQuestions?.(selectedQuestionsLocal)} data-id="gdomx0flv" data-path="src/components/QuestionBank.tsx">
              Add Selected Questions
            </Button>
          </div>
        </div>
      }
    </div>);

};

export default QuestionBank;