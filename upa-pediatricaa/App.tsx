
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  LayoutDashboard, 
  FileText, 
  Database,
  Loader2
} from 'lucide-react';
import { Patient, ToastMessage } from './types';
import { calculateAge, generateId } from './utils';
import { api } from './api';
import Dashboard from './components/Dashboard';
import PatientForm from './components/PatientForm';
import PatientReport from './components/PatientReport';
import ToastContainer from './components/ToastContainer';

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [view, setView] = useState<'dashboard' | 'form' | 'report'>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'Conectado' | 'Desconectado'>('Conectado');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getPatients();
      setPatients(data);
      setDbStatus('Conectado');
    } catch (error) {
      setDbStatus('Desconectado');
      addToast('Erro ao carregar dados do banco', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = generateId();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const handleSavePatient = async (patientData: Partial<Patient>) => {
    setIsLoading(true);
    try {
      const age = calculateAge(patientData.birthDate || '');
      if (age > 12) addToast('Aviso: Paciente com idade > 12 anos', 'warning');

      await api.savePatient(patientData);
      await loadData();
      
      addToast(patientData.id ? 'Paciente atualizado!' : 'Paciente cadastrado!', 'success');
      setView('dashboard');
      setSelectedPatientId(null);
    } catch (error) {
      addToast('Erro ao salvar paciente', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDischarge = async (id: string, date: string) => {
    setIsLoading(true);
    try {
      await api.dischargePatient(id, date);
      await loadData();
      addToast('Alta realizada com sucesso!', 'success');
    } catch (error) {
      addToast('Erro ao processar alta', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await api.deletePatient(id);
      await loadData();
      addToast('Paciente removido do sistema', 'success');
    } catch (error) {
      addToast('Erro ao excluir paciente', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    setSelectedPatientId(id);
    setView('form');
  };

  const handleViewReport = (id: string) => {
    setSelectedPatientId(id);
    setView('report');
  };

  const selectedPatient = useMemo(() => 
    patients.find(p => p.id === selectedPatientId) || null
  , [patients, selectedPatientId]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 text-white shadow-lg no-print">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Users size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">UPA Pediátrica</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <Database size={16} className={dbStatus === 'Conectado' ? 'text-green-400' : 'text-red-400'} />
              <span className="text-slate-300">Banco:</span>
              <span className={dbStatus === 'Conectado' ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                {dbStatus}
              </span>
            </div>
            <button 
              disabled={isLoading}
              onClick={() => {
                setSelectedPatientId(null);
                setView('form');
              }}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors px-4 py-2 rounded-md flex items-center space-x-2 text-sm font-semibold"
            >
              <Plus size={18} />
              <span>Novo Paciente</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-50/50 z-40 flex items-center justify-center backdrop-blur-[1px]">
            <div className="bg-white p-4 rounded-full shadow-xl">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          </div>
        )}

        <nav className="mb-8 no-print">
          <ul className="flex space-x-1 border-b border-slate-200">
            <li>
              <button 
                onClick={() => setView('dashboard')}
                className={`px-4 py-2 flex items-center space-x-2 text-sm font-medium transition-colors border-b-2 ${view === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="animate-in fade-in duration-500">
          {view === 'dashboard' && (
            <Dashboard 
              patients={patients} 
              onEdit={handleEdit} 
              onDischarge={handleDischarge} 
              onViewReport={handleViewReport}
              onDelete={handleDelete}
            />
          )}
          {view === 'form' && (
            <PatientForm 
              initialData={selectedPatient} 
              onSave={handleSavePatient} 
              onCancel={() => {
                setView('dashboard');
                setSelectedPatientId(null);
              }}
            />
          )}
          {view === 'report' && selectedPatient && (
            <PatientReport 
              patient={selectedPatient} 
              onBack={() => setView('dashboard')} 
            />
          )}
        </div>
      </main>

      <ToastContainer toasts={toasts} />
      
      <footer className="bg-white border-t border-slate-200 py-4 no-print">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} UPA Pediátrica - Gestão Hospitalar
        </div>
      </footer>
    </div>
  );
};

export default App;
