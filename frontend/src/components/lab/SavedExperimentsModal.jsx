import React, { useState, useEffect } from 'react';
import {
  X,
  HardDrive,
  Save,
  Trash2,
  Edit2,
  Play,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { experimentService } from '../../services/experimentService';
import { useAuth } from '../../context/AuthContext';

export function SavedExperimentsModal({
  isOpen,
  onClose,
  currentExperimentToSave,
  onLoadExperiment,
}) {
  const { user } = useAuth();
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State for New Save
  const [title, setTitle] = useState(currentExperimentToSave?.title || '');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Fetch user's experiments
  const loadSaved = () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    experimentService
      .getSavedExperiments()
      .then((res) => {
        setExperiments(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load saved experiments:', err);
        setError('Failed to retrieve experiments from database.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      loadSaved();
      if (currentExperimentToSave?.title) {
        setTitle(currentExperimentToSave.title);
      }
    }
  }, [isOpen, user, currentExperimentToSave]);

  if (!isOpen) return null;

  // Handle Save
  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !currentExperimentToSave) return;
    setSaving(true);
    setError(null);

    try {
      await experimentService.saveExperiment({
        title: title.trim(),
        description: description.trim() || null,
        experimentType: currentExperimentToSave.experimentType,
        configState: currentExperimentToSave.configState,
      });
      setSaveSuccess(true);
      setTitle('');
      setDescription('');
      loadSaved();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving experiment:', err);
      setError(err.message || 'Failed to save experiment configuration.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this saved experiment configuration?')) return;
    try {
      await experimentService.deleteExperiment(id);
      setExperiments(experiments.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Error deleting experiment:', err);
      alert('Failed to delete experiment.');
    }
  };

  // Handle Update / Rename
  const handleUpdate = async (id) => {
    if (!editTitle.trim()) return;
    try {
      await experimentService.updateExperiment(id, { title: editTitle.trim() });
      setEditingId(null);
      loadSaved();
    } catch (err) {
      console.error('Error updating experiment:', err);
      alert('Failed to update experiment title.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111E30] border border-[#192B40] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#192B40] bg-[#0B1220]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#55C7FF]/10 border border-[#55C7FF]/30 flex items-center justify-center text-[#55C7FF]">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#EAF5FF]">
                Laboratory Experiment Registry
              </h3>
              <p className="text-xs text-[#8FA6BC]">
                Persist and reload hardware simulation configurations into PostgreSQL.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#192B40]/50 hover:bg-[#192B40] text-[#8FA6BC] hover:text-[#EAF5FF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {!user ? (
            <div className="p-6 text-center rounded-xl bg-[#0B1220] border border-[#192B40] space-y-3">
              <HardDrive className="w-10 h-10 mx-auto text-[#8FA6BC]/40" />
              <div className="font-heading text-base font-bold text-[#EAF5FF]">
                Authentication Required
              </div>
              <p className="text-xs text-[#8FA6BC] max-w-md mx-auto">
                Sign in or register an account to save custom simulation parameters, load saved benchmarks, and maintain a personal research log.
              </p>
            </div>
          ) : (
            <>
              {/* Save Current Active Simulation Form */}
              {currentExperimentToSave && (
                <form onSubmit={handleSave} className="p-4 rounded-xl bg-[#0B1220] border border-[#192B40] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#55C7FF] uppercase tracking-wider font-semibold">
                      Save Current Simulation Configuration
                    </span>
                    <Badge variant="cyan">{currentExperimentToSave.experimentType}</Badge>
                  </div>

                  {saveSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Configuration saved successfully to your cloud profile!
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#8FA6BC]">EXPERIMENT TITLE:</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. 25kHz Ultrasonic BLDC Gate Calibration"
                      className="w-full bg-[#111E30] border border-[#192B40] focus:border-[#55C7FF] rounded-lg px-3 py-1.5 text-xs text-[#EAF5FF] outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#8FA6BC]">LAB NOTES (OPTIONAL):</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Observed settling time, back-EMF smoothing, noise threshold..."
                      className="w-full bg-[#111E30] border border-[#192B40] focus:border-[#55C7FF] rounded-lg px-3 py-1.5 text-xs text-[#EAF5FF] outline-none font-mono"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={saving || !title.trim()}
                      className="flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {saving ? 'Saving...' : 'Save Configuration'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Saved Experiments List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#8FA6BC]">
                  <span>YOUR SAVED EXPERIMENTS ({experiments.length})</span>
                </div>

                {loading ? (
                  <div className="py-8 text-center text-xs font-mono text-[#8FA6BC]">
                    Retrieving research configurations...
                  </div>
                ) : experiments.length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-[#8FA6BC] bg-[#0B1220]/60 rounded-xl border border-[#192B40]">
                    No saved experiment configurations found. Run a simulation and click "Save" to log it.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {experiments.map((exp) => (
                      <div
                        key={exp.id}
                        className="p-3 rounded-xl border border-[#192B40] bg-[#0B1220] flex items-center justify-between gap-3 text-xs font-mono"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          {editingId === exp.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="bg-[#111E30] border border-[#55C7FF] rounded px-2 py-0.5 text-xs text-[#EAF5FF] outline-none flex-1"
                              />
                              <button
                                onClick={() => handleUpdate(exp.id)}
                                className="text-emerald-400 font-bold hover:underline"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-[#8FA6BC] hover:underline"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Badge variant="cyan">{exp.experimentType}</Badge>
                              <span className="font-bold text-[#EAF5FF] truncate">{exp.title}</span>
                            </div>
                          )}

                          {exp.description && (
                            <p className="text-[11px] text-[#8FA6BC] line-clamp-1">{exp.description}</p>
                          )}

                          <div className="text-[10px] text-[#8FA6BC]/70 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(exp.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              if (onLoadExperiment) {
                                onLoadExperiment(exp);
                                onClose();
                              }
                            }}
                            title="Load into simulation bench"
                            className="px-2.5 py-1 rounded bg-[#55C7FF]/10 text-[#55C7FF] border border-[#55C7FF]/30 hover:bg-[#55C7FF] hover:text-[#0B1220] transition-colors flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            Load
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(exp.id);
                              setEditTitle(exp.title);
                            }}
                            title="Rename experiment"
                            className="p-1 rounded text-[#8FA6BC] hover:text-[#EAF5FF]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id)}
                            title="Delete experiment"
                            className="p-1 rounded text-[#8FA6BC] hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#192B40] bg-[#0B1220] flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

