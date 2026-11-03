import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Cpu,
  BookOpen,
  CheckSquare,
  Activity,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Save,
  X,
  ExternalLink
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { adminService } from '../services/adminService';
import { controllerService } from '../services/controllerService';
import { quizService } from '../services/quizService';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'controllers' | 'curriculum' | 'quizzes'
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [controllers, setControllers] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search in users
  const [userSearch, setUserSearch] = useState('');

  // Modals
  const [isControllerModalOpen, setIsControllerModalOpen] = useState(false);
  const [editingController, setEditingController] = useState(null);
  const [controllerForm, setControllerForm] = useState({
    name: '',
    commonName: '',
    slug: '',
    family: 'ARM Cortex-M',
    architecture: 'ARMv7E-M',
    core: 'Cortex-M4',
    coreCount: 1,
    manufacturer: 'STMicroelectronics',
    bitWidth: 32,
    maxClockSpeedMHz: 84.0,
    flashKb: 512.0,
    sramKb: 96.0,
    operatingVoltageMin: 1.7,
    operatingVoltageMax: 3.6,
    logicLevel: '3.3V',
    gpioCount: 50,
    adcChannels: 16,
    adcResolutionBits: 12,
    timers: 11,
    pwmChannels: 6,
    uartCount: 3,
    spiCount: 4,
    i2cCount: 3,
    packageTypes: 'LQFP-64',
    description: '',
    architecturalNotes: '',
    datasheetUrl: '',
  });

  // Question Modal
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [questionForm, setQuestionForm] = useState({
    question: '',
    codeSnippet: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    points: 10,
    explanation: '',
  });

  // Load Admin Data
  const loadData = async () => {
    if (!user || user.role !== 'ADMIN') return;
    setLoading(true);
    setError(null);

    try {
      const [metricsRes, usersRes, controllersRes, chaptersRes, quizzesRes] = await Promise.all([
        adminService.getMetrics(),
        adminService.listUsers(userSearch),
        adminService.getAdminControllers(),
        adminService.getAdminChapters(),
        adminService.getAdminQuizzes(),
      ]);

      setMetrics(metricsRes.data?.totals || null);
      setUsers(usersRes.data || []);
      setControllers(controllersRes.data || []);
      setChapters(chaptersRes.data || []);
      setQuizzes(quizzesRes.data || []);
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
      setError(err.message || 'Access restricted or failed to load administrative telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Security Check
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="py-20 max-w-lg mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 mx-auto flex items-center justify-center text-rose-400">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold text-[#EAF5FF]">
            Administrative Access Restricted
          </h1>
          <p className="text-xs text-[#8FA6BC] leading-relaxed">
            You do not possess the required ADMIN credentials to access this command subsystem.
            This attempt has been logged.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  // Handle User Role Toggle
  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Change role of ${targetUser.email} to ${newRole}?`)) return;

    try {
      await adminService.updateUserRole(targetUser.id, newRole);
      setUsers(users.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert(err.message || 'Failed to update role.');
    }
  };

  // Handle User Delete
  const handleDeleteUser = async (targetUserId) => {
    if (!confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      await adminService.deleteUser(targetUserId);
      setUsers(users.filter((u) => u.id !== targetUserId));
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  // Handle Controller Delete
  const handleDeleteController = async (ctrlId) => {
    if (!confirm('Are you sure you want to delete this controller record?')) return;
    try {
      await controllerService.deleteController(ctrlId);
      setControllers(controllers.filter((c) => c.id !== ctrlId));
    } catch (err) {
      alert(err.message || 'Failed to delete controller.');
    }
  };

  // Handle Controller Save (Create or Edit)
  const handleSaveController = async (e) => {
    e.preventDefault();
    try {
      if (editingController) {
        await controllerService.updateController(editingController.id, controllerForm);
      } else {
        await controllerService.createController(controllerForm);
      }
      setIsControllerModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save controller.');
    }
  };

  // Open Create Controller Modal
  const handleOpenCreateController = () => {
    setEditingController(null);
    setControllerForm({
      name: '',
      commonName: '',
      slug: '',
      family: 'ARM Cortex-M',
      architecture: 'ARMv7E-M',
      core: 'Cortex-M4',
      coreCount: 1,
      manufacturer: 'STMicroelectronics',
      bitWidth: 32,
      maxClockSpeedMHz: 84.0,
      flashKb: 512.0,
      sramKb: 96.0,
      operatingVoltageMin: 1.7,
      operatingVoltageMax: 3.6,
      logicLevel: '3.3V',
      gpioCount: 50,
      adcChannels: 16,
      adcResolutionBits: 12,
      timers: 11,
      pwmChannels: 6,
      uartCount: 3,
      spiCount: 4,
      i2cCount: 3,
      packageTypes: 'LQFP-64',
      description: '',
      architecturalNotes: '',
      datasheetUrl: '',
    });
    setIsControllerModalOpen(true);
  };

  // Handle Question Save
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!selectedQuizId) return;

    try {
      await quizService.addQuestion({
        quizId: selectedQuizId,
        question: questionForm.question.trim(),
        codeSnippet: questionForm.codeSnippet.trim() || null,
        options: questionForm.options.map((o) => o.trim()),
        correctOptionIndex: parseInt(questionForm.correctOptionIndex, 10),
        points: parseInt(questionForm.points, 10) || 10,
        explanation: questionForm.explanation.trim() || 'Correct answer.',
      });
      setIsQuestionModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create assessment question.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#F59E0B] uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            Administrative Command & Control Subsystem
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#EAF5FF]">
            System Administration Panel
          </h1>
          <p className="text-sm text-[#8FA6BC] mt-1 max-w-2xl leading-relaxed">
            Manage registered engineers, publish silicon models, curate educational curriculum,
            and maintain assessment integrity.
          </p>
        </div>

        <Badge variant="amber">ADMIN PRIVILEGES GRANTED</Badge>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="p-3 rounded-xl bg-[#111E30] border border-[#192B40] text-center">
            <div className="text-[10px] font-mono text-[#8FA6BC]">USERS</div>
            <div className="text-xl font-heading font-bold text-[#55C7FF]">{metrics.users}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#111E30] border border-[#192B40] text-center">
            <div className="text-[10px] font-mono text-[#8FA6BC]">CHIPS</div>
            <div className="text-xl font-heading font-bold text-[#A5E3FF]">{metrics.controllers}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#111E30] border border-[#192B40] text-center">
            <div className="text-[10px] font-mono text-[#8FA6BC]">CHAPTERS</div>
            <div className="text-xl font-heading font-bold text-[#10B981]">{metrics.chapters}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#111E30] border border-[#192B40] text-center">
            <div className="text-[10px] font-mono text-[#8FA6BC]">LESSONS</div>
            <div className="text-xl font-heading font-bold text-[#FBBF24]">{metrics.lessons}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#111E30] border border-[#192B40] text-center">
            <div className="text-[10px] font-mono text-[#8FA6BC]">QUIZZES</div>
            <div className="text-xl font-heading font-bold text-[#55C7FF]">{metrics.quizzes}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#111E30] border border-[#192B40] text-center">
            <div className="text-[10px] font-mono text-[#8FA6BC]">ATTEMPTS</div>
            <div className="text-xl font-heading font-bold text-[#A5E3FF]">{metrics.quizAttempts}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#111E30] border border-[#192B40] text-center">
            <div className="text-[10px] font-mono text-[#8FA6BC]">EXPERIMENTS</div>
            <div className="text-xl font-heading font-bold text-[#10B981]">{metrics.savedExperiments}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#111E30] border border-[#192B40] text-center">
            <div className="text-[10px] font-mono text-[#8FA6BC]">NOTES</div>
            <div className="text-xl font-heading font-bold text-[#FBBF24]">{metrics.researchNotes}</div>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-[#192B40] pb-2 font-mono text-xs overflow-x-auto">
        {[
          { id: 'users', label: '1. User Accounts', icon: Users, count: users.length },
          { id: 'controllers', label: '2. Silicon Registry', icon: Cpu, count: controllers.length },
          { id: 'curriculum', label: '3. Curriculum Chapters', icon: BookOpen, count: chapters.length },
          { id: 'quizzes', label: '4. Assessments & Questions', icon: CheckSquare, count: quizzes.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#55C7FF] text-[#0B1220] font-bold shadow-[0_0_12px_rgba(85,199,255,0.3)]'
                  : 'bg-[#111E30] text-[#8FA6BC] hover:text-[#EAF5FF] border border-[#192B40]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0B1220]/60">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: User Management */}
      {activeTab === 'users' && (
        <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-mono text-[#55C7FF] uppercase tracking-wider font-semibold">
              Registered Accounts & Security Roles
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA6BC]" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  adminService.listUsers(e.target.value).then((res) => setUsers(res.data || []));
                }}
                className="w-full bg-[#0B1220] border border-[#192B40] focus:border-[#55C7FF] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#EAF5FF] font-mono outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#192B40] bg-[#0B1220]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#111E30] border-b border-[#192B40] text-[#8FA6BC] uppercase text-[10px]">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Member Since</th>
                  <th className="p-3">Activity</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#192B40]/60">
                {users.map((u) => {
                  const isSelf = u.id === user.id;
                  return (
                    <tr key={u.id} className="hover:bg-[#111E30]/50 transition-colors">
                      <td className="p-3 font-bold text-[#EAF5FF]">{u.name} {isSelf && '(You)'}</td>
                      <td className="p-3 text-[#8FA6BC]">{u.email}</td>
                      <td className="p-3">
                        <Badge variant={u.role === 'ADMIN' ? 'amber' : 'cyan'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-3 text-[#8FA6BC]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-[11px] text-[#55C7FF]">
                        {u._count.progress} Chapters • {u._count.attempts} Quizzes • {u._count.savedExperiments} Exps
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {!isSelf && (
                          <>
                            <button
                              onClick={() => handleRoleToggle(u)}
                              className="px-2 py-1 rounded text-[10px] bg-[#192B40] text-[#55C7FF] hover:bg-[#55C7FF] hover:text-[#0B1220] transition-colors"
                            >
                              Make {u.role === 'ADMIN' ? 'User' : 'Admin'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1 rounded text-[#8FA6BC] hover:text-rose-400"
                              title="Delete account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Controller Management */}
      {activeTab === 'controllers' && (
        <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-mono text-[#55C7FF] uppercase tracking-wider font-semibold">
              Silicon Controller Registry ({controllers.length})
            </div>

            <Button size="sm" onClick={handleOpenCreateController} className="flex items-center gap-1.5 font-bold">
              <Plus className="w-4 h-4" />
              Add Microcontroller Model
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#192B40] bg-[#0B1220]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#111E30] border-b border-[#192B40] text-[#8FA6BC] uppercase text-[10px]">
                <tr>
                  <th className="p-3">Chip Name</th>
                  <th className="p-3">Family & Architecture</th>
                  <th className="p-3">Manufacturer</th>
                  <th className="p-3">Clock / Flash / SRAM</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#192B40]/60">
                {controllers.map((ctrl) => (
                  <tr key={ctrl.id} className="hover:bg-[#111E30]/50 transition-colors">
                    <td className="p-3 font-bold text-[#EAF5FF]">
                      <div>{ctrl.name}</div>
                      <div className="text-[10px] text-[#8FA6BC] font-normal">{ctrl.commonName}</div>
                    </td>
                    <td className="p-3 text-[#A5E3FF]">
                      {ctrl.family} • {ctrl.core} ({ctrl.bitWidth}-bit)
                    </td>
                    <td className="p-3 text-[#8FA6BC]">{ctrl.manufacturer}</td>
                    <td className="p-3 text-[#55C7FF]">
                      {ctrl.maxClockSpeedMHz}MHz • {ctrl.flashKb}KB • {ctrl.sramKb}KB
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteController(ctrl.id)}
                        className="p-1 rounded text-[#8FA6BC] hover:text-rose-400"
                        title="Delete controller"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Curriculum Management */}
      {activeTab === 'curriculum' && (
        <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 space-y-4">
          <div className="text-xs font-mono text-[#55C7FF] uppercase tracking-wider font-semibold">
            Curriculum Chapters & Lessons ({chapters.length} Chapters)
          </div>

          <div className="space-y-3">
            {chapters.map((ch) => (
              <div key={ch.id} className="p-4 rounded-xl border border-[#192B40] bg-[#0B1220] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="cyan">CHAPTER {ch.chapterNumber}</Badge>
                    <span className="font-heading font-bold text-sm text-[#EAF5FF]">{ch.title}</span>
                  </div>
                  <span className="text-xs font-mono text-[#8FA6BC]">
                    {ch.lessons?.length || 0} Lessons
                  </span>
                </div>
                <p className="text-xs text-[#8FA6BC] line-clamp-1">{ch.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Quiz & Questions Management */}
      {activeTab === 'quizzes' && (
        <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-mono text-[#55C7FF] uppercase tracking-wider font-semibold">
              Curriculum Assessments & Question Bank
            </div>

            <Button
              size="sm"
              onClick={() => {
                if (quizzes.length > 0) setSelectedQuizId(quizzes[0].id);
                setIsQuestionModalOpen(true);
              }}
              className="flex items-center gap-1.5 font-bold"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </div>

          <div className="space-y-4">
            {quizzes.map((q) => (
              <div key={q.id} className="p-4 rounded-xl border border-[#192B40] bg-[#0B1220] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#55C7FF] uppercase">
                      CHAPTER {q.chapter?.chapterNumber}
                    </span>
                    <h3 className="font-heading font-bold text-base text-[#EAF5FF]">{q.title}</h3>
                  </div>
                  <Badge variant="cyan">{q.questions?.length || 0} Questions</Badge>
                </div>

                {/* Questions Preview */}
                <div className="space-y-2 pt-2 border-t border-[#192B40]/70">
                  {q.questions?.map((qn, idx) => (
                    <div key={qn.id} className="p-2.5 rounded-lg bg-[#111E30] border border-[#192B40] text-xs font-mono">
                      <div className="font-bold text-[#EAF5FF]">
                        Q{idx + 1}: {qn.question}
                      </div>
                      <div className="text-[11px] text-emerald-400 mt-1">
                        Correct: Option {String.fromCharCode(65 + qn.correctOptionIndex)} ({qn.options[qn.correctOptionIndex]})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Controller Modal */}
      {isControllerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#111E30] border border-[#192B40] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-[#192B40] bg-[#0B1220]/90 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-[#EAF5FF]">Add New Silicon Model</h3>
              <button onClick={() => setIsControllerModalOpen(false)} className="text-[#8FA6BC] hover:text-[#EAF5FF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveController} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8FA6BC]">PART NUMBER (e.g. STM32F401RET6):</label>
                  <input
                    type="text"
                    required
                    value={controllerForm.name}
                    onChange={(e) => setControllerForm({ ...controllerForm, name: e.target.value })}
                    className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                  />
                </div>
                <div>
                  <label className="text-[#8FA6BC]">SLUG (e.g. stm32f401ret6):</label>
                  <input
                    type="text"
                    required
                    value={controllerForm.slug}
                    onChange={(e) => setControllerForm({ ...controllerForm, slug: e.target.value })}
                    className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#8FA6BC]">FAMILY:</label>
                  <input
                    type="text"
                    required
                    value={controllerForm.family}
                    onChange={(e) => setControllerForm({ ...controllerForm, family: e.target.value })}
                    className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                  />
                </div>
                <div>
                  <label className="text-[#8FA6BC]">MANUFACTURER:</label>
                  <input
                    type="text"
                    required
                    value={controllerForm.manufacturer}
                    onChange={(e) => setControllerForm({ ...controllerForm, manufacturer: e.target.value })}
                    className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                  />
                </div>
                <div>
                  <label className="text-[#8FA6BC]">CLOCK SPEED (MHz):</label>
                  <input
                    type="number"
                    required
                    value={controllerForm.maxClockSpeedMHz}
                    onChange={(e) => setControllerForm({ ...controllerForm, maxClockSpeedMHz: parseFloat(e.target.value) })}
                    className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8FA6BC]">FLASH (KB):</label>
                  <input
                    type="number"
                    required
                    value={controllerForm.flashKb}
                    onChange={(e) => setControllerForm({ ...controllerForm, flashKb: parseFloat(e.target.value) })}
                    className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                  />
                </div>
                <div>
                  <label className="text-[#8FA6BC]">SRAM (KB):</label>
                  <input
                    type="number"
                    required
                    value={controllerForm.sramKb}
                    onChange={(e) => setControllerForm({ ...controllerForm, sramKb: parseFloat(e.target.value) })}
                    className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8FA6BC]">OFFICIAL DATASHEET URL:</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={controllerForm.datasheetUrl}
                  onChange={(e) => setControllerForm({ ...controllerForm, datasheetUrl: e.target.value })}
                  className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                />
              </div>

              <div>
                <label className="text-[#8FA6BC]">DESCRIPTION:</label>
                <textarea
                  required
                  rows={3}
                  value={controllerForm.description}
                  onChange={(e) => setControllerForm({ ...controllerForm, description: e.target.value })}
                  className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#192B40]">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsControllerModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create Controller
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#111E30] border border-[#192B40] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-[#192B40] bg-[#0B1220]/90 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-[#EAF5FF]">Add Question to Assessment</h3>
              <button onClick={() => setIsQuestionModalOpen(false)} className="text-[#8FA6BC] hover:text-[#EAF5FF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs font-mono">
              <div>
                <label className="text-[#8FA6BC]">TARGET QUIZ:</label>
                <select
                  value={selectedQuizId}
                  onChange={(e) => setSelectedQuizId(e.target.value)}
                  className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                >
                  {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>
                      Chapter {q.chapter?.chapterNumber}: {q.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#8FA6BC]">QUESTION TEXT:</label>
                <textarea
                  required
                  rows={2}
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="text-[#8FA6BC]">4 MULTIPLE-CHOICE OPTIONS:</label>
                {questionForm.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 text-center font-bold text-[#55C7FF]">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <input
                      type="text"
                      required
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...questionForm.options];
                        newOpts[idx] = e.target.value;
                        setQuestionForm({ ...questionForm, options: newOpts });
                      }}
                      className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[#8FA6BC]">CORRECT OPTION:</label>
                <select
                  value={questionForm.correctOptionIndex}
                  onChange={(e) => setQuestionForm({ ...questionForm, correctOptionIndex: parseInt(e.target.value, 10) })}
                  className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <div>
                <label className="text-[#8FA6BC]">EXPLANATION (SHOWN AFTER SUBMISSION):</label>
                <textarea
                  required
                  rows={2}
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  className="w-full bg-[#0B1220] border border-[#192B40] rounded-lg p-2 text-[#EAF5FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#192B40]">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsQuestionModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Add Question
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

