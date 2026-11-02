import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle2, Award, ChevronRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { lessonService } from '../services/lessonService';

export function LessonsPage() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lessonService
      .getChapters()
      .then((res) => {
        setChapters(res.data || res.chapters || []);
      })
      .catch((err) => {
        console.error('Error fetching curriculum chapters:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          Silicon Curriculum & Instruction
        </div>
        <h1 className="font-heading text-3xl font-bold text-[#EAF5FF]">
          Embedded Systems & Robotics Master Syllabus
        </h1>
        <p className="text-sm text-[#8FA6BC] mt-1">
          Structured pedagogical progression from silicon gates and registers to RTOS, DMA, and Edge AI.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#8FA6BC]">
          LOADING CURRICULUM BLUEPRINTS...
        </div>
      ) : (
        <div className="space-y-6">
          {chapters.map((ch) => (
            <Card key={ch.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#192B40] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#0B1220] border border-[#55C7FF]/30 flex items-center justify-center font-mono text-sm font-bold text-[#55C7FF]">
                    {String(ch.chapterNumber).padStart(2, '0')}
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-[#EAF5FF]">
                      {ch.title}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-[#8FA6BC] mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#55C7FF]" />
                        {ch.estimatedMinutes} Mins
                      </span>
                      {ch.quiz && (
                        <span className="flex items-center gap-1 text-[#FBBF24]">
                          <Award className="w-3 h-3" />
                          Assessment Included
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant={ch.level === 'ADVANCED' ? 'amber' : ch.level === 'INTERMEDIATE' ? 'ice' : 'cyan'}>
                  {ch.level}
                </Badge>
              </div>

              <p className="text-xs text-[#8FA6BC] leading-relaxed">
                {ch.summary}
              </p>

              {/* Sub-lessons list */}
              {ch.lessons && ch.lessons.length > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#8FA6BC]">
                    Curriculum Lessons ({ch.lessons.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ch.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-2.5 rounded-lg bg-[#0B1220]/60 border border-[#192B40] flex items-center justify-between hover:border-[#55C7FF]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs font-mono text-[#EAF5FF]">
                          <span className="text-[#55C7FF]">{ch.chapterNumber}.{lesson.lessonNumber}</span>
                          <span className="truncate max-w-[240px]">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#8FA6BC]">
                          {lesson.estimatedMinutes}m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

