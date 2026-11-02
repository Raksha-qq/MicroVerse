import React, { useState, useEffect } from 'react';
import { FileText, Plus, Tag, User, Clock, Cpu } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { researchNoteService } from '../services/researchNoteService';

export function ResearchNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    researchNoteService
      .getNotes()
      .then((res) => {
        setNotes(res.data || []);
      })
      .catch((err) => {
        console.error('Error fetching research notes:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" />
            Engineering Lab Notebook
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#EAF5FF]">
            Laboratory Research Notes
          </h1>
          <p className="text-sm text-[#8FA6BC] mt-1">
            Telemetry logs, register insights, silicon errata, and robotics observations.
          </p>
        </div>
        <Button size="sm" icon={Plus}>
          New Research Log
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#8FA6BC]">
          RETRIEVING LABORATORY LOGBOOKS...
        </div>
      ) : notes.length === 0 ? (
        <div className="py-16 text-center text-xs font-mono text-[#8FA6BC] bg-[#111E30]/40 rounded-xl border border-[#192B40]">
          NO RESEARCH NOTES LOGGED YET.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {notes.map((note) => (
            <Card key={note.id} className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant={note.category === 'PERIPHERAL' ? 'cyan' : note.category === 'ARCHITECTURE' ? 'ice' : 'emerald'}>
                  {note.category}
                </Badge>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8FA6BC]">
                  <Clock className="w-3 h-3 text-[#55C7FF]" />
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <h2 className="font-heading text-lg font-bold text-[#EAF5FF] hover:text-[#55C7FF] transition-colors">
                {note.title}
              </h2>

              <p className="text-xs text-[#8FA6BC] leading-relaxed line-clamp-3">
                {note.content}
              </p>

              <div className="pt-3 border-t border-[#192B40] flex items-center justify-between text-xs font-mono text-[#8FA6BC]">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-[#55C7FF]" />
                  <span>{note.user?.name || 'Laboratory Engineer'}</span>
                </div>
                {note.controller && (
                  <div className="flex items-center gap-1 text-[#55C7FF]">
                    <Cpu className="w-3 h-3" />
                    <span>{note.controller.name}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

