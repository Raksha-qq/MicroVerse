import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, XCircle, AlertCircle, RefreshCw, Send, HelpCircle } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';

export function ChapterQuiz({ chapterId, quizMetadata, onQuizPassed }) {
  const { user, openAuth } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!chapterId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setAnswers({});

    quizService
      .getQuizByChapter(chapterId)
      .then((res) => {
        setQuiz(res.data);
      })
      .catch((err) => {
        console.warn('No assessment found or error:', err.message);
        setError('No assessment questions available for this unit yet.');
      })
      .finally(() => setLoading(false));
  }, [chapterId]);

  const handleSelectOption = (questionId, optionIndex) => {
    if (result) return; // Prevent changing after submission
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      openAuth('login');
      return;
    }

    if (!quiz || !quiz.id) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await quizService.submitQuiz(quiz.id, answers);
      setResult(res.data);
      if (res.data?.passed && onQuizPassed) {
        onQuizPassed();
      }
    } catch (err) {
      setError(err.message || 'Error submitting assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setAnswers({});
  };

  if (loading) {
    return (
      <div className="p-8 rounded-2xl bg-[#0B1220] border border-[#192B40] text-center font-mono text-xs text-[#8FA6BC] space-y-2">
        <RefreshCw className="w-5 h-5 mx-auto animate-spin text-[#55C7FF]" />
        <div>RETRIEVING KNOWLEDGE-CHECK BLUEPRINTS...</div>
      </div>
    );
  }

  if (error || !quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-[#0B1220] border border-[#192B40] flex items-center justify-between text-xs font-mono text-[#8FA6BC]">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#55C7FF]" />
          <span>Curriculum assessment under calibration for this unit.</span>
        </div>
      </div>
    );
  }

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="rounded-2xl bg-[#0B1220] border border-[#192B40] p-6 space-y-6 shadow-2xl">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#192B40]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FBBF24]">
            <Award className="w-4 h-4" />
            <span>KNOWLEDGE-CHECK ASSESSMENT</span>
          </div>
          <h3 className="font-heading font-bold text-xl text-[#EAF5FF] mt-0.5">
            {quiz.title}
          </h3>
          <p className="text-xs text-[#8FA6BC] mt-0.5">
            {quiz.description || 'Validate your architectural and firmware comprehension.'}
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <span className="p-2 rounded bg-[#111E30] border border-[#192B40] text-[#8FA6BC]">
            Passing Score: <strong className="text-[#55C7FF]">{quiz.passingScore}%</strong>
          </span>
          <span className="p-2 rounded bg-[#111E30] border border-[#192B40] text-[#8FA6BC]">
            Questions: <strong className="text-[#EAF5FF]">{quiz.questions.length}</strong>
          </span>
        </div>
      </div>

      {/* Result Banner if submitted */}
      {result && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            result.passed
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {result.passed ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="font-heading font-bold text-base text-[#EAF5FF]">
                {result.passed ? 'Assessment Passed! Silicon Proficiency Verified.' : 'Assessment Unsuccessful. Review Concepts.'}
              </div>
              <div className="text-xs font-mono mt-0.5">
                Earned: <strong>{result.score}</strong> / {result.totalPoints} Points ({result.percentage}%)
                {' • '}
                Threshold: {result.passingScore}%
              </div>
            </div>
          </div>

          <button
            onClick={handleRetake}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B1220] border border-current text-xs font-mono font-bold transition-all hover:bg-white/10 cursor-pointer self-start sm:self-center"
          >
            <RefreshCw className="w-3.5 h-3.5" /> RETAKE
          </button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {quiz.questions.map((q, qIdx) => {
          const selectedOption = answers[q.id];
          const reviewItem = result?.review?.find((r) => r.questionId === q.id);
          const options = Array.isArray(q.options)
            ? q.options
            : typeof q.options === 'string'
            ? JSON.parse(q.options)
            : [];

          return (
            <div
              key={q.id}
              className="p-4 sm:p-5 rounded-xl bg-[#080D17] border border-[#192B40] space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-heading font-bold text-sm text-[#EAF5FF] flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded bg-[#111E30] border border-[#55C7FF]/40 text-[#55C7FF] font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <span>{q.question}</span>
                </div>
                <span className="text-[10px] font-mono text-[#8FA6BC] shrink-0">
                  {q.points} PTS
                </span>
              </div>

              {/* Code Snippet if present */}
              {q.codeSnippet && (
                <div className="p-3 rounded-lg bg-[#0B1220] border border-[#192B40] font-mono text-xs text-[#A5E3FF] overflow-x-auto leading-relaxed">
                  <pre>{q.codeSnippet}</pre>
                </div>
              )}

              {/* Options */}
              <div className="space-y-2 pt-1">
                {options.map((optText, oIdx) => {
                  const isChecked = selectedOption === oIdx;
                  const isCorrect = reviewItem && reviewItem.correctOptionIndex === oIdx;
                  const isWrongSelected =
                    reviewItem && !reviewItem.isCorrect && isChecked;

                  let borderClass = 'border-[#192B40] hover:border-[#55C7FF]/40';
                  let bgClass = 'bg-[#0B1220] text-[#8FA6BC]';

                  if (isChecked && !result) {
                    borderClass = 'border-[#55C7FF] shadow-[0_0_10px_rgba(85,199,255,0.2)]';
                    bgClass = 'bg-[#111E30] text-[#EAF5FF]';
                  }

                  if (result) {
                    if (isCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold';
                    } else if (isWrongSelected) {
                      borderClass = 'border-rose-500 bg-rose-500/15 text-rose-300';
                    }
                  }

                  return (
                    <label
                      key={oIdx}
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      className={`p-3 rounded-lg border text-xs flex items-start gap-3 cursor-pointer transition-all ${borderClass} ${bgClass}`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={isChecked}
                        onChange={() => {}}
                        disabled={!!result}
                        className="mt-0.5 accent-[#55C7FF] cursor-pointer"
                      />
                      <span className="flex-1 leading-snug">{optText}</span>
                    </label>
                  );
                })}
              </div>

              {/* Post-submit Explanation */}
              {reviewItem && (
                <div
                  className={`p-3 rounded-lg text-xs leading-relaxed mt-2 border ${
                    reviewItem.isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <strong>Explanation:</strong> {reviewItem.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      {!result && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#192B40]">
          <div className="text-xs font-mono text-[#8FA6BC]">
            {!user ? (
              <span className="text-amber-400">Sign in to save assessment progress and earn badges.</span>
            ) : !allAnswered ? (
              <span>Answer all questions above to submit for grading.</span>
            ) : (
              <span className="text-emerald-400">All questions answered. Ready for evaluation.</span>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || (!user && false) || (!allAnswered && false)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#55C7FF] hover:bg-[#A5E3FF] text-[#0B1220] font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(85,199,255,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> EVALUATING...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> SUBMIT ASSESSMENT
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

