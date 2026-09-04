import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { ShieldCheck, Lock, FileSearch, Calendar, User } from 'lucide-react';

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuditLogs().then(res => {
      setLogs(res.auditLogs || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#588157]">Loading immutable audit logs...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#1B3022] tracking-tight">
          Immutable System Audit Trail & Security Logs
        </h1>
        <p className="text-xs text-[#588157]">
          Cryptographically timestamped record of all administrative, financial, and algorithmic actions
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#DDE5D4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F7] text-[#1B3022] font-bold uppercase text-[10px] tracking-wider border-b border-[#DDE5D4]">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor (Officer)</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Entity Target</th>
                <th className="p-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE5D4]">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-[#F8F9F7] transition-colors">
                  <td className="p-3 font-mono font-bold text-[#588157] whitespace-nowrap">{log.id}</td>
                  <td className="p-3 whitespace-nowrap font-mono text-[#588157] text-[11px]">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="font-bold text-[#1B3022]">{log.userName}</div>
                    <div className="text-[10px] text-[#588157] font-mono">{log.userId} ({log.userRole})</div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EAF0E6] text-[#395C40] border border-[#C8D5B9]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[#1B3022] whitespace-nowrap">{log.entityId}</td>
                  <td className="p-3 max-w-sm text-[#1B3022]">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
