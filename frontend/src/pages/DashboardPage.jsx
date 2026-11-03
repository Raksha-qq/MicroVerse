import React, { useState, useEffect } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Layers,
  Zap,
  Clock,
  CheckCircle2,
  Bookmark,
  HardDrive,
  FileText,
  ArrowRight,
  Shield,
  HelpCircle,
  Play,
  CheckSquare,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../hooks/useAuth';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    dashboardService
      .getDashboardStats()
      .then((res) => {
        if (res.success && res.stats) {
          setStats(res.stats);
        } else {
          setStats(null);
        }
      })
      .catch((err) => {
        console.error('Failed to load dashboard telemetry:', err);
        setError('Failed to retrieve real-time engineer telemetry from PostgreSQL.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="py-16 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#55C7FF]/10 border border-[#55C7FF]/30 mx-auto flex items-center justify-center text-[#55C7FF]">
          <Activity className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold text-[#EAF5FF]">
            Engineer Laboratory Dashboard
          </h1>
          <p className="text-sm text-[#8FA6BC] leading-relaxed">
            Sign in to track real-time curriculum progress, manage bookmarked silicon targets,
            persist simulation experiment states, and view quiz assessments.
          </p>
        </div>
        <div className="pt-2">
          <Button variant="primary" size="lg" onClick={() => openAuth('login')} className="font-bold">
            <Zap className="w-4 h-4 mr-1.5" />
            Authenticate Session
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-24 text-center text-xs font-mono text-[#8FA6BC] space-y-3">
        <Activity className="w-8 h-8 mx-auto text-[#55C7FF] animate-spin" />
        <div>INTERROGATING REAL-TIME ENGINEER TELEMETRY...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center text-xs font-mono text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/30 space-y-3">
        <AlertTriangle className="w-8 h-8 mx-auto text-rose-400" />
        <div>{error || 'Unable to parse dashboard state from database.'}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-[#192B40] text-[#55C7FF] hover:bg-[#55C7FF] hover:text-[#0B1220] transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Welcome Section */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[#192B40] bg-[#111E30]/80 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <Badge variant="cyan">ENGINEER PROFILE</Badge>
            {user.role === 'ADMIN' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-0.5 rounded border border-[#F59E0B]/30">
                <Shield className="w-3 h-3" />
                SYSTEM ADMINISTRATOR
              </span>
            )}
            <span className="text-xs font-mono text-[#8FA6BC]">
              Member since {new Date(stats.user?.createdAt || user.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#EAF5FF]">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#8FA6BC] max-w-xl leading-relaxed">
            {stats.user?.bio ||
              'Embedded systems researcher and robotics engineer advancing silicon hardware competencies.'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          {user.role === 'ADMIN' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 font-bold border-[#F59E0B]/40 text-[#F59E0B] hover:bg-[#F59E0B]/10"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Panel
            </Button>
          )}

          {stats.nextChapter && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/discover#${stats.nextChapter.slug}`)}
              className="flex items-center gap-1.5 font-bold"
            >
              <Play className="w-3.5 h-3.5" />
              Next Chapter
            </Button>
          )}
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chapters Progress */}
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8FA6BC]">
            <span>CHAPTERS COMPLETED</span>
            <BookOpen className="w-3.5 h-3.5 text-[#55C7FF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-[#EAF5FF]">
            {stats.completedCount} <span className="text-sm font-normal text-[#8FA6BC]">/ {stats.totalChapters}</span>
          </div>
          <div className="w-full h-1.5 bg-[#0B1220] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#55C7FF] rounded-full transition-all duration-500"
              style={{ width: `${stats.progressPercentage}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-[#55C7FF] text-right font-bold">
            {stats.progressPercentage}% Completed
          </div>
        </Card>

        {/* Lessons Progress */}
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8FA6BC]">
            <span>LESSONS MASTERED</span>
            <Layers className="w-3.5 h-3.5 text-[#A5E3FF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-[#EAF5FF]">
            {stats.completedLessonsCount} <span className="text-sm font-normal text-[#8FA6BC]">/ {stats.totalLessons}</span>
          </div>
          <div className="w-full h-1.5 bg-[#0B1220] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#A5E3FF] rounded-full transition-all duration-500"
              style={{ width: `${stats.lessonPercentage}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-[#A5E3FF] text-right font-bold">
            {stats.lessonPercentage}% Completed
          </div>
        </Card>

        {/* Quiz Competency */}
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8FA6BC]">
            <span>QUIZ PASS RATE</span>
            <CheckSquare className="w-3.5 h-3.5 text-[#10B981]" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-[#10B981]">
            {stats.quizStats.averageScore}%
          </div>
          <div className="text-[10px] font-mono text-[#8FA6BC] flex justify-between">
            <span>{stats.quizStats.passedCount} Passed</span>
            <span>{stats.quizStats.totalAttempts} Attempts</span>
          </div>
          <div className="text-[10px] font-mono text-[#10B981] pt-1 border-t border-[#192B40]">
            Average Assessment Score
          </div>
        </Card>

        {/* Lab & Research Activity */}
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8FA6BC]">
            <span>EXPERIMENTS & NOTES</span>
            <HardDrive className="w-3.5 h-3.5 text-[#FBBF24]" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-[#EAF5FF]">
            {stats.savedExperiments.length + stats.researchNotes.length}
          </div>
          <div className="text-[10px] font-mono text-[#8FA6BC] flex justify-between">
            <span>{stats.savedExperiments.length} Experiments</span>
            <span>{stats.researchNotes.length} Notes</span>
          </div>
          <div className="text-[10px] font-mono text-[#FBBF24] pt-1 border-t border-[#192B40]">
            {stats.bookmarks.length} Bookmarked Silicon Targets
          </div>
        </Card>
      </div>

      {/* 3. Main Dashboard Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recently Visited Lessons (Resume Incomplete) */}
          <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#55C7FF]" />
                <h3 className="font-heading text-lg font-bold text-[#EAF5FF]">
                  Recently Visited Lessons & Resume
                </h3>
              </div>
              <Link to="/lessons" className="text-xs font-mono text-[#55C7FF] hover:underline flex items-center gap-1">
                All Lessons <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {stats.recentlyVisitedLessons.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[#8FA6BC] bg-[#0B1220]/60 rounded-xl border border-[#192B40]">
                No recently visited lessons logged. Jump into the Discover curriculum to begin.
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.recentlyVisitedLessons.map((l) => (
                  <div
                    key={l.id}
                    className="p-3.5 rounded-xl border border-[#192B40] bg-[#0B1220] flex items-center justify-between gap-3 text-xs font-mono hover:border-[#55C7FF]/40 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#55C7FF] font-bold">
                          LESSON {l.lessonNumber}
                        </span>
                        <span className="text-[10px] text-[#8FA6BC]">•</span>
                        <span className="text-[10px] text-[#8FA6BC] truncate">{l.chapterTitle}</span>
                        {l.isCompleted && (
                          <span className="text-[9px] text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/30">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-[#EAF5FF] truncate text-sm">{l.title}</div>
                    </div>

                    <Button
                      variant={l.isCompleted ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => navigate(`/lessons?slug=${l.slug}`)}
                      className="shrink-0 flex items-center gap-1"
                    >
                      {l.isCompleted ? 'Review' : 'Resume'}
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quiz Performance & Recent Score History */}
          <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#10B981]" />
                <h3 className="font-heading text-lg font-bold text-[#EAF5FF]">
                  Quiz Assessment Performance History
                </h3>
              </div>
              <Link to="/quizzes" className="text-xs font-mono text-[#55C7FF] hover:underline flex items-center gap-1">
                Take Assessments <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {stats.recentAttempts.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[#8FA6BC] bg-[#0B1220]/60 rounded-xl border border-[#192B40]">
                No quiz attempts on record. Test your engineering competency in the Quizzes section.
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentAttempts.slice(0, 5).map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl border border-[#192B40] bg-[#0B1220] flex items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div>
                      <div className="font-bold text-[#EAF5FF]">{att.title}</div>
                      <div className="text-[10px] text-[#8FA6BC]">
                        {att.chapterTitle} • {new Date(att.attemptedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`font-bold ${att.passed ? 'text-[#10B981]' : 'text-rose-400'}`}>
                          {att.percentage}% ({att.score}/{att.totalPoints} pts)
                        </div>
                        <div className="text-[10px] text-[#8FA6BC]">
                          {att.passed ? 'PASSED' : 'RETAKE SUGGESTED'}
                        </div>
                      </div>
                      <Badge variant={att.passed ? 'emerald' : 'rose'}>
                        {att.passed ? 'PASS' : 'FAIL'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Experiments (Milestone 6) */}
          <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#FBBF24]" />
                <h3 className="font-heading text-lg font-bold text-[#EAF5FF]">
                  Saved Virtual Experiment Configurations
                </h3>
              </div>
              <Link to="/experiment" className="text-xs font-mono text-[#55C7FF] hover:underline flex items-center gap-1">
                Open Experiment Bench <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {stats.savedExperiments.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[#8FA6BC] bg-[#0B1220]/60 rounded-xl border border-[#192B40]">
                No saved experiment benchmarks yet. Tune a PWM, Signal, or Sonar simulation in the Lab and save it.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stats.savedExperiments.slice(0, 4).map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => navigate('/experiment')}
                    className="p-3.5 rounded-xl border border-[#192B40] bg-[#0B1220] hover:border-[#55C7FF]/40 transition-colors cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="cyan">{exp.experimentType}</Badge>
                      <span className="text-[10px] font-mono text-[#8FA6BC]">
                        {new Date(exp.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-[#EAF5FF] truncate">{exp.title}</div>
                    {exp.description && (
                      <p className="text-[11px] text-[#8FA6BC] line-clamp-1">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3 width): Bookmarks, Research Notes & Recommendations */}
        <div className="space-y-6">
          {/* Recommended Next Learning Unit */}
          {stats.nextChapter && (
            <div className="p-5 rounded-2xl border border-[#55C7FF]/40 bg-[#55C7FF]/5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] font-bold uppercase tracking-wider">
                <Play className="w-3.5 h-3.5" />
                Recommended Next Unit
              </div>
              <div>
                <div className="text-[10px] font-mono text-[#8FA6BC] uppercase">
                  CHAPTER {String(stats.nextChapter.chapterNumber).padStart(2, '0')} • {stats.nextChapter.level}
                </div>
                <h4 className="font-heading text-base font-bold text-[#EAF5FF] mt-0.5">
                  {stats.nextChapter.title}
                </h4>
                <p className="text-xs text-[#8FA6BC] mt-1 line-clamp-2">
                  {stats.nextChapter.summary}
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/discover#${stats.nextChapter.slug}`)}
                className="w-full flex items-center justify-center gap-1 font-bold"
              >
                Start Chapter
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {/* Bookmarked Silicon Targets (Part D) */}
          <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider font-semibold">
                <Bookmark className="w-3.5 h-3.5" />
                Saved Controllers ({stats.bookmarks.length})
              </div>
              <Link to="/archive" className="text-[11px] font-mono text-[#8FA6BC] hover:text-[#EAF5FF]">
                Browse All
              </Link>
            </div>

            {stats.bookmarks.length === 0 ? (
              <div className="p-4 text-center text-xs font-mono text-[#8FA6BC] bg-[#0B1220]/60 rounded-xl border border-[#192B40]">
                No controllers bookmarked yet. Click the bookmark ribbon on any chip in the Silicon Archive.
              </div>
            ) : (
              <div className="space-y-2">
                {stats.bookmarks.map((bm) => {
                  const ctrl = bm.controller;
                  if (!ctrl) return null;
                  return (
                    <div
                      key={bm.id}
                      onClick={() => navigate(`/archive?mcu=${ctrl.slug || ctrl.id}`)}
                      className="p-2.5 rounded-lg border border-[#192B40] bg-[#0B1220] hover:border-[#55C7FF]/40 transition-colors cursor-pointer flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <div className="font-bold text-[#EAF5FF]">{ctrl.name}</div>
                        <div className="text-[10px] text-[#8FA6BC]">
                          {ctrl.family} • {ctrl.maxClockSpeedMHz} MHz
                        </div>
                      </div>
                      <Badge variant="cyan">{ctrl.bitWidth}-BIT</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Research Notes Preview (Part E) */}
          <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-[#A5E3FF] uppercase tracking-wider font-semibold">
                <FileText className="w-3.5 h-3.5" />
                Research Logbook ({stats.researchNotes.length})
              </div>
              <Link to="/research" className="text-[11px] font-mono text-[#8FA6BC] hover:text-[#EAF5FF]">
                Open Notes
              </Link>
            </div>

            {stats.researchNotes.length === 0 ? (
              <div className="p-4 text-center text-xs font-mono text-[#8FA6BC] bg-[#0B1220]/60 rounded-xl border border-[#192B40]">
                No technical notes logged. Use the Research Notebook to record errata and lab findings.
              </div>
            ) : (
              <div className="space-y-2">
                {stats.researchNotes.slice(0, 3).map((note) => (
                  <div
                    key={note.id}
                    onClick={() => navigate('/research')}
                    className="p-2.5 rounded-lg border border-[#192B40] bg-[#0B1220] hover:border-[#A5E3FF]/40 transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#55C7FF] uppercase">{note.category}</span>
                      <span className="text-[10px] font-mono text-[#8FA6BC]">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-[#EAF5FF] truncate">{note.title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
