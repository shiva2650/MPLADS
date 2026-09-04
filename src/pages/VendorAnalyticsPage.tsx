import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { Building, AlertTriangle, CheckCircle2, TrendingDown, Layers, ShieldAlert } from 'lucide-react';

export const VendorAnalyticsPage: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getVendors().then(res => {
      setVendors(res.vendors || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#588157]">Loading vendor integrity analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#1B3022] tracking-tight">
          Contractor & Vendor Concentration Matrix
        </h1>
        <p className="text-xs text-[#588157]">
          Vigilance profiling tracking contractor allocation caps, execution delays, and risk concentration
        </p>
      </div>

      {/* Advisory card */}
      <div className="p-4 bg-[#EAF0E6] border border-[#C8D5B9] rounded-2xl text-xs text-[#1B3022] flex items-start gap-2.5">
        <Building className="w-5 h-5 text-[#395C40] shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-[#1B3022]">Anti-Cartelization & Concentration Vigilance:</div>
          <div className="text-[11px] leading-relaxed mt-0.5 text-[#395C40]">
            Under CVC (Central Vigilance Commission) directives, high concentration of projects or repeat delays under single contractors trigger automated alerts to prevent monopolistic distribution of constituency works.
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map(v => (
          <div
            key={v.name}
            className="bg-white rounded-2xl border border-[#DDE5D4] p-5 shadow-xs space-y-4 hover:border-[#395C40] transition-all text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#1B3022] line-clamp-1">{v.name}</h3>
                <div className="text-[10px] text-[#588157] font-mono mt-0.5">Registered Govt Contractor</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  v.highRiskCount > 1
                    ? 'bg-[#FBEBE8] text-[#B85338] border border-[#F5C2B4]'
                    : v.delayed > 0
                    ? 'bg-[#FAF3E0] text-[#935D26] border border-[#E8DAB2]'
                    : 'bg-[#EAF0E6] text-[#395C40] border border-[#C8D5B9]'
                }`}
              >
                {v.riskExposureRating}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 bg-[#F8F9F7] p-3 rounded-xl border border-[#DDE5D4] font-mono">
              <div>
                <div className="text-[10px] text-[#588157] uppercase font-sans font-bold">Total Works</div>
                <div className="text-base font-bold text-[#1B3022]">{v.totalProjects}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#588157] uppercase font-sans font-bold">Contract Value</div>
                <div className="text-base font-bold text-[#395C40]">₹{v.totalValueCr} Cr</div>
              </div>
              <div>
                <div className="text-[10px] text-[#588157] uppercase font-sans font-bold">Completed</div>
                <div className="text-sm font-bold text-[#395C40]">{v.completed}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#588157] uppercase font-sans font-bold">Delayed / At Risk</div>
                <div className="text-sm font-bold text-[#E07A5F]">{v.delayed}</div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-[#588157]">
                <span className="font-medium">Timely Completion Rate</span>
                <strong className="font-mono text-[#1B3022]">{v.completionRate}%</strong>
              </div>
              <div className="w-full bg-[#DDE5D4] h-2 rounded-full overflow-hidden">
                <div className="bg-[#395C40] h-full rounded-full" style={{ width: `${v.completionRate}%` }} />
              </div>
            </div>

            {/* Category Tags */}
            <div className="pt-2 border-t border-[#DDE5D4]">
              <div className="text-[10px] text-[#588157] mb-1 font-bold uppercase">Categories</div>
              <div className="flex flex-wrap gap-1">
                {v.categories.map((c: string) => (
                  <span key={c} className="px-2 py-0.5 rounded-md bg-[#F8F9F7] border border-[#DDE5D4] text-[#1B3022] text-[10px] font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
