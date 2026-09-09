import React from 'react';
import { Project, UserRole } from '../types/index.js';
import { IndianRupee, TrendingUp, Landmark, ShieldCheck, Wallet, ArrowUpRight, ArrowLeft } from 'lucide-react';

interface FundsLedgerPageProps {
  projects: Project[];
  userRole: UserRole | 'PUBLIC';
  onBackToDashboard?: () => void;
}

export const FundsLedgerPage: React.FC<FundsLedgerPageProps> = ({ projects, userRole, onBackToDashboard }) => {
  // Annual statutory entitlement under MPLADS is ₹5.00 Crore
  const annualEntitlementCr = 5.0;
  const annualEntitlementINR = 50000000;

  const totalSanctionedINR = projects.reduce((acc, p) => acc + (p.sanctionedAmount || 0), 0);
  const totalUtilizedINR = projects.reduce((acc, p) => acc + (p.fundsUtilized || 0), 0);
  const uncommittedINR = Math.max(0, annualEntitlementINR - totalSanctionedINR);

  const sanctionedCr = (totalSanctionedINR / 10000000).toFixed(2);
  const utilizedCr = (totalUtilizedINR / 10000000).toFixed(2);
  const uncommittedCr = (uncommittedINR / 10000000).toFixed(2);
  const utilizationPct = totalSanctionedINR > 0 ? Math.round((totalUtilizedINR / totalSanctionedINR) * 100) : 0;

  // Flatten all payments
  const allPayments = projects
    .flatMap(p =>
      p.payments.map(pay => ({
        ...pay,
        projectCode: p.projectCode,
        projectTitle: p.title,
        district: p.district
      }))
    )
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());

  // Category breakdown
  const categoryMap = new Map<string, { sanctioned: number; utilized: number }>();
  projects.forEach(p => {
    const prev = categoryMap.get(p.category) || { sanctioned: 0, utilized: 0 };
    categoryMap.set(p.category, {
      sanctioned: prev.sanctioned + (p.sanctionedAmount || 0),
      utilized: prev.utilized + (p.fundsUtilized || 0)
    });
  });

  return (
    <div className="space-y-6">
      {/* Top Persistent Back Button */}
      {onBackToDashboard && (
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-govt-navy bg-white border border-slate-border hover:bg-panel-bg rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Overview</span>
          </button>
          <span className="text-xs text-slate-muted">
            Dashboard &gt; Funds Ledger
          </span>
        </div>
      )}

      <div>
        <h1 className="text-xl font-bold text-slate-body tracking-tight">
          MPLADS Financial Ledger & Fund Disbursals
        </h1>
        <p className="text-xs text-slate-muted">
          Statutory annual entitlement tracking (₹5.00 Crore per fiscal year) under MoSPI Guidelines
        </p>
      </div>

      {/* Fund KPI Summary Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-border shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-muted uppercase tracking-wider">
            <span>Annual Entitlement</span>
            <Landmark className="w-4 h-4 text-govt-navy" />
          </div>
          <div className="text-2xl font-bold text-slate-body mt-2">₹5.00 <span className="text-xs text-slate-muted font-normal">Cr</span></div>
          <div className="text-[11px] text-slate-muted mt-1">Per Parliamentary Constituency</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-border shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-muted uppercase tracking-wider">
            <span>Sanctioned Works</span>
            <Wallet className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-bold text-amber-800 mt-2">₹{sanctionedCr} <span className="text-xs text-slate-muted font-normal">Cr</span></div>
          <div className="text-[11px] text-slate-muted mt-1">
            {Math.round((totalSanctionedINR / annualEntitlementINR) * 100)}% of annual cap allocated
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-border shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-muted uppercase tracking-wider">
            <span>Disbursed & Utilized</span>
            <TrendingUp className="w-4 h-4 text-status-verified" />
          </div>
          <div className="text-2xl font-bold text-status-verified mt-2">₹{utilizedCr} <span className="text-xs text-slate-muted font-normal">Cr</span></div>
          <div className="text-[11px] text-slate-muted mt-1">
            Physical execution drawdown: {utilizationPct}%
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-border shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-muted uppercase tracking-wider">
            <span>Uncommitted Balance</span>
            <IndianRupee className="w-4 h-4 text-govt-navy" />
          </div>
          <div className="text-2xl font-bold text-slate-body mt-2">₹{uncommittedCr} <span className="text-xs text-slate-muted font-normal">Cr</span></div>
          <div className="text-[11px] text-slate-muted mt-1">Available for fresh recommendations</div>
        </div>
      </div>

      {/* Category Expenditure Grid */}
      <div className="bg-white rounded-2xl border border-slate-border p-5 shadow-xs">
        <h2 className="text-xs font-bold text-slate-body uppercase tracking-wider mb-4">
          Developmental Category Expenditure Allocation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(categoryMap.entries()).map(([cat, f]) => {
            const catSanctionedLakh = (f.sanctioned / 100000).toFixed(1);
            const catUtilizedLakh = (f.utilized / 100000).toFixed(1);
            const pct = f.sanctioned > 0 ? Math.round((f.utilized / f.sanctioned) * 100) : 0;

            return (
              <div key={cat} className="p-3.5 bg-panel-bg rounded-xl border border-slate-border text-xs space-y-2">
                <div className="font-bold text-slate-body truncate">{cat}</div>
                <div className="flex justify-between text-slate-muted font-mono text-[11px]">
                  <span>Sanctioned: ₹{catSanctionedLakh}L</span>
                  <span>Utilized: ₹{catUtilizedLakh}L</span>
                </div>
                <div className="w-full bg-slate-border h-2 rounded-full overflow-hidden">
                  <div className="bg-govt-navy h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[10px] text-slate-muted text-right font-medium">{pct}% spent</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disbursed Payment Vouchers Table */}
      <div className="bg-white rounded-2xl border border-slate-border shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-panel-bg border-b border-slate-border flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-body uppercase tracking-wider">
            Certified Milestone Payments Ledger
          </h2>
          <span className="text-xs font-mono text-slate-muted">{allPayments.length} Disbursals</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-panel-bg text-slate-muted font-bold uppercase text-[10px] border-b border-slate-border tracking-wider">
              <tr>
                <th className="p-3">Sanction Order Ref</th>
                <th className="p-3">Project Title</th>
                <th className="p-3">District</th>
                <th className="p-3">Beneficiary Agency</th>
                <th className="p-3 text-right">Amount (INR)</th>
                <th className="p-3">Disbursed Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-border">
              {allPayments.map(pay => (
                <tr key={pay.id} className="hover:bg-panel-bg">
                  <td className="p-3 font-mono font-bold text-slate-muted">{pay.sanctionOrderNo}</td>
                  <td className="p-3 max-w-xs">
                    <div className="font-bold text-slate-body truncate">{pay.projectTitle}</div>
                    <div className="text-[10px] text-slate-muted font-mono">{pay.projectCode}</div>
                  </td>
                  <td className="p-3 text-slate-body">{pay.district}</td>
                  <td className="p-3 text-slate-body">{pay.beneficiaryAgency}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-body">
                    ₹{(pay.amount / 100000).toFixed(2)} Lakh
                  </td>
                  <td className="p-3 font-mono text-slate-muted">{pay.paidAt}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-status-verified border border-status-verified/30">
                      {pay.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
