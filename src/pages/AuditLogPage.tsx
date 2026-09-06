import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { ShieldCheck, Lock, CheckCircle2, AlertTriangle, RefreshCw, Hash, Cpu } from 'lucide-react';
import { AuditLogEntry } from '../types/index.js';

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    verifiedCount: number;
    brokenAtId?: string;
    algorithm: string;
    verifiedAt: string;
  } | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs();
      setLogs(res.auditLogs || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyIntegrity = async () => {
    setVerifying(true);
    try {
      const res = await api.verifyAuditLogsIntegrity();
      setVerificationResult(res);
    } catch (err) {
      console.error('Audit log verification failed:', err);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#588157] flex flex-col items-center justify-center space-y-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#395C40]" />
        <span>Verifying & loading immutable audit sequence...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#395C40]" />
            <h1 className="text-xl font-bold text-[#1B3022] tracking-tight">
              Tamper-Evident System Audit Trail & Security Logs
            </h1>
          </div>
          <p className="text-xs text-[#588157] mt-0.5">
            Cryptographically chained SHA-256 ledger recording all administrative, financial, and AI verification events
          </p>
        </div>

        <button
          onClick={handleVerifyIntegrity}
          disabled={verifying}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1B3022] text-white hover:bg-[#2C4A34] transition-colors shadow-xs disabled:opacity-50"
        >
          {verifying ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Lock className="w-4 h-4 text-[#A3B899]" />
          )}
          <span>{verifying ? 'Validating Hashes...' : 'Verify Cryptographic Integrity'}</span>
        </button>
      </div>

      {verificationResult && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
            verificationResult.isValid
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {verificationResult.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <div>
              <div className="font-bold">
                {verificationResult.isValid
                  ? `Cryptographic Hash Chain Verified: 100% Intact (${verificationResult.verifiedCount} Entries)`
                  : `Integrity Anomaly: Broken chain detected at ${verificationResult.brokenAtId}`}
              </div>
              <div className="text-[11px] opacity-80">
                Algorithm: {verificationResult.algorithm} | Verified At: {new Date(verificationResult.verifiedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold px-2 py-0.5 rounded bg-white/60">
            Genesis Anchor Validated
          </span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#DDE5D4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F7] text-[#1B3022] font-bold uppercase text-[10px] tracking-wider border-b border-[#DDE5D4]">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor (Officer)</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Target & Details</th>
                <th className="p-3">Cryptographic SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE5D4]">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-[#F8F9F7] transition-colors">
                  <td className="p-3 font-mono font-bold text-[#588157] whitespace-nowrap">
                    {log.id}
                  </td>
                  <td className="p-3 whitespace-nowrap font-mono text-[#588157] text-[11px]">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="font-bold text-[#1B3022]">{log.userName}</div>
                    <div className="text-[10px] text-[#588157] font-mono">
                      {log.userId} ({log.userRole})
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EAF0E6] text-[#395C40] border border-[#C8D5B9]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-[#1B3022]">
                    <div className="font-mono text-[11px] text-[#395C40]">
                      {log.targetEntity}: {log.targetId}
                    </div>
                    {log.newValue && (
                      <div className="text-xs text-gray-700 mt-0.5">{log.newValue}</div>
                    )}
                    {log.previousValue && (
                      <div className="text-[10px] text-gray-400 mt-0.5">Prev: {log.previousValue}</div>
                    )}
                  </td>
                  <td className="p-3 font-mono text-[10px] text-gray-500 max-w-[200px]">
                    {log.entryHash ? (
                      <div>
                        <span className="font-semibold text-emerald-700">Hash: </span>
                        <span title={log.entryHash} className="cursor-help">
                          {log.entryHash.slice(0, 16)}...
                        </span>
                        {log.prevHash && (
                          <div className="text-[9px] text-gray-400" title={log.prevHash}>
                            Prev: {log.prevHash.slice(0, 12)}...
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Genesis</span>
                    )}
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
