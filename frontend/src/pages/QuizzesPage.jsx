import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Award,
  Clock,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Code2,
  History,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { quizService } from '../services/quizService';
import { useAuth } from '../hooks/useAuth';

export function QuizzesPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();

  // Page State
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'history'
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Quiz Modal / Taking State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionIndex }
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Fetch quizzes catalog
  const loadQuizzes = () => {
    setLoading(true);
    setError(null);
    quizService
      .getAllQuizzes()
      .then((res) => {
        setQuizzes(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to retrieve assessments:', err);
        setError('Failed to load quizzes. Verify backend connection.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch attempt history
  const loadAttempts = () => {
    if (!user) return;
    quizService
      .getUserAttempts()
      .then((res) => {
        setAttempts(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load user attempts:', err);
      });
  };

  useEffect(() => {
    loadQuizzes();
    if (user) {
      loadAttempts();
    }
  }, [user]);

  // If URL contains chapterId, auto-open that quiz
  useEffect(() => {
    if (chapterId && !activeQuiz && !loading) {
      startQuiz(chapterId);
    }
  }, [chapterId, loading]);

  // Start taking a quiz
  const startQuiz = async (quizIdOrChapterId) => {
    if (!user) {
      openAuth('login');
      return;
    }

    setQuizLoading(true);
    setSubmissionResult(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);

    try {
      const res = await quizService.getQuizById(quizIdOrChapterId);
      setActiveQuiz(res.data);
    } catch (err) {
      console.error('Error starting quiz:', err);
      alert('Failed to load assessment questions.');
    } finally {
      setQuizLoading(false);
    }
  };

  // Select an option
  const handleSelectOption = (questionId, optionIndex) => {
    if (submissionResult) return; // Locked after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;

    // Check if all questions are answered
    const unansweredCount = activeQuiz.questions.filter(
      (q) => selectedAnswers[q.id] === undefined
    ).length;

    if (unansweredCount > 0) {
      if (
        !confirm(
          `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`
        )
      ) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await quizService.submitQuiz(activeQuiz.id, selectedAnswers);
      setSubmissionResult(res.data);
      // Refresh list & history
      loadQuizzes();
      loadAttempts();
    } catch (err) {
      console.error('Error submitting quiz:', err);
      alert('Failed to evaluate quiz submission.');
    } finally {
      setSubmitting(false);
    }
  };

  // Close quiz
  const handleCloseQuiz = () => {
    setActiveQuiz(null);
    setSubmissionResult(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="border-b border-[#C9BDAA] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#D87535] uppercase tracking-widest mb-2 font-semibold">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>MODULE / 05 // ENGINEERING COMPETENCY ASSESSMENTS</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201D] tracking-tight">
              Diagnostic Exercises &amp;
              <br />
              <span className="italic font-normal text-[#D87535]">Knowledge Verification</span>
            </h1>
            <p className="text-sm text-[#655F55] mt-2 max-w-2xl leading-relaxed font-sans">
              Validate mastery of microcontroller architectures, register manipulations, memory hierarchies,
              and real-time robotics firmware. Graded securely on the backend.
            </p>
          </div>

          {/* Tab Switcher — engineering paper style */}
          <div className="flex items-center gap-1 p-1 rounded bg-[#EDE1CE] border border-[#C9BDAA] self-start sm:self-auto font-mono text-xs">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-[#22201D] text-[#FAF5EB] font-bold shadow-sm'
                  : 'text-[#655F55] hover:text-[#22201D]'
              }`}
            >
              All Assessments ({quizzes.length})
            </button>
            <button
              onClick={() => {
                if (!user) {
                  openAuth('login');
                  return;
                }
                setActiveTab('history');
              }}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-[#22201D] text-[#FAF5EB] font-bold shadow-sm'
                  : 'text-[#655F55] hover:text-[#22201D]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History ({attempts.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog View */}
      {activeTab === 'catalog' && (
        <>
          {loading ? (
            <div className="py-20 text-center text-xs font-mono text-[#8C8275] space-y-3">
              <CheckSquare className="w-8 h-8 mx-auto text-[#D87535] animate-spin" />
              <div className="tracking-widest uppercase">Loading Curriculum Assessments...</div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-xs font-mono text-[#B95D32] bg-[#B95D32]/8 rounded border border-[#B95D32]/30">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-[#B95D32]" />
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {quizzes.map((q) => (
                <div
                  key={q.id}
                  className="group relative bg-[#FAF5EB] border border-[#C9BDAA] rounded hover:border-[#D87535] transition-all hover:shadow-md flex flex-col justify-between overflow-hidden"
                >
                  {/* Top accent bar */}
                  <div className="h-0.5 bg-[#D87535] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="p-5 space-y-3 flex-1">
                    {/* Chapter badge & score */}
                    <div className="flex items-center justify-between">
                      <Badge variant="orange">
                        CHAPTER {String(q.chapter?.chapterNumber ?? '').padStart(2, '0')}
                      </Badge>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-[#D87535]">
                        <Award className="w-3.5 h-3.5" />
                        <span>Pass: {q.passingScore}%</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#22201D] line-clamp-2 group-hover:text-[#D87535] transition-colors">
                      {q.title}
                    </h3>

                    <p className="text-xs text-[#655F55] line-clamp-2 leading-relaxed font-sans">
                      {q.description || 'Comprehensive multiple-choice assessment of core concepts.'}
                    </p>

                    {/* Attempts Status */}
                    {q.attemptsCount > 0 && (
                      <div className="p-2.5 rounded bg-[#EDE1CE] border border-[#C9BDAA] text-[11px] font-mono flex items-center justify-between">
                        <span className="text-[#8C8275]">Best Score:</span>
                        <span className={`font-bold ${q.passed ? 'text-[#87945B]' : 'text-[#D87535]'}`}>
                          {q.bestScore}% {q.passed ? '✓ PASSED' : '— INCOMPLETE'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-[#C9BDAA]/50 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8C8275]">
                      {q.questionCount} Question{q.questionCount === 1 ? '' : 's'}
                    </span>
                    <Button
                      size="sm"
                      variant={q.passed ? 'outline' : 'primary'}
                      onClick={() => startQuiz(q.id)}
                      className="flex items-center gap-1.5 font-bold"
                    >
                      {q.passed ? 'Retake' : 'Start Assessment'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Attempt History View */}
      {activeTab === 'history' && (
        <div className="bg-[#FAF5EB] border border-[#C9BDAA] rounded p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#C9BDAA] pb-3">
            <div>
              <div className="text-[10px] font-mono text-[#D87535] uppercase tracking-widest mb-0.5">
                EXPERIMENT LOG // ASSESSMENT HISTORY
              </div>
              <h3 className="font-serif text-xl font-bold text-[#22201D]">
                Assessment History &amp; Verifications
              </h3>
            </div>
            <span className="text-xs font-mono text-[#D87535] bg-[#D87535]/10 border border-[#D87535]/30 px-2 py-1 rounded">
              {attempts.length} Submissions
            </span>
          </div>

          {attempts.length === 0 ? (
            <div className="p-10 text-center text-xs font-mono text-[#8C8275] bg-[#EDE1CE] rounded border border-[#C9BDAA] border-dashed">
              <History className="w-8 h-8 mx-auto mb-2 text-[#C9BDAA]" />
              No previous attempts logged. Complete an assessment to record your verified score.
            </div>
          ) : (
            <div className="space-y-2">
              {attempts.map((att) => {
                const pct = Math.round((att.score / att.totalPoints) * 100);
                return (
                  <div
                    key={att.id}
                    className="p-4 rounded border border-[#C9BDAA] bg-[#F5EBDD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono hover:border-[#D87535] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={att.passed ? 'olive' : 'terracotta'}>
                          {att.passed ? 'PASSED' : 'FAILED'}
                        </Badge>
                        <span className="font-bold text-[#22201D] text-sm">{att.quiz?.title}</span>
                      </div>
                      <div className="text-[11px] text-[#8C8275]">
                        Chapter {att.quiz?.chapter?.chapterNumber}: {att.quiz?.chapter?.title} ·{' '}
                        {new Date(att.attemptedAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className={`font-bold text-base ${att.passed ? 'text-[#87945B]' : 'text-[#B95D32]'}`}>
                          {pct}%
                        </div>
                        <div className="text-[10px] text-[#8C8275]">
                          {att.score} / {att.totalPoints} pts
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startQuiz(att.quiz?.id)}
                        className="text-xs"
                      >
                        Retake
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Interactive Quiz Assessment Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#22201D]/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#FAF5EB] border-2 border-[#C9BDAA] rounded shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">

            {/* Orange top accent */}
            <div className="h-0.5 bg-[#D87535]" />

            {/* Modal Header */}
            <div className="p-5 border-b border-[#C9BDAA] bg-[#FAF5EB] flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="orange">ASSESSMENT IN PROGRESS</Badge>
                  <span className="text-[11px] font-mono text-[#8C8275]">
                    Passing Threshold: {activeQuiz.passingScore}%
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#22201D]">
                  {activeQuiz.title}
                </h2>
              </div>
              <button
                onClick={handleCloseQuiz}
                className="p-1.5 rounded border border-[#C9BDAA] hover:bg-[#EDE1CE] hover:border-[#D87535] text-[#655F55] hover:text-[#22201D] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Question Number Ribbon */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-3 bg-[#EDE1CE] border-b border-[#C9BDAA]">
              {activeQuiz.questions.map((q, idx) => {
                const isCurrent = currentQuestionIndex === idx;
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const rev = submissionResult?.review?.find((r) => r.questionId === q.id);

                let badgeColor = 'bg-[#FAF5EB] text-[#8C8275] border-[#C9BDAA]';
                if (submissionResult) {
                  badgeColor = rev?.isCorrect
                    ? 'bg-[#87945B]/20 text-[#87945B] border-[#87945B]/50'
                    : 'bg-[#B95D32]/20 text-[#B95D32] border-[#B95D32]/50';
                } else if (isCurrent) {
                  badgeColor = 'bg-[#D87535] text-[#FAF5EB] border-[#D87535] font-bold shadow-sm';
                } else if (isAnswered) {
                  badgeColor = 'bg-[#87945B]/15 text-[#87945B] border-[#87945B]/40';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-7 rounded text-[11px] font-mono border flex items-center justify-center cursor-pointer transition-all shrink-0 ${badgeColor}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Question Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {(() => {
                const q = activeQuiz.questions[currentQuestionIndex];
                if (!q) return null;
                const selectedOpt = selectedAnswers[q.id];
                const rev = submissionResult?.review?.find((r) => r.questionId === q.id);

                return (
                  <div className="space-y-5">
                    {/* Question Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#8C8275]">
                        <span>
                          QUESTION {currentQuestionIndex + 1} OF {activeQuiz.questions.length}
                        </span>
                        <span className="bg-[#EDE1CE] border border-[#C9BDAA] px-2 py-0.5 rounded text-[#D87535] font-semibold">
                          {q.points || 10} Points
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#22201D] leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    {/* Optional Code Snippet — dark instrument panel */}
                    {q.codeSnippet && (
                      <div className="p-3.5 rounded bg-[#242522] border border-[#3A3A34] font-mono text-xs text-[#C8DE72] overflow-x-auto">
                        <pre><code>{q.codeSnippet}</code></pre>
                      </div>
                    )}

                    {/* Multiple-Choice Options */}
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        let optionStyle = 'bg-[#FAF5EB] border-[#C9BDAA] text-[#22201D] hover:border-[#D87535] hover:bg-[#EDE1CE]';

                        if (submissionResult) {
                          if (optIdx === rev?.correctOptionIndex) {
                            optionStyle = 'bg-[#87945B]/15 border-[#87945B] text-[#22201D] ring-1 ring-[#87945B]';
                          } else if (isChosen && !rev?.isCorrect) {
                            optionStyle = 'bg-[#B95D32]/12 border-[#B95D32] text-[#B95D32] ring-1 ring-[#B95D32]';
                          } else {
                            optionStyle = 'opacity-50 bg-[#FAF5EB] border-[#C9BDAA] text-[#8C8275]';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-[#EDE1CE] border-[#D87535] text-[#22201D] ring-1 ring-[#D87535]';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`p-3.5 rounded border transition-all cursor-pointer flex items-center justify-between text-xs font-mono ${optionStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded bg-[#EDE1CE] border border-[#C9BDAA] flex items-center justify-center font-bold text-[11px] text-[#D87535] shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="font-sans text-sm">{opt}</span>
                            </div>
                            {submissionResult && optIdx === rev?.correctOptionIndex && (
                              <CheckCircle2 className="w-4 h-4 text-[#87945B] shrink-0 ml-2" />
                            )}
                            {submissionResult && isChosen && !rev?.isCorrect && (
                              <XCircle className="w-4 h-4 text-[#B95D32] shrink-0 ml-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Post-Submission Explanation */}
                    {submissionResult && rev && (
                      <div
                        className={`p-4 rounded border space-y-1.5 ${
                          rev.isCorrect
                            ? 'bg-[#87945B]/10 border-[#87945B]/30'
                            : 'bg-[#B95D32]/10 border-[#B95D32]/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs font-mono font-bold">
                          {rev.isCorrect ? (
                            <span className="text-[#87945B] flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Correct (+{rev.pointsEarned} pts)
                            </span>
                          ) : (
                            <span className="text-[#B95D32] flex items-center gap-1">
                              <XCircle className="w-4 h-4" /> Incorrect (0 pts)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#655F55] leading-relaxed font-sans">
                          {rev.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Results Scorecard Bar (if submitted) */}
            {submissionResult && (
              <div className="p-4 bg-[#EDE1CE] border-t border-[#C9BDAA] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={submissionResult.passed ? 'olive' : 'terracotta'}>
                      {submissionResult.passed ? 'PASSED COMPETENCY' : 'FAILED THRESHOLD'}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-[#22201D]">
                      Score: {submissionResult.percentage}% ({submissionResult.score}/{submissionResult.totalPoints} pts)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSubmissionResult(null);
                      setSelectedAnswers({});
                      setCurrentQuestionIndex(0);
                    }}
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Retake Quiz
                  </Button>
                  <Button size="sm" variant="primary" onClick={handleCloseQuiz}>
                    Finish Review
                  </Button>
                </div>
              </div>
            )}

            {/* Bottom Navigation & Submit Bar (during test) */}
            {!submissionResult && (
              <div className="p-4 border-t border-[#C9BDAA] bg-[#EDE1CE] flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                          Math.min(activeQuiz.questions.length - 1, prev + 1)
                        )
                      }
                      className="flex items-center gap-1.5"
                    >
                      Next
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="accent"
                      disabled={submitting}
                      onClick={handleSubmitQuiz}
                      className="flex items-center gap-1.5 font-bold"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {submitting ? 'Evaluating...' : 'Submit Assessment'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
