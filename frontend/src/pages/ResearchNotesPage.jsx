import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Plus,
  Tag,
  Clock,
  Cpu,
  Trash2,
  Edit2,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  Lock,
  Globe,
  X,
  Save,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { researchNoteService } from '../services/researchNoteService';
import { controllerService } from '../services/controllerService';
import { useAuth } from '../hooks/useAuth';

export function ResearchNotesPage() {
  const { user, openAuth } = useAuth();

  const [notes, setNotes] = useState([]);
  const [controllers, setControllers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [tags, setTags] = useState('');
  const [controllerId, setControllerId] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);

  const categories = [
    'ALL',
    'GENERAL',
    'ARCHITECTURE',
    'PERIPHERAL',
    'PROTOCOL',
    'EXPERIMENT',
    'ROBOTICS',
  ];

  // Fetch notes
  const loadNotes = () => {
    setLoading(true);
    setError(null);
    researchNoteService
      .getNotes()
      .then((res) => {
        setNotes(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to retrieve research notes:', err);
        setError('Failed to load research notes from PostgreSQL.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadNotes();
    controllerService
      .getControllers({ limit: 50 })
      .then((res) => setControllers(res.data || []))
      .catch(() => {});
  }, [user]);

  // Open Create Modal
  const handleOpenCreate = () => {
    if (!user) {
      openAuth('login');
      return;
    }
    setEditingNote(null);
    setTitle('');
    setContent('');
    setCategory('GENERAL');
    setTags('');
    setControllerId('');
    setIsPublic(false);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setTags(note.tags || '');
    setControllerId(note.controllerId || '');
    setIsPublic(note.isPublic || false);
    setIsModalOpen(true);
  };

  // Handle Save (Create or Update)
  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tags.trim() || null,
        controllerId: controllerId || null,
        isPublic,
      };

      if (editingNote) {
        await researchNoteService.updateNote(editingNote.id, payload);
      } else {
        await researchNoteService.createNote(payload);
      }

      setIsModalOpen(false);
      loadNotes();
    } catch (err) {
      console.error('Error saving research note:', err);
      alert('Failed to save research note.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete
  const handleDeleteNote = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this research note?')) return;
    try {
      await researchNoteService.deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note.');
    }
  };

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesCat = selectedCategory === 'ALL' || n.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.tags && n.tags.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (n.controller && n.controller.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [notes, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#D87535] uppercase tracking-widest mb-1">
            <FileText className="w-3.5 h-3.5" />
            Personal Technical Notebook &amp; Logbook
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201D]">
            Engineering Research Notes
          </h1>
          <p className="text-sm text-[#8C8275] mt-1 max-w-2xl leading-relaxed">
            Record silicon errata, register configurations, sensor fusion observations, and firmware
            architectural insights. Notes are private to your engineer account.
          </p>
        </div>

        <Button size="sm" onClick={handleOpenCreate} className="flex items-center gap-1.5 font-bold self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          New Research Log
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-[#C9BDAA] bg-[#F5EBDD] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#EDE1CE] text-[#22201D] font-bold border border-[#C9BDAA]'
                  : 'bg-[#FAF5EB] text-[#8C8275] hover:text-[#22201D] border border-[#C9BDAA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8275]" />
          <input
            type="text"
            placeholder="Search notes, tags, controllers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#22201D] placeholder-[#8C8275] outline-none font-mono"
          />
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#8C8275] space-y-3">
          <FileText className="w-8 h-8 mx-auto text-[#D87535] animate-spin" />
          <div>RETRIEVING LABORATORY LOGBOOKS...</div>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-xs font-mono text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/30">
          {error}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="py-16 text-center text-xs font-mono text-[#8C8275] bg-[#EDE1CE] rounded-2xl border border-dashed border-[#C9BDAA] space-y-3">
          <FileText className="w-10 h-10 mx-auto text-[#8C8275]/40" />
          <div className="text-[#22201D] font-serif text-base font-bold">
            No research notes matching filter.
          </div>
          <p className="max-w-md mx-auto">
            Click "New Research Log" to record architectural findings, peripheral observations, or register notes.
          </p>
          <Button size="sm" onClick={handleOpenCreate} className="mt-2">
            Create First Note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredNotes.map((note) => {
            const isOwner = user && note.user?.id === user.id;

            return (
              <div
                key={note.id}
                className="flex flex-col justify-between space-y-4 bg-[#FAF5EB] border border-[#C9BDAA] rounded hover:border-[#D87535] transition-colors p-4"
              >
                <div className="space-y-3">
                  {/* Top Meta Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="cyan">{note.category}</Badge>
                      {note.isPublic ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          <Globe className="w-2.5 h-2.5" /> Public
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-[#8C8275] bg-[#EDE1CE] px-2 py-0.5 rounded border border-[#C9BDAA]">
                          <Lock className="w-2.5 h-2.5" /> Private
                        </span>
                      )}
                    </div>

                    {isOwner && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(note)}
                          className="p-1 rounded text-[#8C8275] hover:text-[#D87535] transition-colors"
                          title="Edit note"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 rounded text-[#8C8275] hover:text-rose-500 transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg font-bold text-[#22201D]">
                    {note.title}
                  </h3>

                  {/* Content snippet */}
                  <p className="text-xs text-[#8C8275] whitespace-pre-line leading-relaxed">
                    {note.content}
                  </p>

                  {/* Associated Hardware / Curriculum Badge */}
                  {note.controller && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#D87535] bg-[#EDE1CE] p-2 rounded-lg border border-[#C9BDAA]">
                      <Cpu className="w-3.5 h-3.5 shrink-0" />
                      <span>Associated Silicon: {note.controller.name}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {note.tags && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {note.tags.split(',').map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono bg-[#EDE1CE] text-[#655F55] px-2 py-0.5 rounded border border-[#C9BDAA]"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer timestamp */}
                <div className="pt-3 border-t border-[#C9BDAA] text-[10px] font-mono text-[#8C8275] flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                  <span>{note.user?.name || 'Engineer'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#22201D]/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#FAF5EB] border-2 border-[#C9BDAA] rounded shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-[#C9BDAA] bg-[#FAF5EB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D87535]" />
                <h3 className="font-serif text-lg font-bold text-[#22201D]">
                  {editingNote ? 'Edit Research Note' : 'Create New Research Log'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8C8275] hover:text-[#22201D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#8C8275]">NOTE TITLE:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STM32 DMA FIFO Overrun Mitigation in Motor Inverters"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded px-3 py-2 text-xs text-[#22201D] font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#8C8275]">CATEGORY:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded px-3 py-2 text-xs text-[#22201D] font-mono outline-none"
                  >
                    {categories.filter((c) => c !== 'ALL').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#8C8275]">ASSOCIATED CONTROLLER:</label>
                  <select
                    value={controllerId}
                    onChange={(e) => setControllerId(e.target.value)}
                    className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded px-3 py-2 text-xs text-[#22201D] font-mono outline-none"
                  >
                    <option value="">None (General Note)</option>
                    {controllers.map((ctrl) => (
                      <option key={ctrl.id} value={ctrl.id}>
                        {ctrl.name} ({ctrl.family})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#8C8275]">TECHNICAL CONTENT &amp; OBSERVATIONS:</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Record register bitmasks, oscilloscope traces, errata observations, or algorithmic math..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded px-3 py-2 text-xs text-[#22201D] font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#8C8275]">TAGS (COMMA-SEPARATED):</label>
                <input
                  type="text"
                  placeholder="e.g. DMA, STM32, TIM1, BLDC, Interrupts"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded px-3 py-2 text-xs text-[#22201D] font-mono outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#C9BDAA]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={saving}
                  className="flex items-center gap-1.5 font-bold"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Save Research Note'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
