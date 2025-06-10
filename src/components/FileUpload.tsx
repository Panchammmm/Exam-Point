import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';

interface FileUploadProps {
  onQuestionsExtracted: (questions: any[]) => void;
  onClose?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onQuestionsExtracted, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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
    'application/msword'];


    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document (.pdf, .docx, .doc)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {// 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
  };

  const processFile = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    try {
      let extractedQuestions: any[] = [];

      if (uploadedFile.type === 'application/pdf') {
        extractedQuestions = await parsePDF(uploadedFile);
      } else if (uploadedFile.type.includes('word') || uploadedFile.name.endsWith('.docx')) {
        extractedQuestions = await parseWord(uploadedFile);
      }

      if (extractedQuestions.length === 0) {
        toast({
          title: "No questions found",
          description: "Could not extract questions from the file. Please check the format.",
          variant: "destructive"
        });
        return;
      }

      onQuestionsExtracted(extractedQuestions);
      toast({
        title: "Questions extracted successfully",
        description: `Found ${extractedQuestions.length} questions from the file`
      });

      setUploadedFile(null);
      if (onClose) onClose();

    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Processing failed",
        description: "Could not process the file. Please check the format and try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const parsePDF = async (file: File): Promise<any[]> => {
    const pdfParse = (await import('pdf-parse')).default;
    const arrayBuffer = await file.arrayBuffer();
    const data = await pdfParse(Buffer.from(arrayBuffer));
    return parseQuestionText(data.text);
  };

  const parseWord = async (file: File): Promise<any[]> => {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return parseQuestionText(result.value);
  };

  const parseQuestionText = (text: string): any[] => {
    const questions: any[] = [];

    // Split by common question patterns
    const questionPatterns = [
    /\n\d+\.\s/g, // 1. Question
    /\nQ\d+[\.:]\s/gi, // Q1: Question
    /\nQuestion\s+\d+[\.:]\s/gi // Question 1: 
    ];

    let questionBlocks: string[] = [];

    // Try different patterns to split questions
    for (const pattern of questionPatterns) {
      const matches = text.split(pattern);
      if (matches.length > 1) {
        questionBlocks = matches.slice(1); // Remove first empty element
        break;
      }
    }

    // If no pattern worked, try simple double newline split
    if (questionBlocks.length === 0) {
      questionBlocks = text.split('\n\n').filter((block) => block.trim().length > 10);
    }

    questionBlocks.forEach((block, index) => {
      const trimmedBlock = block.trim();
      if (trimmedBlock.length < 10) return;

      // Extract question and options
      const lines = trimmedBlock.split('\n').map((line) => line.trim()).filter((line) => line);

      if (lines.length < 2) return;

      const questionText = lines[0];
      const options: string[] = [];
      let correctAnswer = '';

      // Look for options (A), B), a., etc.
      const optionPattern = /^[A-Da-d][\.)]\s*/;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        if (optionPattern.test(line)) {
          const optionText = line.replace(optionPattern, '').trim();
          options.push(optionText);

          // Check if this option is marked as correct (*)
          if (line.includes('*') || line.toLowerCase().includes('correct')) {
            correctAnswer = optionText;
          }
        }
      }

      // If no options found, create a text question
      if (options.length === 0) {
        questions.push({
          type: 'text',
          question: questionText,
          correctAnswer: '',
          points: 1
        });
      } else {
        // If no correct answer marked, assume first option
        if (!correctAnswer && options.length > 0) {
          correctAnswer = options[0];
        }

        questions.push({
          type: 'multiple-choice',
          question: questionText,
          options: options,
          correctAnswer: correctAnswer,
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
    <Card className="w-full max-w-2xl mx-auto" data-id="3icxkfsvp" data-path="src/components/FileUpload.tsx">
      <CardHeader className="flex flex-row items-center justify-between" data-id="epgjpyx53" data-path="src/components/FileUpload.tsx">
        <CardTitle className="flex items-center gap-2" data-id="57c5i4cx6" data-path="src/components/FileUpload.tsx">
          <Upload className="h-5 w-5" data-id="xh0civx7q" data-path="src/components/FileUpload.tsx" />
          Import Questions from File
        </CardTitle>
        {onClose &&
        <Button variant="ghost" size="sm" onClick={onClose} data-id="50kiq500x" data-path="src/components/FileUpload.tsx">
            <X className="h-4 w-4" data-id="xtqk1s7dd" data-path="src/components/FileUpload.tsx" />
          </Button>
        }
      </CardHeader>
      <CardContent className="space-y-4" data-id="zdbjvpurm" data-path="src/components/FileUpload.tsx">
        {!uploadedFile ?
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ?
          'border-primary bg-primary/5' :
          'border-gray-300 hover:border-primary/50'}`
          }
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop} data-id="3zvobxqp9" data-path="src/components/FileUpload.tsx">

            <div className="flex flex-col items-center gap-4" data-id="ez5e01bar" data-path="src/components/FileUpload.tsx">
              <div className="rounded-full bg-primary/10 p-3" data-id="xgdo74k2n" data-path="src/components/FileUpload.tsx">
                <FileText className="h-8 w-8 text-primary" data-id="lzgobqh0m" data-path="src/components/FileUpload.tsx" />
              </div>
              <div data-id="82ihpitht" data-path="src/components/FileUpload.tsx">
                <p className="text-lg font-medium" data-id="46ryxtkhr" data-path="src/components/FileUpload.tsx">Drop your file here</p>
                <p className="text-sm text-gray-500 mt-1" data-id="7kjytbm5t" data-path="src/components/FileUpload.tsx">
                  or click to browse
                </p>
              </div>
              <div className="flex gap-2" data-id="jjvd723x6" data-path="src/components/FileUpload.tsx">
                <Badge variant="secondary" data-id="wdab01yif" data-path="src/components/FileUpload.tsx">PDF</Badge>
                <Badge variant="secondary" data-id="fwry9k1te" data-path="src/components/FileUpload.tsx">Word (.docx)</Badge>
              </div>
              <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" data-id="bspkkc7lg" data-path="src/components/FileUpload.tsx" />

            </div>
          </div> :

        <div className="space-y-4" data-id="aa2nmql1u" data-path="src/components/FileUpload.tsx">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" data-id="pvqwhlg67" data-path="src/components/FileUpload.tsx">
              <div className="flex items-center gap-3" data-id="2vwqgsn5q" data-path="src/components/FileUpload.tsx">
                <FileText className="h-5 w-5 text-primary" data-id="9m4r4sali" data-path="src/components/FileUpload.tsx" />
                <div data-id="snlygdags" data-path="src/components/FileUpload.tsx">
                  <p className="font-medium" data-id="j8lzex2b5" data-path="src/components/FileUpload.tsx">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500" data-id="084dq1yex" data-path="src/components/FileUpload.tsx">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={removeFile} data-id="3gd2p6121" data-path="src/components/FileUpload.tsx">
                <X className="h-4 w-4" data-id="4zffbkjha" data-path="src/components/FileUpload.tsx" />
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-id="k1txv39jr" data-path="src/components/FileUpload.tsx">
              <div className="flex items-start gap-3" data-id="sdjzbb9ry" data-path="src/components/FileUpload.tsx">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" data-id="nw6j4z02w" data-path="src/components/FileUpload.tsx" />
                <div className="text-sm" data-id="gianbd19c" data-path="src/components/FileUpload.tsx">
                  <p className="font-medium text-blue-900 mb-1" data-id="c9df9y78c" data-path="src/components/FileUpload.tsx">File Format Tips:</p>
                  <ul className="text-blue-700 space-y-1" data-id="ltvup0qpy" data-path="src/components/FileUpload.tsx">
                    <li data-id="x1n5ys1sj" data-path="src/components/FileUpload.tsx">• Number your questions (1., 2., Q1:, etc.)</li>
                    <li data-id="zmbr4f7a2" data-path="src/components/FileUpload.tsx">• Use A), B), C), D) for multiple choice options</li>
                    <li data-id="n5qkmzl5p" data-path="src/components/FileUpload.tsx">• Mark correct answers with * or "correct"</li>
                    <li data-id="n9xe7wy3v" data-path="src/components/FileUpload.tsx">• Separate questions with blank lines</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3" data-id="8ladjixxu" data-path="src/components/FileUpload.tsx">
              <Button
              onClick={processFile}
              disabled={isProcessing}
              className="flex-1" data-id="5itoks7yd" data-path="src/components/FileUpload.tsx">

                {isProcessing ?
              <div className="flex items-center gap-2" data-id="fd51flt42" data-path="src/components/FileUpload.tsx">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" data-id="70hcr90xt" data-path="src/components/FileUpload.tsx"></div>
                    Processing...
                  </div> :

              <>
                    <CheckCircle className="h-4 w-4 mr-2" data-id="ma9ig0agc" data-path="src/components/FileUpload.tsx" />
                    Extract Questions
                  </>
              }
              </Button>
              <Button variant="outline" onClick={removeFile} data-id="wlt28sb79" data-path="src/components/FileUpload.tsx">
                Cancel
              </Button>
            </div>
          </div>
        }
      </CardContent>
    </Card>);

};

export default FileUpload;