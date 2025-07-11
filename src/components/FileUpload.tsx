import { useState, useCallback, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onQuestionsExtracted: (questions: Question[]) => void;
  onClose?: () => void;
}

interface Question {
  type: 'text' | 'multiple-choice';
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onQuestionsExtracted, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF, DOCX or DOC file.',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 20MB',
        variant: 'destructive'
      });
      return;
    }

    setUploadedFile(file);
    onFileUpload(file);
  };

  const processFile = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    try {
      let extractedQuestions: Question[] = [];

      if (uploadedFile.type === 'application/pdf') {
        extractedQuestions = await parsePDF(uploadedFile);
      } else if (
        uploadedFile.name.endsWith('.docx') ||
        uploadedFile.name.endsWith('.doc')
      ) {
        extractedQuestions = await parseWord(uploadedFile);
      }

      if (extractedQuestions.length === 0) {
        toast({
          title: 'No questions found',
          description: 'Could not extract questions from the file. Please check the format.',
          variant: 'destructive'
        });
        return;
      }

      onQuestionsExtracted(extractedQuestions);
      toast({
        title: 'Questions extracted successfully',
        description: `Found ${extractedQuestions.length} questions from the file`
      });

      setUploadedFile(null);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: 'Processing failed',
        description: (error as Error).message || 'Could not process the file. Please check the format and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const parsePDF = async (file: File): Promise<Question[]> => {
    const pdfParse = (await import('pdf-parse')).default;
    const arrayBuffer = await file.arrayBuffer();
    const data = await pdfParse(new Uint8Array(arrayBuffer));
    return parseQuestionText(data.text);
  };

  const parseWord = async (file: File): Promise<Question[]> => {
    try {
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return parseQuestionText(result.value);
    } catch {
      throw new Error('Unable to parse DOC file. Please convert it to DOCX and try again.');
    }
  };

  const parseQuestionText = (text: string): Question[] => {
    const questions: Question[] = [];

    const questionPatterns = [
      /\n\d+\.\s/g,
      /\nQ\d+[\].:]\s/gi,
      /\nQuestion\s+\d+[\].:]\s/gi
    ];

    let questionBlocks: string[] = [];

    for (const pattern of questionPatterns) {
      const matches = text.split(pattern);
      if (matches.length > 1) {
        questionBlocks = matches.slice(1);
        break;
      }
    }

    if (questionBlocks.length === 0) {
      questionBlocks = text.split('\n\n').filter((block) => block.trim().length > 10);
    }

    questionBlocks.forEach((block) => {
      const trimmedBlock = block.trim();
      if (trimmedBlock.length < 10) return;

      const lines = trimmedBlock.split('\n').map((line) => line.trim()).filter(Boolean);
      if (lines.length < 2) return;

      const questionText = lines[0];
      const options: string[] = [];
      let correctAnswer = '';

      const optionPattern = /^[A-Da-d][\].)]\s*/;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        if (optionPattern.test(line)) {
          const optionText = line.replace(optionPattern, '').trim();
          options.push(optionText);

          if (line.includes('*') || line.toLowerCase().includes('correct')) {
            correctAnswer = optionText;
          }
        }
      }

      if (options.length === 0) {
        questions.push({
          type: 'text',
          question: questionText,
          correctAnswer: '',
          points: 1
        });
      } else {
        if (!correctAnswer && options.length > 0) {
          correctAnswer = options[0];
        }

        questions.push({
          type: 'multiple-choice',
          question: questionText,
          options,
          correctAnswer,
          points: 1
        });
      }
    });

    return questions;
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Questions from File
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium">Drop your file here</p>
                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">PDF</Badge>
                <Badge variant="secondary">Word (.docx / .doc)</Badge>
              </div>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                ref={fileInputRef}
                onChange={handleFileInput}
                className="absolute w-[40%] h-[30%] opacity-0 cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">File Format Tips:</p>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Number your questions (1., 2., Q1:, etc.)</li>
                    <li>• Use A), B), C), D) for multiple choice options</li>
                    <li>• Mark correct answers with * or "correct"</li>
                    <li>• Separate questions with blank lines</li>
                    <li>• Upload PDF, DOCX, or DOC files (DOC parsing may be less accurate)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={processFile} disabled={isProcessing} className="flex-1">
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Extract Questions
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={removeFile}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
