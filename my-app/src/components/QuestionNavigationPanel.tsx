import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionNavigationPanelProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredQuestions: Set<number>;
  markedForLater: Set<number>;
  onQuestionSelect: (index: number) => void;
  onMarkForLater: () => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  className?: string;
}

const QuestionNavigationPanel: React.FC<QuestionNavigationPanelProps> = ({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  markedForLater,
  onQuestionSelect,
  onMarkForLater,
  onPrevious,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  className
}) => {
  const getQuestionStatus = (index: number) => {
    if (answeredQuestions.has(index)) return 'answered';
    if (markedForLater.has(index)) return 'marked';
    return 'unanswered';
  };

  const getButtonColor = (status: string, isActive: boolean) => {
    if (isActive) {
      return 'bg-blue-600 text-white border-blue-600';
    }

    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white border-green-500 hover:bg-green-600';
      case 'marked':
        return 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300';
    }
  };

  return (
    <Card className={cn("w-full", className)} data-id="5velr7li9" data-path="src/components/QuestionNavigationPanel.tsx">
      <CardHeader className="pb-3" data-id="fbqtzs887" data-path="src/components/QuestionNavigationPanel.tsx">
        <CardTitle className="text-lg flex items-center justify-between" data-id="0g7m5ggn0" data-path="src/components/QuestionNavigationPanel.tsx">
          Question Navigation
          <div className="text-sm font-normal text-gray-600" data-id="8hnm1uh22" data-path="src/components/QuestionNavigationPanel.tsx">
            {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" data-id="2j2pd36oc" data-path="src/components/QuestionNavigationPanel.tsx">
        {/* Question Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2" data-id="yg11cscfp" data-path="src/components/QuestionNavigationPanel.tsx">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const status = getQuestionStatus(index);
            const isActive = index === currentQuestionIndex;

            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onQuestionSelect(index)}
                className={cn(
                  "w-full h-10 text-sm font-medium transition-all duration-200",
                  getButtonColor(status, isActive)
                )} data-id="i40zke8ku" data-path="src/components/QuestionNavigationPanel.tsx">

                {index + 1}
                {status === 'answered' && !isActive &&
                <Check className="w-3 h-3 ml-1" data-id="uxpqvwthh" data-path="src/components/QuestionNavigationPanel.tsx" />
                }
                {status === 'marked' && !isActive &&
                <Clock className="w-3 h-3 ml-1" data-id="btzow8mea" data-path="src/components/QuestionNavigationPanel.tsx" />
                }
              </Button>);

          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs" data-id="14jgd5aff" data-path="src/components/QuestionNavigationPanel.tsx">
          <div className="flex items-center" data-id="myzrn0uv5" data-path="src/components/QuestionNavigationPanel.tsx">
            <div className="w-4 h-4 bg-green-500 rounded mr-2" data-id="5te9s5uvj" data-path="src/components/QuestionNavigationPanel.tsx"></div>
            <span data-id="jf9yyb8ws" data-path="src/components/QuestionNavigationPanel.tsx">Answered</span>
          </div>
          <div className="flex items-center" data-id="pqbvgjfa3" data-path="src/components/QuestionNavigationPanel.tsx">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2" data-id="75bpy8lwc" data-path="src/components/QuestionNavigationPanel.tsx"></div>
            <span data-id="t6ejgpfa8" data-path="src/components/QuestionNavigationPanel.tsx">Marked for Later</span>
          </div>
          <div className="flex items-center" data-id="idvedk6e" data-path="src/components/QuestionNavigationPanel.tsx">
            <div className="w-4 h-4 bg-gray-300 rounded mr-2" data-id="uhvsx9cbf" data-path="src/components/QuestionNavigationPanel.tsx"></div>
            <span data-id="dsfzidl3x" data-path="src/components/QuestionNavigationPanel.tsx">Not Answered</span>
          </div>
          <div className="flex items-center" data-id="jbxcp1v64" data-path="src/components/QuestionNavigationPanel.tsx">
            <div className="w-4 h-4 bg-blue-600 rounded mr-2" data-id="882gc1n8x" data-path="src/components/QuestionNavigationPanel.tsx"></div>
            <span data-id="n1pk0uqur" data-path="src/components/QuestionNavigationPanel.tsx">Current</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2 border-t" data-id="lh1g6bus9" data-path="src/components/QuestionNavigationPanel.tsx">
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkForLater}
            className="w-full" data-id="s031qr8hi" data-path="src/components/QuestionNavigationPanel.tsx">

            <Clock className="w-4 h-4 mr-2" data-id="27dda5jsd" data-path="src/components/QuestionNavigationPanel.tsx" />
            {markedForLater.has(currentQuestionIndex) ? 'Unmark for Later' : 'Mark for Later'}
          </Button>
          
          <div className="flex gap-2" data-id="t3rn5nluz" data-path="src/components/QuestionNavigationPanel.tsx">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={isFirstQuestion}
              className="flex-1" data-id="jvvra94b1" data-path="src/components/QuestionNavigationPanel.tsx">

              <ChevronLeft className="w-4 h-4 mr-1" data-id="o9g5xjwo3" data-path="src/components/QuestionNavigationPanel.tsx" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={isLastQuestion}
              className="flex-1" data-id="yj7vewkqj" data-path="src/components/QuestionNavigationPanel.tsx">

              Next
              <ChevronRight className="w-4 h-4 ml-1" data-id="ypbt45v6p" data-path="src/components/QuestionNavigationPanel.tsx" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>);

};

export default QuestionNavigationPanel;