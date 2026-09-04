import React from 'react';
import { Project, UserRole } from '../types/index.js';
import { IndianRupee, TrendingUp, Landmark, ShieldCheck, Wallet, ArrowUpRight } from 'lucide-react';

interface FundsLedgerPageProps {
  projects: Project[];
  userRole: UserRole | 'PUBLIC';
}

export const FundsLedgerPage: React.FC<FundsLedgerPageProps> = ({ projects, userRole }) => {
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
      <div>
        <h1 className="text-xl font-bold text-[#1B3022] tracking-tight">
          MPLADS Financial Ledger & Fund Disbursals
        </h1>
        <p className="text-xs text-[#588157]">
          Statutory annual entitlement tracking (₹5.00 Crore per fiscal year) under MoSPI Guidelines
        </p>
      </div>

      {/* Fund KPI Summary Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#DDE5D4] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#588157] uppercase tracking-wider">
            <span>Annual Entitlement</span>
            <Landmark className="w-4 h-4 text-[#395C40]" />
          </div>
          <div className="text-2xl font-bold text-[#1B3022] mt-2">₹5.00 <span className="text-xs text-[#588157] font-normal">Cr</span></div>
          <div className="text-[11px] text-[#588157] mt-1">Per Parliamentary Constituency</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#DDE5D4] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#588157] uppercase tracking-wider">
            <span>Sanctioned Works</span>
            <Wallet className="w-4 h-4 text-[#935D26]" />
          </div>
          <div className="text-2xl font-bold text-[#935D26] mt-2">₹{sanctionedCr} <span className="text-xs text-[#588157] font-normal">Cr</span></div>
          <div className="text-[11px] text-[#588157] mt-1">
            {Math.round((totalSanctionedINR / annualEntitlementINR) * 100)}% of annual cap allocated
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#DDE5D4] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#588157] uppercase tracking-wider">
            <span>Disbursed & Utilized</span>
            <TrendingUp className="w-4 h-4 text-[#395C40]" />
          </div>
          <div className="text-2xl font-bold text-[#395C40] mt-2">₹{utilizedCr} <span className="text-xs text-[#588157] font-normal">Cr</span></div>
          <div className="text-[11px] text-[#588157] mt-1">
            Physical execution drawdown: {utilizationPct}%
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#DDE5D4] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#588157] uppercase tracking-wider">
            <span>Uncommitted Balance</span>
            <IndianRupee className="w-4 h-4 text-[#1B3022]" />
          </div>
          <div className="text-2xl font-bold text-[#1B3022] mt-2">₹{uncommittedCr} <span className="text-xs text-[#588157] font-normal">Cr</span></div>
          <div className="text-[11px] text-[#588157] mt-1">Available for fresh recommendations</div>
        </div>
      </div>

      {/* Category Expenditure Grid */}
      <div className="bg-white rounded-2xl border border-[#DDE5D4] p-5 shadow-xs">
        <h2 className="text-xs font-bold text-[#1B3022] uppercase tracking-wider mb-4">
          Developmental Category Expenditure Allocation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(categoryMap.entries()).map(([cat, f]) => {
            const catSanctionedLakh = (f.sanctioned / 100000).toFixed(1);
            const catUtilizedLakh = (f.utilized / 100000).toFixed(1);
            const pct = f.sanctioned > 0 ? Math.round((f.utilized / f.sanctioned) * 100) : 0;

            return (
              <div key={cat} className="p-3.5 bg-[#F8F9F7] rounded-xl border border-[#DDE5D4] text-xs space-y-2">
                <div className="font-bold text-[#1B3022] truncate">{cat}</div>
                <div className="flex justify-between text-[#588157] font-mono text-[11px]">
                  <span>Sanctioned: ₹{catSanctionedLakh}L</span>
                  <span>Utilized: ₹{catUtilizedLakh}L</span>
                </div>
                <div className="w-full bg-[#DDE5D4] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#395C40] h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[10px] text-[#588157] text-right font-medium">{pct}% spent</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disbursed Payment Vouchers Table */}
      <div className="bg-white rounded-2xl border border-[#DDE5D4] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-[#FDFDFB] border-b border-[#DDE5D4] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#1B3022] uppercase tracking-wider">
            Certified Milestone Payments Ledger
          </h2>
          <span className="text-xs font-mono text-[#588157]">{allPayments.length} Disbursals</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F7] text-[#588157] font-bold uppercase text-[10px] border-b border-[#DDE5D4] tracking-wider">
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
            <tbody className="divide-y divide-[#F0F2ED]">
              {allPayments.map(pay => (
                <tr key={pay.id} className="hover:bg-[#F8F9F7]">
                  <td className="p-3 font-mono font-bold text-[#588157]">{pay.sanctionOrderNo}</td>
                  <td className="p-3 max-w-xs">
                    <div className="font-bold text-[#1B3022] truncate">{pay.projectTitle}</div>
                    <div className="text-[10px] text-[#588157] font-mono">{pay.projectCode}</div>
                  </td>
                  <td className="p-3 text-[#1B3022]">{pay.district}</td>
                  <td className="p-3 text-[#1B3022]">{pay.beneficiaryAgency}</td>
                  <td className="p-3 text-right font-mono font-bold text-[#1B3022]">
                    ₹{(pay.amount / 100000).toFixed(2)} Lakh
                  </td>
                  <td className="p-3 font-mono text-[#588157]">{pay.paidAt}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF0E6] text-[#395C40] border border-[#C8D5B9]">
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
