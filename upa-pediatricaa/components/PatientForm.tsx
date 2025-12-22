
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Users, 
  Venus, 
  Stethoscope, 
  Pill, 
  Bed as BedIcon, 
  ClipboardCheck,
  ChevronLeft,
  Plus,
  X
} from 'lucide-react';
import { Patient, Sex, Bed } from '../types';
import { BEDS, INITIAL_ANTIBIOTICS } from '../constants';

interface PatientFormProps {
  initialData: Patient | null;
  onSave: (data: Partial<Patient>) => void;
  onCancel: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '',
    birthDate: '',
    parentage: '',
    sex: 'Masculino',
    diagnosisSuspect: '',
    antibiotics: [],
    bed: '01',
    admissionDate: new Date().toISOString().split('T')[0],
    regulationRegistered: false,
    regulationProtocol: ''
  });

  const [customAntibiotic, setCustomAntibiotic] = useState('');
  const [availableAntibiotics, setAvailableAntibiotics] = useState(INITIAL_ANTIBIOTICS);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Ensure any custom antibiotics are in the list
      const allAntibiotics = Array.from(new Set([...INITIAL_ANTIBIOTICS, ...initialData.antibiotics]));
      setAvailableAntibiotics(allAntibiotics);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleAntibiotic = (ab: string) => {
    const current = formData.antibiotics || [];
    if (current.includes(ab)) {
      setFormData({ ...formData, antibiotics: current.filter(item => item !== ab) });
    } else {
      setFormData({ ...formData, antibiotics: [...current, ab] });
    }
  };

  const addCustomAntibiotic = () => {
    if (customAntibiotic && !availableAntibiotics.includes(customAntibiotic)) {
      setAvailableAntibiotics([...availableAntibiotics, customAntibiotic]);
      toggleAntibiotic(customAntibiotic);
      setCustomAntibiotic('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {initialData ? 'Editar Registro de Paciente' : 'Cadastro de Novo Paciente'}
            </h2>
            <button 
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-1">Preencha todos os campos obrigatórios para manter o controle assistencial.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Section 1: Dados Pessoais */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
              <User size={16} />
              <span>Dados Pessoais</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nome Completo *</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="Nome da criança"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Filiação/Responsável *</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="Nome do pai ou mãe"
                  value={formData.parentage}
                  onChange={(e) => setFormData({...formData, parentage: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Data de Nascimento *</label>
                <input 
                  required
                  type="date" 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Sexo *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Masculino', 'Feminino', 'Outro'] as Sex[]).map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({...formData, sex: option})}
                      className={`py-2.5 px-2 rounded-xl border text-sm font-medium transition-all ${
                        formData.sex === option 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Dados de Internamento */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
              <Stethoscope size={16} />
              <span>Dados Clínicos e Internamento</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Suspeita Diagnóstica *</label>
              <textarea 
                required
                rows={2}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                placeholder="Ex: Pneumonia comunitária, ITU..."
                value={formData.diagnosisSuspect}
                onChange={(e) => setFormData({...formData, diagnosisSuspect: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700">Antibióticos em Tratamento *</label>
              <div className="flex flex-wrap gap-2">
                {availableAntibiotics.map(ab => (
                  <button
                    key={ab}
                    type="button"
                    onClick={() => toggleAntibiotic(ab)}
                    className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                      formData.antibiotics?.includes(ab)
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {ab}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                  placeholder="Outro antibiótico..."
                  value={customAntibiotic}
                  onChange={(e) => setCustomAntibiotic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAntibiotic())}
                />
                <button 
                  type="button"
                  onClick={addCustomAntibiotic}
                  className="bg-slate-100 p-2.5 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Leito *</label>
                <select 
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  value={formData.bed}
                  onChange={(e) => setFormData({...formData, bed: e.target.value as Bed})}
                >
                  {BEDS.map(bed => <option key={bed} value={bed}>Leito {bed}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Data de Entrada *</label>
                <input 
                  required
                  type="date" 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({...formData, admissionDate: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Section 3: Regulação */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
              <ClipboardCheck size={16} />
              <span>Regulação</span>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Cadastrado na Regulação?</span>
                <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, regulationRegistered: true})}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${formData.regulationRegistered ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'}`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, regulationRegistered: false, regulationProtocol: ''})}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${!formData.regulationRegistered ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-500'}`}
                  >
                    Não
                  </button>
                </div>
              </div>

              {formData.regulationRegistered && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <label className="text-sm font-semibold text-slate-700">Número de Protocolo *</label>
                  <input 
                    required={formData.regulationRegistered}
                    type="text" 
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    placeholder="Ex: 2023.123.456"
                    value={formData.regulationProtocol}
                    onChange={(e) => setFormData({...formData, regulationProtocol: e.target.value})}
                  />
                </div>
              )}
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex items-center space-x-4 pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
            >
              <ClipboardCheck size={20} />
              <span>Salvar Dados do Paciente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
