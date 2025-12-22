
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  UserRound, 
  Bed as BedIcon, 
  Edit,
  FileText,
  CheckCircle,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Patient, FilterOptions, Bed } from '../types';
import { formatDate, calculateAge } from '../utils';
import { BEDS, INITIAL_ANTIBIOTICS } from '../constants';

interface DashboardProps {
  patients: Patient[];
  onEdit: (id: string) => void;
  onDischarge: (id: string, date: string) => void;
  onViewReport: (id: string) => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ patients, onEdit, onDischarge, onViewReport, onDelete }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    startDate: '',
    endDate: '',
    status: 'Todos',
    antibiotic: '',
    bed: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showDischargeModal, setShowDischargeModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [dischargeDate, setDischargeDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === 'Todos' || p.status === filters.status;
      const matchesBed = !filters.bed || p.bed === filters.bed;
      const matchesAntibiotic = !filters.antibiotic || p.antibiotics.includes(filters.antibiotic);
      
      const admissionTime = new Date(p.admissionDate).getTime();
      const startFilter = filters.startDate ? new Date(filters.startDate).getTime() : 0;
      const endFilter = filters.endDate ? new Date(filters.endDate).getTime() : Infinity;
      const matchesDate = admissionTime >= startFilter && admissionTime <= endFilter;

      return matchesSearch && matchesStatus && matchesBed && matchesAntibiotic && matchesDate;
    });
  }, [patients, searchTerm, filters]);

  const stats = useMemo(() => {
    const internados = patients.filter(p => p.status === 'Internado').length;
    const altas = patients.filter(p => p.status === 'Alta').length;
    return { internados, altas, total: patients.length };
  }, [patients]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <UserRound size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Geral</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
            <BedIcon size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Internados</p>
            <p className="text-2xl font-bold text-slate-900">{stats.internados}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Altas</p>
            <p className="text-2xl font-bold text-slate-900">{stats.altas}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome do paciente..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value as any})}
            >
              <option value="Todos">Status (Todos)</option>
              <option value="Internado">Internado</option>
              <option value="Alta">Alta</option>
            </select>
            <select 
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
              value={filters.bed}
              onChange={(e) => setFilters({...filters, bed: e.target.value})}
            >
              <option value="">Leitos (Todos)</option>
              {BEDS.map(bed => <option key={bed} value={bed}>{bed}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Paciente</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Idade</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Leito</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Antibióticos</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="block font-bold text-slate-900">{p.name}</span>
                  <span className="text-xs text-slate-400">{p.parentage}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{calculateAge(p.birthDate)}a</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 rounded font-bold text-xs text-slate-600">L{p.bed}</span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-wrap gap-1">
                    {p.antibiotics.slice(0, 1).map(ab => (
                      <span key={ab} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded uppercase">{ab}</span>
                    ))}
                    {p.antibiotics.length > 1 && <span className="text-[10px] text-slate-400">+{p.antibiotics.length - 1}</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${p.status === 'Internado' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(p.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600"><Edit size={16}/></button>
                    <button onClick={() => onViewReport(p.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600"><FileText size={16}/></button>
                    {p.status === 'Internado' && (
                      <button onClick={() => setShowDischargeModal(p.id)} className="p-1.5 hover:bg-green-50 rounded text-slate-400 hover:text-green-600"><CheckCircle size={16}/></button>
                    )}
                    <button onClick={() => setShowDeleteModal(p.id)} className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Discharge Modal */}
      {showDischargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Confirmar Alta</h3>
            <input 
              type="date" 
              className="w-full border p-2 rounded mb-6" 
              value={dischargeDate}
              onChange={(e) => setDischargeDate(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowDischargeModal(null)} className="flex-1 py-2 text-slate-600 font-bold">Cancelar</button>
              <button onClick={() => { onDischarge(showDischargeModal, dischargeDate); setShowDischargeModal(null); }} className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold">Dar Alta</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Remover Paciente?</h3>
            <p className="text-sm text-slate-500 mb-8">Esta ação não pode ser desfeita. O registro será permanentemente excluído do sistema.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 py-3 text-slate-600 font-bold">Manter</button>
              <button onClick={() => { onDelete(showDeleteModal); setShowDeleteModal(null); }} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
