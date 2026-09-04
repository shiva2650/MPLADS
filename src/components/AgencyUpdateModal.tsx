import React, { useState } from 'react';
import { Project } from '../types/index.js';
import { api } from '../services/api.js';
import { X, HardHat, Camera, CheckCircle2, AlertTriangle, Compass } from 'lucide-react';

interface AgencyUpdateModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AgencyUpdateModal: React.FC<AgencyUpdateModalProps> = ({
  project,
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen || !project) return null;

  const [progress, setProgress] = useState(project.completionPercentage);
  const [fundsUtilizedLakh, setFundsUtilizedLakh] = useState(
    (project.fundsUtilized / 100000).toFixed(2)
  );
  const [remarks, setRemarks] = useState('');
  const [photoStage, setPhotoStage] = useState<'before' | 'during' | 'after'>('during');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?w=800&auto=format&fit=crop&q=60'
  );
  const [photoLat, setPhotoLat] = useState(project.latitude.toString());
  const [photoLon, setPhotoLon] = useState(project.longitude.toString());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const fundsNumber = Math.round(parseFloat(fundsUtilizedLakh) * 100000);

      await api.updateProgress(project.id, {
        completionPercentage: Number(progress),
        fundsUtilized: fundsNumber,
        remarks,
        photoUrl: photoUrl.trim() || undefined,
        photoStage,
        photoCaption: photoCaption.trim() || undefined,
        photoLat: parseFloat(photoLat),
        photoLon: parseFloat(photoLon)
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update progress.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3022]/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#F8F9F7] rounded-2xl shadow-2xl border border-[#DDE5D4] overflow-hidden my-8">
        <div className="px-6 py-4 bg-[#1B3022] text-white flex items-center justify-between border-b border-[#2C4A34]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#395C40]/50 text-[#DDE5D4] border border-[#395C40]">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Update Physical Progress & Upload Geotag Photo
              </h2>
              <div className="text-xs text-[#A3B18A] font-mono">
                {project.projectCode} — {project.title}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A3B18A] hover:text-white hover:bg-[#395C40] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-[#FAF3E0] border border-[#E8DAB2] text-[#935D26] rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#1B3022] mb-1">
                Physical Completion Percentage ({progress}%) *
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={e => setProgress(Number(e.target.value))}
                className="w-full h-2 bg-[#DDE5D4] rounded-lg appearance-none cursor-pointer accent-[#395C40]"
              />
              <div className="flex justify-between text-[10px] text-[#588157] mt-1">
                <span>0% (Commenced)</span>
                <span>50% (Mid-term)</span>
                <span>100% (Certified)</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1B3022] mb-1">
                Total Funds Utilized to Date (₹ Lakh) *
              </label>
              <input
                type="number"
                step="0.05"
                required
                value={fundsUtilizedLakh}
                onChange={e => setFundsUtilizedLakh(e.target.value)}
                className="w-full px-3 py-2 border border-[#DDE5D4] rounded-lg text-[#1B3022] bg-white font-mono font-bold focus:ring-2 focus:ring-[#395C40] focus:outline-hidden"
              />
              <div className="text-[10px] text-[#588157] mt-1">
                Sanctioned ceiling: ₹{(project.sanctionedAmount / 100000).toFixed(2)} Lakh
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1B3022] mb-1">
              Field Engineer Progress Remarks
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g., Plinth masonry foundation complete. Centering and reinforcement inspection passed by AE."
              className="w-full px-3 py-2 border border-[#DDE5D4] rounded-lg text-[#1B3022] bg-white focus:ring-2 focus:ring-[#395C40] focus:outline-hidden"
            />
          </div>

          {/* Photo Geotag Upload Section */}
          <div className="p-4 bg-white rounded-xl border border-[#DDE5D4] shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-[#1B3022] text-xs">
              <Camera className="w-4 h-4 text-[#395C40]" />
              <span>Mandatory Geotagged Progress Photo</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-[#1B3022] mb-1">Milestone Stage</label>
                <select
                  value={photoStage}
                  onChange={e => setPhotoStage(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#DDE5D4] rounded-lg text-[#1B3022] bg-white focus:ring-2 focus:ring-[#395C40] focus:outline-hidden"
                >
                  <option value="before">Before Work Started</option>
                  <option value="during">During Work Execution</option>
                  <option value="after">After Completion</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-[#1B3022] mb-1">Photo Description / Stage</label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={e => setPhotoCaption(e.target.value)}
                  placeholder="e.g., Slab casting and shuttering inspection"
                  className="w-full px-3 py-2 border border-[#DDE5D4] rounded-lg text-[#1B3022] bg-white focus:ring-2 focus:ring-[#395C40] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1B3022] mb-1">Photo Image URL</label>
              <input
                type="url"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                className="w-full px-3 py-2 border border-[#DDE5D4] rounded-lg font-mono text-[11px] text-[#1B3022] bg-white focus:ring-2 focus:ring-[#395C40] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-[#1B3022] mb-1 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#395C40]" />
                  <span>Photo EXIF Latitude</span>
                </label>
                <input
                  type="text"
                  value={photoLat}
                  onChange={e => setPhotoLat(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5D4] rounded-lg font-mono text-[#1B3022] bg-white focus:ring-2 focus:ring-[#395C40] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1B3022] mb-1 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#395C40]" />
                  <span>Photo EXIF Longitude</span>
                </label>
                <input
                  type="text"
                  value={photoLon}
                  onChange={e => setPhotoLon(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5D4] rounded-lg font-mono text-[#1B3022] bg-white focus:ring-2 focus:ring-[#395C40] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="text-[11px] text-[#395C40] bg-[#EAF0E6] p-2.5 rounded-xl border border-[#C8D5B9]">
              💡 <strong>AI Verification Note:</strong> The system automatically verifies that the photo EXIF coordinates fall within 250 meters of the sanctioned site ({project.latitude.toFixed(4)}°, {project.longitude.toFixed(4)}°). If you enter distant coordinates, a location mismatch alert will be triggered automatically.
            </div>
          </div>

          <div className="pt-4 border-t border-[#DDE5D4] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#DDE5D4] text-[#1B3022] bg-white hover:bg-[#F8F9F7] font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-[#395C40] text-white font-bold hover:bg-[#2C4A34] disabled:opacity-50 flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Save & Verify Progress'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
