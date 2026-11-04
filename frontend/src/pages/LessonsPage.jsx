import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Award,
  ChevronRight,
  X,
  ArrowRight,
  Check,
  CheckSquare,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { lessonService } from '../services/lessonService';

export function LessonsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuth } = useAuth();

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeLessonLoading, setActiveLessonLoading] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [completing, setCompleting] = useState(false);

  // Load chapters and user progress
  useEffect(() => {
    setLoading(true);
    lessonService
      .getChapters()
      .then((res) => {
        const list = res.data || res.chapters || [];
        setChapters(list);

        // Also fetch all lessons to determine completion status if authenticated
        if (user) {
          lessonService
            .getLessons()
            .then((lRes) => {
              const allLessons = lRes.data || lRes || [];
              const completed = new Set(
                allLessons.filter((l) => l.isCompleted).map((l) => l.id)
              );
              setCompletedLessonIds(completed);
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.error('Error fetching curriculum chapters:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  // Handle URL slug parameter to automatically open a lesson
  useEffect(() => {
    const slug = searchParams.get('slug');
    if (slug) {
      loadLesson(slug);
    }
  }, [searchParams]);

  const loadLesson = async (slugOrId) => {
    setActiveLessonLoading(true);
    try {
      const res = await lessonService.getLessonBySlugOrId(slugOrId);
      const lessonData = res.data || res;
      setActiveLesson(lessonData);
      if (lessonData.isCompleted) {
        setCompletedLessonIds((prev) => new Set([...prev, lessonData.id]));
      }
    } catch (err) {
      console.error('Failed to load lesson details:', err);
    } finally {
      setActiveLessonLoading(false);
    }
  };

  const handleOpenLesson = (lesson) => {
    setSearchParams({ slug: lesson.slug });
    loadLesson(lesson.slug || lesson.id);
  };

  const handleCloseModal = () => {
    setActiveLesson(null);
    setSearchParams({});
  };

  const handleCompleteLesson = async () => {
    if (!isAuthenticated) {
      openAuth('login');
      return;
    }
    if (!activeLesson) return;

    setCompleting(true);
    try {
      await lessonService.completeLesson(activeLesson.id);
      setCompletedLessonIds((prev) => new Set([...prev, activeLesson.id]));
      setActiveLesson((prev) => (prev ? { ...prev, isCompleted: true } : null));
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#D87535] uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curriculum Blueprint & Instruction // REF: MV-SYLLABUS</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#22201D] tracking-tight">
          Embedded Systems & Robotics Master Syllabus
        </h1>
        <p className="text-sm text-[#655F55] mt-1 max-w-3xl leading-relaxed font-sans">
          Structured pedagogical progression from silicon gates and registers to RTOS, DMA, and Edge AI.
          Click any lesson to study technical blueprints, verify register architectures, and record your engineering progress.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#655F55]">
          <BookOpen className="w-8 h-8 mx-auto text-[#D87535] animate-pulse mb-3" />
          LOADING CURRICULUM BLUEPRINTS...
        </div>
      ) : (
        <div className="space-y-6">
          {chapters.map((ch) => {
            const chapterCompleted = ch.isCompleted;
            const completedCount = ch.lessons
              ? ch.lessons.filter((l) => completedLessonIds.has(l.id)).length
              : 0;
            const totalCount = ch.lessons?.length || 0;

            return (
              <Card key={ch.id} variant="paper" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C9BDAA] pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono text-sm font-bold transition-colors ${
                        chapterCompleted
                          ? 'bg-[#87945B]/15 border-[#87945B]/50 text-[#87945B]'
                          : 'bg-[#EDE1CE] border-[#C9BDAA] text-[#22201D]'
                      }`}
                    >
                      {chapterCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-[#87945B]" />
                      ) : (
                        String(ch.chapterNumber).padStart(2, '0')
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif text-xl font-bold text-[#22201D]">
                          {ch.title}
                        </h2>
                        {chapterCompleted && (
                          <span className="text-[10px] font-mono text-[#87945B] bg-[#87945B]/15 px-2 py-0.5 rounded border border-[#87945B]/40 font-bold">
                            MASTERED
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#655F55] mt-0.5 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#D87535]" />
                          {ch.estimatedMinutes} Mins
                        </span>
                        {totalCount > 0 && (
                          <span className="text-[11px] text-[#22201D] font-bold">
                            {completedCount}/{totalCount} Lessons Complete
                          </span>
                        )}
                        {ch.quiz && (
                          <button
                            onClick={() => navigate(`/quizzes?chapter=${ch.id}`)}
                            className="flex items-center gap-1 text-[#D87535] hover:underline cursor-pointer font-bold"
                          >
                            <Award className="w-3 h-3" />
                            Take Assessment →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant={ch.level === 'ADVANCED' ? 'amber' : ch.level === 'INTERMEDIATE' ? 'ice' : 'cyan'}>
                    {ch.level}
                  </Badge>
                </div>

                <p className="text-xs text-[#655F55] leading-relaxed font-sans">
                  {ch.summary}
                </p>

                {/* Sub-lessons list */}
                {ch.lessons && ch.lessons.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#8C8275] font-semibold">
                      Curriculum Lessons ({ch.lessons.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ch.lessons.map((lesson) => {
                        const isCompleted = completedLessonIds.has(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            onClick={() => handleOpenLesson(lesson)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isCompleted
                                ? 'bg-[#EDE1CE] border-[#87945B]/50 hover:bg-[#FAF5EB]'
                                : 'bg-[#FAF5EB] border-[#C9BDAA] hover:border-[#D87535] hover:bg-[#EDE1CE]/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 text-xs font-mono text-[#22201D] min-w-0">
                              <span
                                className={`shrink-0 font-bold ${
                                  isCompleted ? 'text-[#87945B]' : 'text-[#D87535]'
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  `${ch.chapterNumber}.${lesson.lessonNumber}`
                                )}
                              </span>
                              <span className="truncate font-serif font-bold">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-mono text-[#8C8275]">
                                {lesson.estimatedMinutes}m
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-[#8C8275]" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Lesson Reader Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#22201D]/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#FAF5EB] border border-[#C9BDAA] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col bg-drafting-grid-subtle">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#C9BDAA] bg-[#EDE1CE] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#D87535] uppercase tracking-wider font-bold">
                    {activeLesson.chapter?.title || 'Curriculum Module'}
                  </span>
                  <span className="text-xs text-[#8C8275]">•</span>
                  <span className="text-[11px] font-mono text-[#655F55]">
                    Lesson {activeLesson.lessonNumber}
                  </span>
                  <Badge variant={activeLesson.difficulty === 'ADVANCED' ? 'amber' : activeLesson.difficulty === 'INTERMEDIATE' ? 'ice' : 'cyan'}>
                    {activeLesson.difficulty}
                  </Badge>
                  {completedLessonIds.has(activeLesson.id) && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-[#87945B] bg-[#87945B]/15 px-2 py-0.5 rounded border border-[#87945B]/40 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#22201D]">
                  {activeLesson.title}
                </h2>
                <div className="flex items-center gap-3 text-xs font-mono text-[#655F55]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D87535]" />
                    {activeLesson.estimatedMinutes} Minutes
                  </span>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg bg-[#FAF5EB] hover:bg-[#EDE1CE] text-[#655F55] hover:text-[#22201D] border border-[#C9BDAA] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#22201D] leading-relaxed">
              {/* Summary Callout */}
              <div className="p-4 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] text-xs font-mono text-[#22201D] space-y-1">
                <div className="text-[10px] uppercase text-[#D87535] tracking-wider font-bold">Core Lesson Objective</div>
                <div className="font-sans text-xs text-[#655F55]">{activeLesson.summary}</div>
              </div>

              {/* Lesson Detailed Content */}
              <div className="prose max-w-none space-y-4 font-sans text-xs sm:text-sm text-[#655F55]">
                {activeLesson.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3
                        key={idx}
                        className="font-serif text-base sm:text-lg font-bold text-[#22201D] pt-2 border-b border-[#C9BDAA] pb-1"
                      >
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2
                        key={idx}
                        className="font-serif text-lg sm:text-xl font-bold text-[#22201D] pt-3 border-b border-[#C9BDAA] pb-1"
                      >
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-1 font-mono text-xs text-[#22201D]">
                        {paragraph.split('\n').map((item, itemIdx) => (
                          <li key={itemIdx}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 border-t border-[#C9BDAA] bg-[#EDE1CE] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {activeLesson.chapter?.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleCloseModal();
                      navigate(`/quizzes?chapter=${activeLesson.chapter.id}`);
                    }}
                    className="flex items-center gap-1.5 font-mono text-xs text-[#22201D]"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-[#D87535]" />
                    Chapter Assessment
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={completedLessonIds.has(activeLesson.id) ? 'outline' : 'primary'}
                  size="sm"
                  disabled={completing}
                  onClick={handleCompleteLesson}
                  className="flex items-center gap-1.5 font-mono text-xs font-bold"
                >
                  {completedLessonIds.has(activeLesson.id) ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#87945B]" />
                      Lesson Completed
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      {completing ? 'Marking...' : 'Mark as Completed'}
                    </>
                  )}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleCloseModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
