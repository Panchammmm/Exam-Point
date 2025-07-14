import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Clock, BookOpen } from 'lucide-react';
import { ExamSection } from '@/types';

interface ExamSectionNavigationProps {
  sections: ExamSection[];
  currentSectionIndex: number;
  currentQuestionIndex: number;
  answers: Record<string, number>;
  onSectionChange: (sectionIndex: number) => void;
  onQuestionChange: (questionIndex: number) => void;
  timeRemaining: number;
  totalTimeLimit: number;
}

const ExamSectionNavigation: React.FC<ExamSectionNavigationProps> = ({
  sections,
  currentSectionIndex,
  currentQuestionIndex,
  answers,
  onSectionChange,
  onQuestionChange,
  timeRemaining,
  totalTimeLimit
}) => {
  const currentSection = sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];

  const getSectionProgress = (section: ExamSection) => {
    const answeredQuestions = section.questions.filter((q) => answers[q.id] !== undefined).length;
    return answeredQuestions / section.questions.length * 100;
  };

  const getTotalProgress = () => {
    const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = Object.keys(answers).length;
    return answeredQuestions / totalQuestions * 100;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const canNavigateToSection = (sectionIndex: number) => {
    return true; // Allow free navigation between sections
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      onQuestionChange(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      const prevSection = sections[currentSectionIndex - 1];
      onSectionChange(currentSectionIndex - 1);
      onQuestionChange(prevSection.questions.length - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      onQuestionChange(currentQuestionIndex + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      onSectionChange(currentSectionIndex + 1);
      onQuestionChange(0);
    }
  };

  const hasPrevious = currentSectionIndex > 0 || currentQuestionIndex > 0;
  const hasNext = currentSectionIndex < sections.length - 1 || currentQuestionIndex < currentSection.questions.length - 1;

  return (
    <div className="space-y-4" data-id="8oc7wqolh" data-path="src/components/ExamSectionNavigation.tsx">
      {/* Time and Progress Header */}
      <Card data-id="n081mmfiz" data-path="src/components/ExamSectionNavigation.tsx">
        <CardContent className="p-4" data-id="fcoanexsx" data-path="src/components/ExamSectionNavigation.tsx">
          <div className="flex items-center justify-between mb-3" data-id="vg1k5ioip" data-path="src/components/ExamSectionNavigation.tsx">
            <div className="flex items-center gap-2" data-id="yesett6s9" data-path="src/components/ExamSectionNavigation.tsx">
              <Clock className="h-5 w-5 text-blue-600" data-id="31mo3iml9" data-path="src/components/ExamSectionNavigation.tsx" />
              <div data-id="agcl96c0z" data-path="src/components/ExamSectionNavigation.tsx">
                <p className="text-sm font-medium" data-id="a786szhq0" data-path="src/components/ExamSectionNavigation.tsx">Time Remaining</p>
                <p className="text-2xl font-bold text-blue-600" data-id="iwqp5va29" data-path="src/components/ExamSectionNavigation.tsx">{formatTime(timeRemaining)}</p>
              </div>
            </div>
            <div className="text-right" data-id="ypev59jbd" data-path="src/components/ExamSectionNavigation.tsx">
              <p className="text-sm text-gray-600" data-id="bqdltvh9l" data-path="src/components/ExamSectionNavigation.tsx">Overall Progress</p>
              <p className="text-lg font-semibold" data-id="hf7e6e4u8" data-path="src/components/ExamSectionNavigation.tsx">{Math.round(getTotalProgress())}%</p>
            </div>
          </div>
          <Progress value={getTotalProgress()} className="h-2" data-id="q8cvpifyo" data-path="src/components/ExamSectionNavigation.tsx" />
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <Card data-id="2eg24g5kx" data-path="src/components/ExamSectionNavigation.tsx">
        <CardHeader data-id="9ed5doza9" data-path="src/components/ExamSectionNavigation.tsx">
          <CardTitle className="flex items-center gap-2" data-id="qhhgl7i85" data-path="src/components/ExamSectionNavigation.tsx">
            <BookOpen className="h-5 w-5" data-id="j7152qlvw" data-path="src/components/ExamSectionNavigation.tsx" />
            Sections
          </CardTitle>
        </CardHeader>
        <CardContent data-id="e9oibpyth" data-path="src/components/ExamSectionNavigation.tsx">
          <ScrollArea className="h-40" data-id="bvc6lincu" data-path="src/components/ExamSectionNavigation.tsx">
            <div className="space-y-2" data-id="rlahwwn1e" data-path="src/components/ExamSectionNavigation.tsx">
              {sections.map((section, index) =>
              <Button
                key={section.id}
                variant={index === currentSectionIndex ? "default" : "outline"}
                className="w-full justify-start h-auto p-3"
                onClick={() => canNavigateToSection(index) && onSectionChange(index)}
                disabled={!canNavigateToSection(index)} data-id="mf7ty0aom" data-path="src/components/ExamSectionNavigation.tsx">

                  <div className="flex items-center justify-between w-full" data-id="q0gyn76ha" data-path="src/components/ExamSectionNavigation.tsx">
                    <div className="text-left" data-id="tyemxden9" data-path="src/components/ExamSectionNavigation.tsx">
                      <p className="font-medium" data-id="5xig5iqhe" data-path="src/components/ExamSectionNavigation.tsx">{section.title}</p>
                      <p className="text-xs opacity-75" data-id="u3yaocvvq" data-path="src/components/ExamSectionNavigation.tsx">
                        {section.questions.length} questions
                      </p>
                    </div>
                    <div className="flex items-center gap-2" data-id="kjwkfbms8" data-path="src/components/ExamSectionNavigation.tsx">
                      <Badge variant="secondary" className="text-xs" data-id="esqhjszy1" data-path="src/components/ExamSectionNavigation.tsx">
                        {Math.round(getSectionProgress(section))}%
                      </Badge>
                      {getSectionProgress(section) === 100 &&
                    <CheckCircle className="h-4 w-4 text-green-500" data-id="4egksyqk0" data-path="src/components/ExamSectionNavigation.tsx" />
                    }
                    </div>
                  </div>
                </Button>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Current Section Progress */}
      {currentSection &&
      <Card data-id="t3kz0wy0f" data-path="src/components/ExamSectionNavigation.tsx">
          <CardHeader data-id="us9v05jkt" data-path="src/components/ExamSectionNavigation.tsx">
            <CardTitle className="text-lg" data-id="elmalpo8l" data-path="src/components/ExamSectionNavigation.tsx">{currentSection.title}</CardTitle>
            {currentSection.description &&
          <p className="text-sm text-gray-600" data-id="k5eol6xhx" data-path="src/components/ExamSectionNavigation.tsx">{currentSection.description}</p>
          }
          </CardHeader>
          <CardContent data-id="f76yjuurq" data-path="src/components/ExamSectionNavigation.tsx">
            <div className="space-y-3" data-id="vbroxutly" data-path="src/components/ExamSectionNavigation.tsx">
              <div className="flex items-center justify-between" data-id="d9me4zgbm" data-path="src/components/ExamSectionNavigation.tsx">
                <span className="text-sm font-medium" data-id="tjnu8zoui" data-path="src/components/ExamSectionNavigation.tsx">
                  Question {currentQuestionIndex + 1} of {currentSection.questions.length}
                </span>
                <span className="text-sm text-gray-600" data-id="wik8bsn7m" data-path="src/components/ExamSectionNavigation.tsx">
                  {currentSection.questions.filter((q) => answers[q.id] !== undefined).length} answered
                </span>
              </div>
              
              <Progress
              value={getSectionProgress(currentSection)}
              className="h-2" data-id="m3sgrehuy" data-path="src/components/ExamSectionNavigation.tsx" />

              
              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2" data-id="xc97rl5zh" data-path="src/components/ExamSectionNavigation.tsx">
                {currentSection.questions.map((question, qIndex) =>
              <Button
                key={question.id}
                variant={qIndex === currentQuestionIndex ? "default" : "outline"}
                size="sm"
                className={`h-8 w-8 p-0 ${answers[question.id] !== undefined ? 'bg-green-100 border-green-300' : ''}`}
                onClick={() => onQuestionChange(qIndex)} data-id="b9u5g6a9s" data-path="src/components/ExamSectionNavigation.tsx">

                    {answers[question.id] !== undefined ?
                <CheckCircle className="h-4 w-4 text-green-600" data-id="nez07uznv" data-path="src/components/ExamSectionNavigation.tsx" /> :

                <Circle className="h-4 w-4" data-id="d3hix3x6v" data-path="src/components/ExamSectionNavigation.tsx" />
                }
                    <span className="sr-only" data-id="1xot24hgo" data-path="src/components/ExamSectionNavigation.tsx">Question {qIndex + 1}</span>
                  </Button>
              )}
              </div>
            </div>
          </CardContent>
        </Card>
      }

      {/* Navigation Controls */}
      <div className="flex items-center justify-between" data-id="pm4zwa73j" data-path="src/components/ExamSectionNavigation.tsx">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={!hasPrevious}
          className="flex items-center gap-2" data-id="631ohzoxr" data-path="src/components/ExamSectionNavigation.tsx">

          <ChevronLeft className="h-4 w-4" data-id="1sfy419ks" data-path="src/components/ExamSectionNavigation.tsx" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2" data-id="5a8b9n3tx" data-path="src/components/ExamSectionNavigation.tsx">
          <Badge variant="outline" data-id="mopnx33op" data-path="src/components/ExamSectionNavigation.tsx">
            Section {currentSectionIndex + 1} of {sections.length}
          </Badge>
          <Badge variant="outline" data-id="c6yrm2lul" data-path="src/components/ExamSectionNavigation.tsx">
            Question {currentQuestionIndex + 1} of {currentSection?.questions.length || 0}
          </Badge>
        </div>
        
        <Button
          variant="outline"
          onClick={handleNextQuestion}
          disabled={!hasNext}
          className="flex items-center gap-2" data-id="2jtlljuzo" data-path="src/components/ExamSectionNavigation.tsx">

          Next
          <ChevronRight className="h-4 w-4" data-id="ezromqm0n" data-path="src/components/ExamSectionNavigation.tsx" />
        </Button>
      </div>
    </div>);

};

export default ExamSectionNavigation;