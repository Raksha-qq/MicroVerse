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
      <div className="py-16 max-w-2xl mx-auto text-center space-y-8">
        {/* Not-authenticated state */}
        <div className="w-16 h-16 rounded border border-[#C9BDAA] bg-[#FAF5EB] mx-auto flex items-center justify-center text-[#D87535] shadow-sm">
          <Activity className="w-8 h-8" />
        </div>
        <div className="space-y-3">
          <div className="text-[10px] font-mono text-[#D87535] uppercase tracking-widest">
            MODULE / 06 // ENGINEER ACTIVITY LOG
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201D]">
            Engineer Laboratory
            <br />
            <span className="italic font-normal text-[#D87535]">Dashboard</span>
          </h1>
          <p className="text-sm text-[#655F55] leading-relaxed font-sans max-w-md mx-auto">
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
      <div className="py-24 text-center text-xs font-mono text-[#8C8275] space-y-3">
        <Activity className="w-8 h-8 mx-auto text-[#D87535] animate-spin" />
        <div className="tracking-widest uppercase">Interrogating Real-Time Engineer Telemetry...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center text-xs font-mono text-[#B95D32] bg-[#B95D32]/8 rounded border border-[#B95D32]/30 space-y-3">
        <AlertTriangle className="w-8 h-8 mx-auto text-[#B95D32]" />
        <div>{error || 'Unable to parse dashboard state from database.'}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded border border-[#C9BDAA] bg-[#EDE1CE] text-[#22201D] hover:border-[#D87535] transition-colors font-mono text-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 inline mr-1.5" />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Welcome / Identity Header */}
      <div className="border-b border-[#C9BDAA] pb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            {/* Technical header label */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-[10px] font-mono text-[#D87535] uppercase tracking-widest font-semibold">
                MODULE / 06 // ENGINEER ACTIVITY LOG
              </div>
              {user.role === 'ADMIN' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#D87535]/10 text-[#D87535] px-2 py-0.5 rounded border border-[#D87535]/30">
                  <Shield className="w-3 h-3" />
                  SYSTEM ADMINISTRATOR
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201D] tracking-tight">
              Welcome back,{' '}
              <span className="italic font-normal text-[#D87535]">{user.name}</span>
            </h1>
            <p className="text-sm text-[#655F55] max-w-xl leading-relaxed font-sans">
              {stats.user?.bio ||
                'Embedded systems researcher and robotics engineer advancing silicon hardware competencies.'}
            </p>
            <div className="text-[11px] font-mono text-[#8C8275]">
              // Member since {new Date(stats.user?.createdAt || user.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {user.role === 'ADMIN' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1.5 font-bold border-[#D87535]/40 text-[#D87535] hover:bg-[#D87535]/8"
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
      </div>

      {/* 2. Key Metrics — engineering data readout row */}
      <div>
        <div className="text-[9px] font-mono text-[#8C8275] uppercase tracking-widest mb-3">
          // PERFORMANCE TELEMETRY // REAL-TIME
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Chapters Progress */}
          <div className="bg-[#FAF5EB] border border-[#C9BDAA] rounded p-4 space-y-2 hover:border-[#D87535] transition-colors group">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8C8275] uppercase tracking-wider">
              <span>Chapters</span>
              <BookOpen className="w-3.5 h-3.5 text-[#D87535]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#22201D]">
              {stats.completedCount}{' '}
              <span className="text-sm font-sans font-normal text-[#8C8275]">/ {stats.totalChapters}</span>
            </div>
            <div className="w-full h-1 bg-[#EDE1CE] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D87535] rounded-full transition-all duration-700"
                style={{ width: `${stats.progressPercentage}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-[#D87535] text-right font-bold">
              {stats.progressPercentage}%
            </div>
          </div>

          {/* Lessons Progress */}
          <div className="bg-[#FAF5EB] border border-[#C9BDAA] rounded p-4 space-y-2 hover:border-[#71818B] transition-colors">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8C8275] uppercase tracking-wider">
              <span>Lessons</span>
              <Layers className="w-3.5 h-3.5 text-[#71818B]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#22201D]">
              {stats.completedLessonsCount}{' '}
              <span className="text-sm font-sans font-normal text-[#8C8275]">/ {stats.totalLessons}</span>
            </div>
            <div className="w-full h-1 bg-[#EDE1CE] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#71818B] rounded-full transition-all duration-700"
                style={{ width: `${stats.lessonPercentage}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-[#71818B] text-right font-bold">
              {stats.lessonPercentage}%
            </div>
          </div>

          {/* Quiz Competency */}
          <div className="bg-[#FAF5EB] border border-[#C9BDAA] rounded p-4 space-y-2 hover:border-[#87945B] transition-colors">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8C8275] uppercase tracking-wider">
              <span>Quiz Pass Rate</span>
              <CheckSquare className="w-3.5 h-3.5 text-[#87945B]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#87945B]">
              {stats.quizStats.averageScore}%
            </div>
            <div className="text-[10px] font-mono text-[#8C8275] flex justify-between">
              <span>{stats.quizStats.passedCount} Passed</span>
              <span>{stats.quizStats.totalAttempts} Attempts</span>
            </div>
            <div className="text-[10px] font-mono text-[#87945B] pt-1 border-t border-[#EDE1CE]">
              Average Assessment Score
            </div>
          </div>

          {/* Lab & Research Activity */}
          <div className="bg-[#FAF5EB] border border-[#C9BDAA] rounded p-4 space-y-2 hover:border-[#B95D32] transition-colors">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8C8275] uppercase tracking-wider">
              <span>Experiments & Notes</span>
              <HardDrive className="w-3.5 h-3.5 text-[#B95D32]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#22201D]">
              {stats.savedExperiments.length + stats.researchNotes.length}
            </div>
            <div className="text-[10px] font-mono text-[#8C8275] flex justify-between">
              <span>{stats.savedExperiments.length} Experiments</span>
              <span>{stats.researchNotes.length} Notes</span>
            </div>
            <div className="text-[10px] font-mono text-[#B95D32] pt-1 border-t border-[#EDE1CE]">
              {stats.bookmarks.length} Bookmarked Silicon Targets
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recently Visited Lessons */}
          <div className="bg-[#FAF5EB] border border-[#C9BDAA] rounded p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#C9BDAA] pb-3">
              <div>
                <div className="text-[10px] font-mono text-[#D87535] uppercase tracking-widest mb-0.5">
                  RECENT ACTIVITY
                </div>
                <h3 className="font-serif text-lg font-bold text-[#22201D]">
                  Recently Visited Lessons &amp; Resume
                </h3>
              </div>
              <Link to="/lessons" className="text-[11px] font-mono text-[#D87535] hover:underline flex items-center gap-1">
                All Lessons <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {stats.recentlyVisitedLessons.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[#8C8275] bg-[#EDE1CE] rounded border border-[#C9BDAA] border-dashed">
                No recently visited lessons logged. Jump into the Discover curriculum to begin.
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentlyVisitedLessons.map((l) => (
                  <div
                    key={l.id}
                    className="p-3 rounded border border-[#C9BDAA] bg-[#F5EBDD] flex items-center justify-between gap-3 text-xs font-mono hover:border-[#D87535] transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-[#D87535] font-bold">
                          LESSON {l.lessonNumber}
                        </span>
                        <span className="text-[10px] text-[#8C8275] truncate">{l.chapterTitle}</span>
                        {l.isCompleted && (
                          <span className="text-[9px] text-[#87945B] bg-[#87945B]/10 px-1.5 py-0.5 rounded border border-[#87945B]/30 font-semibold">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-[#22201D] truncate text-sm">{l.title}</div>
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

          {/* Saved Experiments */}
          <div className="bg-[#FAF5EB] border border-[#C9BDAA] rounded p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#C9BDAA] pb-3">
              <div>
                <div className="text-[10px] font-mono text-[#D87535] uppercase tracking-widest mb-0.5">
                  EXPERIMENT LOG
                </div>
                <h3 className="font-serif text-lg font-bold text-[#22201D]">
                  Saved Lab Experiments
                </h3>
              </div>
              <Link to="/lab" className="text-[11px] font-mono text-[#D87535] hover:underline flex items-center gap-1">
                Open Lab <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {stats.savedExperiments.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[#8C8275] bg-[#EDE1CE] rounded border border-[#C9BDAA] border-dashed">
                No experiments saved yet. Run a simulation in the Virtual Laboratory and save your state.
              </div>
            ) : (
              <div className="space-y-2">
                {stats.savedExperiments.slice(0, 5).map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => navigate('/lab')}
                    className="p-3 rounded border border-[#C9BDAA] bg-[#F5EBDD] flex items-center justify-between gap-3 text-xs font-mono hover:border-[#D87535] transition-colors cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="orange">{exp.experimentType}</Badge>
                        <span className="font-bold text-[#22201D]">{exp.name}</span>
                      </div>
                      <div className="text-[10px] text-[#8C8275]">
                        {new Date(exp.savedAt || exp.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <HardDrive className="w-4 h-4 text-[#C9BDAA] group-hover:text-[#D87535]" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          {/* Next Chapter Recommendation */}
          {stats.nextChapter && (
            <div className="bg-[#22201D] border border-[#38332E] rounded p-5 space-y-3 text-[#FAF5EB]">
              <div className="text-[10px] font-mono text-[#C8DE72] uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8DE72] animate-pulse" />
                NEXT UP
              </div>
              <div className="text-[11px] font-mono text-[#C9BDAA]">
                CH. {String(stats.nextChapter.chapterNumber).padStart(2, '0')} · {stats.nextChapter.level}
              </div>
              <h4 className="font-serif text-base font-bold text-[#FAF5EB]">
                {stats.nextChapter.title}
              </h4>
              <p className="text-xs text-[#C9BDAA] line-clamp-2 leading-relaxed font-sans">
                {stats.nextChapter.summary}
              </p>
              <Button
                variant="instrument"
                size="sm"
                onClick={() => navigate(`/discover#${stats.nextChapter.slug}`)}
                className="w-full flex items-center justify-center gap-1 font-bold"
              >
                Start Chapter
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {/* Bookmarked Silicon Targets */}
          <div className="bg-[#FAF5EB] border border-[#C9BDAA] rounded p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#C9BDAA] pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D87535] uppercase tracking-wider font-semibold">
                <Bookmark className="w-3.5 h-3.5" />
                Saved Controllers ({stats.bookmarks.length})
              </div>
              <Link to="/archive" className="text-[11px] font-mono text-[#8C8275] hover:text-[#D87535]">
                Browse All
              </Link>
            </div>

            {stats.bookmarks.length === 0 ? (
              <div className="p-4 text-center text-xs font-mono text-[#8C8275] bg-[#EDE1CE] rounded border border-[#C9BDAA] border-dashed">
                No controllers bookmarked yet. Click the bookmark ribbon on any chip in the Silicon Archive.
              </div>
            ) : (
              <div className="space-y-1.5">
                {stats.bookmarks.map((bm) => {
                  const ctrl = bm.controller;
                  if (!ctrl) return null;
                  return (
                    <div
                      key={bm.id}
                      onClick={() => navigate(`/archive?mcu=${ctrl.slug || ctrl.id}`)}
                      className="p-2.5 rounded border border-[#C9BDAA] bg-[#F5EBDD] hover:border-[#D87535] transition-colors cursor-pointer flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <div className="font-bold text-[#22201D]">{ctrl.name}</div>
                        <div className="text-[10px] text-[#8C8275]">
                          {ctrl.family} · {ctrl.maxClockSpeedMHz} MHz
                        </div>
                      </div>
                      <Badge variant="orange">{ctrl.bitWidth}-BIT</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Research Notes Preview */}
          <div className="bg-[#FAF5EB] border border-[#C9BDAA] rounded p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#C9BDAA] pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#71818B] uppercase tracking-wider font-semibold">
                <FileText className="w-3.5 h-3.5" />
                Research Logbook ({stats.researchNotes.length})
              </div>
              <Link to="/research" className="text-[11px] font-mono text-[#8C8275] hover:text-[#D87535]">
                Open Notes
              </Link>
            </div>

            {stats.researchNotes.length === 0 ? (
              <div className="p-4 text-center text-xs font-mono text-[#8C8275] bg-[#EDE1CE] rounded border border-[#C9BDAA] border-dashed">
                No technical notes logged. Use the Research Notebook to record errata and lab findings.
              </div>
            ) : (
              <div className="space-y-1.5">
                {stats.researchNotes.slice(0, 3).map((note) => (
                  <div
                    key={note.id}
                    onClick={() => navigate('/research')}
                    className="p-2.5 rounded border border-[#C9BDAA] bg-[#F5EBDD] hover:border-[#71818B] transition-colors cursor-pointer space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#71818B] uppercase font-semibold">{note.category}</span>
                      <span className="text-[10px] font-mono text-[#8C8275]">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-[#22201D] truncate">{note.title}</div>
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
