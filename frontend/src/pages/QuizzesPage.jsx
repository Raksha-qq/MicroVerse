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
  ChevronRight
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
            <CheckSquare className="w-3.5 h-3.5" />
            Engineering Competency Assessments
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#EAF5FF]">
            Silicon Knowledge & Quiz System
          </h1>
          <p className="text-sm text-[#8FA6BC] mt-1 max-w-2xl leading-relaxed">
            Validate mastery of microcontroller architectures, register manipulations, memory hierarchies,
            and real-time robotics firmware. Graded securely on the backend.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#111E30] border border-[#192B40] self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'catalog'
              ? 'bg-[#55C7FF] text-[#0B1220] font-bold shadow-[0_0_10px_rgba(85,199,255,0.3)]'
              : 'text-[#8FA6BC] hover:text-[#EAF5FF]'
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
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'history'
              ? 'bg-[#55C7FF] text-[#0B1220] font-bold shadow-[0_0_10px_rgba(85,199,255,0.3)]'
              : 'text-[#8FA6BC] hover:text-[#EAF5FF]'
              }`}
          >
            <History className="w-3.5 h-3.5" />
            My Attempt History ({attempts.length})
          </button>
        </div>
      </div>

      {/* Main Catalog View */}
      {activeTab === 'catalog' && (
        <>
          {loading ? (
            <div className="py-20 text-center text-xs font-mono text-[#8FA6BC] space-y-3">
              <CheckSquare className="w-8 h-8 mx-auto text-[#55C7FF] animate-spin" />
              <div>LOADING CURRICULUM ASSESSMENTS...</div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-xs font-mono text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/30">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {quizzes.map((q) => (
                <Card key={q.id} className="flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="cyan">
                        CHAPTER {String(q.chapter?.chapterNumber).padStart(2, '0')}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs font-mono text-[#FBBF24]">
                        <Award className="w-3.5 h-3.5" />
                        <span>Pass: {q.passingScore}%</span>
                      </div>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-[#EAF5FF] line-clamp-2">
                      {q.title}
                    </h3>

                    <p className="text-xs text-[#8FA6BC] line-clamp-2 leading-relaxed">
                      {q.description || 'Comprehensive multiple-choice assessment of core concepts.'}
                    </p>

                    {/* Attempts Status */}
                    {q.attemptsCount > 0 && (
                      <div className="p-2 rounded-lg bg-[#0B1220] border border-[#192B40] text-[11px] font-mono flex items-center justify-between">
                        <span className="text-[#8FA6BC]">Best Score:</span>
                        <span className={`font-bold ${q.passed ? 'text-[#10B981]' : 'text-amber-400'}`}>
                          {q.bestScore}% {q.passed ? '(PASSED)' : '(INCOMPLETE)'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#192B40] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8FA6BC]">
                      {q.questionCount} Question{q.questionCount === 1 ? '' : 's'}
                    </span>
                    <Button
                      size="sm"
                      variant={q.passed ? 'outline' : 'primary'}
                      onClick={() => startQuiz(q.id)}
                      className="flex items-center gap-1.5 font-bold"
                    >
                      {q.passed ? 'Retake Assessment' : 'Start Assessment'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Attempt History View */}
      {activeTab === 'history' && (
        <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#192B40] pb-3">
            <h3 className="font-heading text-lg font-bold text-[#EAF5FF]">
              Assessment History & Verifications
            </h3>
            <span className="text-xs font-mono text-[#55C7FF]">{attempts.length} Total Submissions</span>
          </div>

          {attempts.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[#8FA6BC] bg-[#0B1220]/60 rounded-xl border border-[#192B40]">
              No previous attempts logged. Complete an assessment to record your verified score.
            </div>
          ) : (
            <div className="space-y-2.5">
              {attempts.map((att) => {
                const pct = Math.round((att.score / att.totalPoints) * 100);
                return (
                  <div
                    key={att.id}
                    className="p-4 rounded-xl border border-[#192B40] bg-[#0B1220] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={att.passed ? 'emerald' : 'rose'}>
                          {att.passed ? 'PASSED' : 'FAILED'}
                        </Badge>
                        <span className="font-bold text-[#EAF5FF] text-sm">{att.quiz?.title}</span>
                      </div>
                      <div className="text-[11px] text-[#8FA6BC]">
                        Chapter {att.quiz?.chapter?.chapterNumber}: {att.quiz?.chapter?.title} •{' '}
                        {new Date(att.attemptedAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className={`font-bold text-base ${att.passed ? 'text-[#10B981]' : 'text-rose-400'}`}>
                          {pct}%
                        </div>
                        <div className="text-[10px] text-[#8FA6BC]">
                          {att.score} / {att.totalPoints} points
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

      {/* Interactive Quiz Modal View */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0B1220]/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#111E30] border border-[#192B40] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Top Header */}
            <div className="p-5 border-b border-[#192B40] bg-[#0B1220]/90 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="cyan">ASSESSMENT IN PROGRESS</Badge>
                  <span className="text-xs font-mono text-[#8FA6BC]">
                    Passing Threshold: {activeQuiz.passingScore}%
                  </span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-[#EAF5FF]">
                  {activeQuiz.title}
                </h2>
              </div>
              <button
                onClick={handleCloseQuiz}
                className="p-1.5 rounded-lg bg-[#192B40]/50 hover:bg-[#192B40] text-[#8FA6BC] hover:text-[#EAF5FF] font-mono text-xs"
              >
                Close
              </button>
            </div>

            {/* Questions Number Ribbon */}
            <div className="flex items-center gap-2 overflow-x-auto p-3 bg-[#0B1220] border-b border-[#192B40]/70">
              {activeQuiz.questions.map((q, idx) => {
                const isCurrent = currentQuestionIndex === idx;
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const rev = submissionResult?.review?.find((r) => r.questionId === q.id);

                let badgeColor = 'bg-[#111E30] text-[#8FA6BC] border-[#192B40]';
                if (submissionResult) {
                  badgeColor = rev?.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/50';
                } else if (isCurrent) {
                  badgeColor = 'bg-[#55C7FF] text-[#0B1220] font-bold shadow-[0_0_10px_rgba(85,199,255,0.4)]';
                } else if (isAnswered) {
                  badgeColor = 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-mono border flex items-center justify-center cursor-pointer transition-all shrink-0 ${badgeColor}`}
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
                  <div className="space-y-5 animate-fadeIn">
                    {/* Question Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-[#8FA6BC]">
                        <span>
                          QUESTION {currentQuestionIndex + 1} OF {activeQuiz.questions.length}
                        </span>
                        <span>{q.points || 10} Points</span>
                      </div>
                      <h3 className="font-heading text-lg sm:text-xl font-bold text-[#EAF5FF] leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    {/* Optional Code Snippet */}
                    {q.codeSnippet && (
                      <div className="p-3.5 rounded-xl bg-[#0B1220] border border-[#192B40] font-mono text-xs text-[#55C7FF] overflow-x-auto">
                        <pre><code>{q.codeSnippet}</code></pre>
                      </div>
                    )}

                    {/* Multiple-Choice Options */}
                    <div className="space-y-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        let optionStyle = 'bg-[#0B1220] border-[#192B40] text-[#EAF5FF] hover:border-[#55C7FF]/50';

                        if (submissionResult) {
                          if (optIdx === rev?.correctOptionIndex) {
                            optionStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500';
                          } else if (isChosen && !rev?.isCorrect) {
                            optionStyle = 'bg-rose-500/15 border-rose-500 text-rose-300 ring-1 ring-rose-500';
                          } else {
                            optionStyle = 'opacity-50 bg-[#0B1220] border-[#192B40] text-[#8FA6BC]';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-[#192B40] border-[#55C7FF] text-[#55C7FF] ring-1 ring-[#55C7FF] shadow-[0_0_12px_rgba(85,199,255,0.2)]';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-mono ${optionStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-md bg-[#111E30] border border-[#192B40] flex items-center justify-center font-bold text-[11px]">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>
                            {submissionResult && optIdx === rev?.correctOptionIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                            )}
                            {submissionResult && isChosen && !rev?.isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Post-Submission Explanation */}
                    {submissionResult && rev && (
                      <div
                        className={`p-4 rounded-xl border space-y-1.5 animate-fadeIn ${rev.isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-rose-500/10 border-rose-500/30'
                          }`}
                      >
                        <div className="flex items-center gap-2 text-xs font-mono font-bold">
                          {rev.isCorrect ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Correct (+{rev.pointsEarned} pts)
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">
                              <XCircle className="w-4 h-4" /> Incorrect (0 pts)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#EAF5FF] leading-relaxed">
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
              <div className="p-4 bg-[#0B1220] border-t border-[#192B40] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={submissionResult.passed ? 'emerald' : 'rose'}>
                      {submissionResult.passed ? 'PASSED COMPETENCY' : 'FAILED THRESHOLD'}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-[#EAF5FF]">
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
              <div className="p-4 border-t border-[#192B40] bg-[#0B1220] flex items-center justify-between">
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
                      variant="primary"
                      disabled={submitting}
                      onClick={handleSubmitQuiz}
                      className="flex items-center gap-1.5 font-bold bg-emerald-500 hover:bg-emerald-400 text-[#0B1220]"
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
