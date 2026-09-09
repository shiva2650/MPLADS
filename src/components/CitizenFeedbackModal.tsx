import React, { useState } from 'react';
import { Project } from '../types/index.js';
import { api } from '../services/api.js';
import { X, MessageSquareWarning, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CitizenFeedbackModalProps {
  projects: Project[];
  preselectedProjectId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CitizenFeedbackModal: React.FC<CitizenFeedbackModalProps> = ({
  projects,
  preselectedProjectId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [projectId, setProjectId] = useState(preselectedProjectId || projects?.[0]?.id || '');
  const [issueType, setIssueType] = useState('Substandard Material Quality');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenContact, setCitizenContact] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setProjectId(preselectedProjectId || projects?.[0]?.id || '');
      setError(null);
      setSuccessId(null);
    }
  }, [isOpen, preselectedProjectId, projects]);

  if (!isOpen) return null;

  const issueTypes = [
    'Substandard Material Quality',
    'Unexplained Delay in Execution',
    'Location Discrepancy (Work Not At Sanctioned Site)',
    'Suspected Financial Misappropriation / Incomplete Work',
    'Work Completed but Not Put to Public Use',
    'General Grievance / Inquiry'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await api.submitCitizenFeedback({
        projectId,
        issueType,
        description,
        citizenName: citizenName.trim() || undefined,
        citizenContact: citizenContact.trim() || undefined,
        photoUrl: photoUrl.trim() || undefined
      });

      setSuccessId(res.feedbackId);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit grievance.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-govt-navy-dark/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-border overflow-hidden my-8">
        <div className="px-6 py-4 bg-govt-navy text-white flex items-center justify-between border-b border-govt-navy-dark">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-govt-navy-light text-white border border-white/20">
              <MessageSquareWarning className="w-5 h-5 text-govt-saffron" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Public Grievance Redressal & Citizen Feedback
              </h2>
              <div className="text-xs text-panel-bg/80">
                Direct public monitoring channel to District Authority
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-panel-bg/80 hover:text-white hover:bg-govt-navy-light transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successId ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-panel-bg text-status-verified rounded-full flex items-center justify-center mx-auto border border-status-verified/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-body">Grievance Successfully Registered</h3>
              <div className="font-mono text-xs font-bold text-status-verified mt-1">
                Acknowledgement Number: {successId}
              </div>
              <p className="text-xs text-slate-muted mt-2 max-w-sm mx-auto">
                Your report has been securely routed to the District Authority vigilance desk for physical inspection. Personal identifiers remain strictly protected.
              </p>
            </div>
            <button
              onClick={() => {
                setSuccessId(null);
                onClose();
              }}
              className="px-6 py-2 bg-govt-navy text-white rounded-lg text-xs font-bold hover:bg-govt-navy-light transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-panel-bg border border-status-flagged/30 text-status-flagged rounded-xl font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-body mb-1">
                Target Developmental Project *
              </label>
              <select
                required
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-border rounded-lg text-slate-body bg-white focus:ring-2 focus:ring-govt-navy focus:border-govt-navy focus:outline-hidden"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.projectCode}] {p.title} ({p.district})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-body mb-1">
                Nature of Discrepancy / Grievance *
              </label>
              <select
                value={issueType}
                onChange={e => setIssueType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-border rounded-lg text-slate-body bg-white focus:ring-2 focus:ring-govt-navy focus:border-govt-navy focus:outline-hidden"
              >
                {issueTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-body mb-1">
                Detailed Observation & Specific Facts *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="State specific visual observations, date observed, or quality deficiencies noticed at the site..."
                className="w-full px-3 py-2 border border-slate-border rounded-lg text-slate-body bg-white focus:ring-2 focus:ring-govt-navy focus:border-govt-navy focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-body mb-1">
                  Citizen Name (Optional)
                </label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={e => setCitizenName(e.target.value)}
                  placeholder="Anonymous or Name"
                  className="w-full px-3 py-2 border border-slate-border rounded-lg text-slate-body bg-white focus:ring-2 focus:ring-govt-navy focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-body mb-1">
                  Mobile Number (For SMS updates)
                </label>
                <input
                  type="tel"
                  value={citizenContact}
                  onChange={e => setCitizenContact(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 border border-slate-border rounded-lg text-slate-body bg-white focus:ring-2 focus:ring-govt-navy focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-body mb-1">
                Photo Evidence URL (Optional)
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                placeholder="https://... photo link of site"
                className="w-full px-3 py-2 border border-slate-border rounded-lg text-slate-body bg-white font-mono text-[11px] focus:ring-2 focus:ring-govt-navy focus:outline-hidden"
              />
            </div>

            <div className="p-2.5 bg-panel-bg border border-slate-border rounded-xl text-[11px] text-govt-navy flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-govt-navy shrink-0" />
              <span>Whistleblower protection: Phone numbers are masked and never made public.</span>
            </div>

            <div className="pt-3 border-t border-slate-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-border text-slate-body bg-white hover:bg-panel-bg font-bold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-govt-navy text-white font-bold hover:bg-govt-navy-light disabled:opacity-50 flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'Registering...' : 'Register Grievance'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
