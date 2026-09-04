import React, { useState } from 'react';
import { Project, UserRole } from '../types/index.js';
import { StatusBadge, RiskBadge } from '../components/Badges.js';
import { HardHat, Camera, IndianRupee, CheckCircle2, AlertCircle, Compass, FileText } from 'lucide-react';
import { AgencyUpdateModal } from '../components/AgencyUpdateModal.js';
import { api } from '../services/api.js';

interface AgencyWorkdeskPageProps {
  projects: Project[];
  userRole: UserRole | 'PUBLIC';
  onSelectProject: (project: Project) => void;
  onRefresh: () => void;
}

export const AgencyWorkdeskPage: React.FC<AgencyWorkdeskPageProps> = ({
  projects,
  userRole,
  onSelectProject,
  onRefresh
}) => {
  const [selectedProjectForUpdate, setSelectedProjectForUpdate] = useState<Project | null>(null);
  const [paymentModalProject, setPaymentModalProject] = useState<Project | null>(null);
  const [claimAmountLakh, setClaimAmountLakh] = useState('');
  const [voucherRemarks, setVoucherRemarks] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);

  // Agency projects
  const agencyProjects = projects.filter(
    p => p.status === 'Assigned' || p.status === 'Ongoing' || p.status === 'Delayed' || p.status === 'Completed'
  );

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalProject) return;
    setSubmittingClaim(true);
    try {
      const amountNumber = Math.round(parseFloat(claimAmountLakh) * 100000);
      await api.addPayment(paymentModalProject.id, {
        amount: amountNumber,
        remarks: voucherRemarks
      });
      setPaymentModalProject(null);
      setClaimAmountLakh('');
      setVoucherRemarks('');
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to submit payment claim.');
    } finally {
      setSubmittingClaim(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Implementing Agency Field Workdesk
        </h1>
        <p className="text-xs text-gray-500">
          Execution tracking, milestone verification, geotagged photograph uploads, and payment vouchers
        </p>
      </div>

      {/* Guidelines reminder */}
      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
        <HardHat className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">Agency Protocol Notice:</div>
          <div className="text-[11px] leading-relaxed mt-0.5">
            Photographic submissions must contain authentic EXIF GPS telemetry within 250 meters of the sanctioned site. Duplicate image re-use across projects is tracked automatically and triggers vigilance audit.
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {agencyProjects.map(project => (
          <div
            key={project.id}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs text-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-300 transition-all"
          >
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gray-700">{project.projectCode}</span>
                <StatusBadge status={project.status} />
                <RiskBadge level={project.riskAnalysis.riskLevel} score={project.riskAnalysis.overallScore} />
              </div>

              <h3
                onClick={() => onSelectProject(project)}
                className="text-sm font-bold text-gray-900 hover:text-blue-900 cursor-pointer truncate"
              >
                {project.title}
              </h3>

              <div className="text-[11px] text-gray-600 space-x-2">
                <span>Vendor: <strong>{project.vendorName}</strong></span>
                <span>•</span>
                <span>Location: {project.locationAddress}</span>
              </div>

              {/* Progress and Photos count */}
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Physical Progress:</span>
                  <strong className="font-mono">{project.completionPercentage}%</strong>
                  <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${project.completionPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="text-gray-500">
                  Photos Logged: <strong className="text-gray-900">{project.photos.length}</strong>
                </div>

                <div className="text-gray-500">
                  Utilized: <strong className="text-gray-900">₹{(project.fundsUtilized / 100000).toFixed(1)}L</strong> of ₹{(project.sanctionedAmount / 100000).toFixed(1)}L
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0">
              <button
                onClick={() => setSelectedProjectForUpdate(project)}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Update Progress & Geotag</span>
              </button>

              <button
                onClick={() => {
                  setPaymentModalProject(project);
                  setClaimAmountLakh('5.0');
                }}
                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-xs font-medium flex items-center gap-1.5 shadow-2xs"
              >
                <IndianRupee className="w-3.5 h-3.5 text-blue-700" />
                <span>Claim Payment Voucher</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Progress & Geotag Photo Modal */}
      <AgencyUpdateModal
        project={selectedProjectForUpdate}
        isOpen={!!selectedProjectForUpdate}
        onClose={() => setSelectedProjectForUpdate(null)}
        onSuccess={() => {
          setSelectedProjectForUpdate(null);
          onRefresh();
        }}
      />

      {/* Payment Claim Modal */}
      {paymentModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-gray-900">
              Submit Milestone Payment Voucher Claim
            </h3>
            <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
              <div className="font-mono text-gray-500 text-[11px]">{paymentModalProject.projectCode}</div>
              <div className="font-bold text-gray-900">{paymentModalProject.title}</div>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Voucher Claim Amount (₹ in Lakh) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={claimAmountLakh}
                  onChange={e => setClaimAmountLakh(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Measurement Book (M-Book) & Work Stage Reference
                </label>
                <textarea
                  rows={2}
                  value={voucherRemarks}
                  onChange={e => setVoucherRemarks(e.target.value)}
                  placeholder="e.g., M-Book No. 42, Page 18-22. First running bill for completed civil plinth stage."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalProject(null)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingClaim}
                  className="px-5 py-2 bg-blue-900 text-white rounded font-semibold hover:bg-blue-800 disabled:opacity-50"
                >
                  {submittingClaim ? 'Submitting...' : 'Submit Claim Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
