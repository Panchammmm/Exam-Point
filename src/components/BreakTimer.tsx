import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Pause, Coffee, Clock, AlertTriangle } from 'lucide-react';

interface BreakTimerProps {
  isOnBreak: boolean;
  breakTimeUsed: number; // in seconds
  maxBreakTime: number; // in seconds
  onStartBreak: () => void;
  onEndBreak: () => void;
  onBreakTimeUpdate: (timeUsed: number) => void;
}

const BreakTimer: React.FC<BreakTimerProps> = ({
  isOnBreak,
  breakTimeUsed,
  maxBreakTime,
  onStartBreak,
  onEndBreak,
  onBreakTimeUpdate
}) => {
  const [showBreakDialog, setShowBreakDialog] = useState(false);
  const [currentBreakTime, setCurrentBreakTime] = useState(0);
  const [breakStartTime, setBreakStartTime] = useState<number | null>(null);

  const handleEndBreak = React.useCallback(() => {
    setBreakStartTime(null);
    setCurrentBreakTime(0);
    setShowBreakDialog(false);
    onEndBreak();
  }, [onEndBreak]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOnBreak && breakStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - breakStartTime) / 1000);
        setCurrentBreakTime(elapsed);

        const totalBreakTime = breakTimeUsed + elapsed;
        onBreakTimeUpdate(totalBreakTime);

        // Auto-end break if max time exceeded
        if (totalBreakTime >= maxBreakTime) {
          handleEndBreak();
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnBreak, breakStartTime, breakTimeUsed, maxBreakTime, onBreakTimeUpdate, handleEndBreak]);

  const handleStartBreak = () => {
    if (breakTimeUsed >= maxBreakTime) {
      return;
    }

    setBreakStartTime(Date.now());
    setCurrentBreakTime(0);
    setShowBreakDialog(true);
    onStartBreak();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingBreakTime = maxBreakTime - breakTimeUsed;
  const breakProgress = breakTimeUsed / maxBreakTime * 100;

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg" data-id="y81v22d3x" data-path="src/components/BreakTimer.tsx">
        <div className="flex items-center gap-2" data-id="ingba97ph" data-path="src/components/BreakTimer.tsx">
          <Coffee className="h-5 w-5 text-blue-600" data-id="y4bbrlhbz" data-path="src/components/BreakTimer.tsx" />
          <div data-id="ig7fhb8yj" data-path="src/components/BreakTimer.tsx">
            <p className="text-sm font-medium" data-id="63c7hgp4k" data-path="src/components/BreakTimer.tsx">Break Time</p>
            <p className="text-xs text-gray-600" data-id="958hfoe18" data-path="src/components/BreakTimer.tsx">
              Used: {formatTime(breakTimeUsed)} / {formatTime(maxBreakTime)}
            </p>
          </div>
        </div>
        
        <div className="flex-1" data-id="1hct9moc4" data-path="src/components/BreakTimer.tsx">
          <Progress value={breakProgress} className="h-2" data-id="o8ai8gdsd" data-path="src/components/BreakTimer.tsx" />
        </div>
        
        <Button
          variant={isOnBreak ? "destructive" : "outline"}
          size="sm"
          onClick={isOnBreak ? handleEndBreak : handleStartBreak}
          disabled={!isOnBreak && breakTimeUsed >= maxBreakTime} data-id="w9ds2ugnn" data-path="src/components/BreakTimer.tsx">

          {isOnBreak ?
          <>
              <Pause className="h-4 w-4 mr-2" data-id="8adkfpn40" data-path="src/components/BreakTimer.tsx" />
              End Break
            </> :

          <>
              <Play className="h-4 w-4 mr-2" data-id="0av2g9sar" data-path="src/components/BreakTimer.tsx" />
              Take Break
            </>
          }
        </Button>
      </div>

      {/* Break Dialog */}
      <Dialog open={showBreakDialog} onOpenChange={() => {}} data-id="xep1s4hs0" data-path="src/components/BreakTimer.tsx">
        <DialogContent className="sm:max-w-md" data-id="kqxfwjz6t" data-path="src/components/BreakTimer.tsx">
          <DialogHeader data-id="y0yp2rj86" data-path="src/components/BreakTimer.tsx">
            <DialogTitle className="flex items-center gap-2" data-id="3hc53s0d5" data-path="src/components/BreakTimer.tsx">
              <Coffee className="h-5 w-5 text-blue-600" data-id="k8ivl29xb" data-path="src/components/BreakTimer.tsx" />
              You're on a Break
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4" data-id="l1tlby8md" data-path="src/components/BreakTimer.tsx">
            <div className="text-center" data-id="pogxnqwlu" data-path="src/components/BreakTimer.tsx">
              <div className="text-6xl font-bold text-blue-600 mb-2" data-id="be85q8xc4" data-path="src/components/BreakTimer.tsx">
                {formatTime(currentBreakTime)}
              </div>
              <p className="text-sm text-gray-600" data-id="6ijie6zgy" data-path="src/components/BreakTimer.tsx">Break time elapsed</p>
            </div>
            
            <div className="space-y-2" data-id="4by184xqr" data-path="src/components/BreakTimer.tsx">
              <div className="flex justify-between text-sm" data-id="hdf9uxczk" data-path="src/components/BreakTimer.tsx">
                <span data-id="klpqz9v06" data-path="src/components/BreakTimer.tsx">Break time used:</span>
                <span className="font-medium" data-id="tg7k6lcs8" data-path="src/components/BreakTimer.tsx">{formatTime(breakTimeUsed + currentBreakTime)}</span>
              </div>
              <div className="flex justify-between text-sm" data-id="8afvxnfyz" data-path="src/components/BreakTimer.tsx">
                <span data-id="h31xyfs1d" data-path="src/components/BreakTimer.tsx">Remaining break time:</span>
                <span className="font-medium" data-id="50paevfgr" data-path="src/components/BreakTimer.tsx">{formatTime(Math.max(0, remainingBreakTime - currentBreakTime))}</span>
              </div>
              <Progress
                value={(breakTimeUsed + currentBreakTime) / maxBreakTime * 100}
                className="h-2" data-id="skerdbnhj" data-path="src/components/BreakTimer.tsx" />

            </div>
            
            {(breakTimeUsed + currentBreakTime) / maxBreakTime > 0.8 &&
            <Alert data-id="hjdt0ywn7" data-path="src/components/BreakTimer.tsx">
                <AlertTriangle className="h-4 w-4" data-id="nljsto4dk" data-path="src/components/BreakTimer.tsx" />
                <AlertDescription data-id="y88uu90sq" data-path="src/components/BreakTimer.tsx">
                  You're running low on break time. Consider returning to the exam soon.
                </AlertDescription>
              </Alert>
            }
            
            <div className="bg-blue-50 p-4 rounded-lg" data-id="p1lp2trb4" data-path="src/components/BreakTimer.tsx">
              <div className="flex items-start gap-2" data-id="1r6r81j81" data-path="src/components/BreakTimer.tsx">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" data-id="cg9n0xuqa" data-path="src/components/BreakTimer.tsx" />
                <div data-id="qg0lddjkg" data-path="src/components/BreakTimer.tsx">
                  <p className="font-medium text-blue-900" data-id="x2zhicy5b" data-path="src/components/BreakTimer.tsx">Break Guidelines</p>
                  <ul className="text-sm text-blue-800 mt-1 space-y-1" data-id="14csg9627" data-path="src/components/BreakTimer.tsx">
                    <li data-id="awz7cp8lc" data-path="src/components/BreakTimer.tsx">• Take this time to rest and recharge</li>
                    <li data-id="36yfi9wv2" data-path="src/components/BreakTimer.tsx">• The exam timer continues running</li>
                    <li data-id="p1fv8rtkw" data-path="src/components/BreakTimer.tsx">• You can return anytime before break time expires</li>
                    <li data-id="y8lhl98me" data-path="src/components/BreakTimer.tsx">• Your progress is automatically saved</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center" data-id="kmjh5pt10" data-path="src/components/BreakTimer.tsx">
              <Button onClick={handleEndBreak} className="w-full" data-id="exjcxyvh" data-path="src/components/BreakTimer.tsx">
                Return to Exam
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>);

};

export default BreakTimer;