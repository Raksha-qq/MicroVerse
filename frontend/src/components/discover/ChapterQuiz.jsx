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
      <div className="p-8 rounded-2xl bg-[#FAF5EB] border border-[#C9BDAA] text-center font-mono text-xs text-[#655F55] space-y-2">
        <RefreshCw className="w-5 h-5 mx-auto animate-spin text-[#D87535]" />
        <div>RETRIEVING KNOWLEDGE-CHECK BLUEPRINTS...</div>
      </div>
    );
  }

  if (error || !quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-[#FAF5EB] border border-[#C9BDAA] flex items-center justify-between text-xs font-mono text-[#655F55]">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#D87535]" />
          <span>Curriculum assessment under calibration for this unit.</span>
        </div>
      </div>
    );
  }

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="rounded-2xl bg-[#FAF5EB] border border-[#C9BDAA] p-6 space-y-6 shadow-sm bg-drafting-grid-subtle">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#C9BDAA]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#D87535]">
            <Award className="w-4 h-4" />
            <span>KNOWLEDGE-CHECK ASSESSMENT</span>
          </div>
          <h3 className="font-serif font-bold text-xl text-[#22201D] mt-0.5">
            {quiz.title}
          </h3>
          <p className="text-xs text-[#655F55] mt-0.5 font-sans">
            {quiz.description || 'Validate your architectural and firmware comprehension.'}
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <span className="p-2 rounded-lg bg-[#EDE1CE] border border-[#C9BDAA] text-[#655F55]">
            Passing Score: <strong className="text-[#22201D]">{quiz.passingScore}%</strong>
          </span>
          <span className="p-2 rounded-lg bg-[#EDE1CE] border border-[#C9BDAA] text-[#655F55]">
            Questions: <strong className="text-[#22201D]">{quiz.questions.length}</strong>
          </span>
        </div>
      </div>

      {/* Result Banner if submitted */}
      {result && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            result.passed
              ? 'bg-[#87945B]/15 border-[#87945B] text-[#22201D]'
              : 'bg-[#B95D32]/15 border-[#B95D32] text-[#22201D]'
          }`}
        >
          <div className="flex items-center gap-3">
            {result.passed ? (
              <CheckCircle2 className="w-8 h-8 text-[#87945B] shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-[#B95D32] shrink-0" />
            )}
            <div>
              <div className="font-serif font-bold text-base text-[#22201D]">
                {result.passed ? 'Assessment Passed! Silicon Proficiency Verified.' : 'Assessment Unsuccessful. Review Concepts.'}
              </div>
              <div className="text-xs font-mono mt-0.5 text-[#655F55]">
                Earned: <strong className="text-[#22201D]">{result.score}</strong> / {result.totalPoints} Points ({result.percentage}%)
                {' • '}
                Threshold: {result.passingScore}%
              </div>
            </div>
          </div>

          <button
            onClick={handleRetake}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FAF5EB] border border-[#C9BDAA] text-xs font-mono font-bold text-[#22201D] transition-all hover:bg-[#EDE1CE] cursor-pointer self-start sm:self-center shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#D87535]" /> RETAKE
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
              className="p-4 sm:p-5 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA] space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-serif font-bold text-sm text-[#22201D] flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded bg-[#FAF5EB] border border-[#C9BDAA] text-[#D87535] font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <span>{q.question}</span>
                </div>
                <span className="text-[10px] font-mono text-[#8C8275] shrink-0 bg-[#EDE1CE] px-2 py-0.5 rounded border border-[#C9BDAA]">
                  {q.points} PTS
                </span>
              </div>

              {/* Code Snippet if present */}
              {q.codeSnippet && (
                <div className="p-3 rounded-lg bg-[#242522] border border-[#3D3A36] font-mono text-xs text-[#E5E5DF] overflow-x-auto leading-relaxed shadow-inner">
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

                  let borderClass = 'border-[#C9BDAA] hover:border-[#D87535]/70';
                  let bgClass = 'bg-[#FAF5EB] text-[#4A453E]';

                  if (isChecked && !result) {
                    borderClass = 'border-[#D87535] shadow-xs ring-1 ring-[#D87535]/40';
                    bgClass = 'bg-[#EDE1CE] text-[#22201D] font-medium';
                  }

                  if (result) {
                    if (isCorrect) {
                      borderClass = 'border-[#87945B] bg-[#87945B]/15 text-[#22201D] font-bold';
                    } else if (isWrongSelected) {
                      borderClass = 'border-[#B95D32] bg-[#B95D32]/15 text-[#22201D]';
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
                        className="mt-0.5 accent-[#D87535] cursor-pointer"
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
                      ? 'bg-[#87945B]/10 border-[#87945B]/40 text-[#22201D]'
                      : 'bg-[#EDE1CE] border-[#C9BDAA] text-[#655F55]'
                  }`}
                >
                  <strong className="text-[#22201D]">Explanation:</strong> {reviewItem.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      {!result && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#C9BDAA]">
          <div className="text-xs font-mono text-[#655F55]">
            {!user ? (
              <span className="text-[#B95D32]">Sign in to save assessment progress and earn badges.</span>
            ) : !allAnswered ? (
              <span>Answer all questions above to submit for grading.</span>
            ) : (
              <span className="text-[#87945B]">All questions answered. Ready for evaluation.</span>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#22201D] hover:bg-[#3D3A36] text-[#FAF5EB] font-mono text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D87535]" /> EVALUATING...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-[#D87535]" /> SUBMIT ASSESSMENT
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

