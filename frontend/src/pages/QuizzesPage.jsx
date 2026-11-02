import React from 'react';
import { CheckSquare, Award, Clock, HelpCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export function QuizzesPage() {
  const quizCards = [
    {
      id: 'q1',
      title: 'Foundations of Embedded Computing Assessment',
      chapter: 'Chapter 01',
      desc: 'Evaluate knowledge on MPU vs MCU topology, Harvard bus arbitration, crystal clocks, and reset circuits.',
      questions: 4,
      passingScore: 70,
      points: 40,
    },
    {
      id: 'q2',
      title: 'Core Execution Engine & Interrupts Assessment',
      chapter: 'Chapter 02',
      desc: 'Evaluate understanding of register banks, NVIC interrupt priority grouping, and ISR critical sections.',
      questions: 4,
      passingScore: 70,
      points: 40,
    },
    {
      id: 'q3',
      title: 'Digital I/O & Memory-Mapped Registers Assessment',
      chapter: 'Chapter 03',
      desc: 'Validate understanding of GPIO push-pull vs open-drain, pullups, and bitmask register operations.',
      questions: 4,
      passingScore: 70,
      points: 40,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
          <CheckSquare className="w-3.5 h-3.5" />
          Silicon Knowledge Assessments
        </div>
        <h1 className="font-heading text-3xl font-bold text-[#EAF5FF]">
          Engineering Competency & Quizzes
        </h1>
        <p className="text-sm text-[#8FA6BC] mt-1">
          Validate your mastery of low-level architecture, register mechanics, and real-time behavior.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizCards.map((q) => (
          <Card key={q.id} className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="cyan">{q.chapter}</Badge>
                <div className="flex items-center gap-1 text-xs font-mono text-[#FBBF24]">
                  <Award className="w-3.5 h-3.5" />
                  <span>Pass: {q.passingScore}%</span>
                </div>
              </div>

              <h2 className="font-heading text-lg font-bold text-[#EAF5FF]">
                {q.title}
              </h2>

              <p className="text-xs text-[#8FA6BC] leading-relaxed">
                {q.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-[#192B40] flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1 text-[#8FA6BC]">
                <HelpCircle className="w-3.5 h-3.5 text-[#55C7FF]" />
                {q.questions} Questions ({q.points} Pts)
              </span>
              <Button size="sm">Start Assessment</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

