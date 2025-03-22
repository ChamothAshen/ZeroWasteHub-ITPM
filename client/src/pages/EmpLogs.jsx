import React, { useState } from 'react';
import Sidebar from "./EmpSidebar";
import { Search, Filter, Calendar, MapPin, Users, Building2, RefreshCw } from 'lucide-react';

export default function EmpLogs({ teams = [], employees = [], logs = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar className="w-64 fixed h-full bg-white shadow-lg" />

      {/* Main Content */}
      <div className="flex-1 p-8 lg:ml-64">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Activity Logs</h2>
          <p className="text-slate-500">Track and manage team activities</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search logs..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <select
                  className="pl-10 pr-8 py-2.5 rounded-lg border border-slate-200 bg-white appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <option value="">All Teams</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>Team {team.id}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <select
                  className="pl-10 pr-8 py-2.5 rounded-lg border border-slate-200 bg-white appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">All Employees</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.name}>{employee.name}</option>
                  ))}
                </select>
              </div>

              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <Filter className="h-5 w-5" />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left py-4 px-6 text-slate-600 font-semibold">Date</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-semibold">Team</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-semibold">Employee</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-semibold">Location</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-semibold">Amounts</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-700">
                            {new Date(log.date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-700">Team {log.teamId}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            {log.employeeName.charAt(0)}
                          </div>
                          <span className="text-slate-700">{log.employeeName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-700">{log.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1.5">
                          {log.amounts &&
                            Object.entries(log.amounts).map(([type, amount]) => (
                              <div key={type} className="flex items-center justify-between text-sm bg-slate-50 px-3 py-1 rounded">
                                <span className="text-slate-600">{type}</span>
                                <span className="font-medium text-slate-700">{amount} kg</span>
                              </div>
                            ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                            log.status === "Pending Approval"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${
                            log.status === "Pending Approval" ? "text-amber-500" : "text-emerald-500"
                          }`} />
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-slate-400" />
                        <p>No logs available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}