
import React, { useRef } from 'react';
import { ChevronLeft, Printer, FileText, Download, User, Calendar, Bed as BedIcon, Stethoscope, Pill, ClipboardCheck } from 'lucide-react';
import { Patient } from '../types';
import { formatDate, calculateAge } from '../utils';

interface PatientReportProps {
  patient: Patient;
  onBack: () => void;
}

const PatientReport: React.FC<PatientReportProps> = ({ patient, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const age = calculateAge(patient.birthDate);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6 no-print">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Voltar ao Dashboard</span>
        </button>
        <button 
          onClick={handlePrint}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-800 transition-colors shadow-lg"
        >
          <Printer size={18} />
          <span>Imprimir PDF</span>
        </button>
      </div>

      <div id="report-content" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8 md:p-12">
        {/* Header Report */}
        <div className="flex flex-col md:flex-row md:items-start justify-between border-b-2 border-slate-100 pb-8 mb-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <FileText size={24} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Relatório de Internamento</h1>
            </div>
            <p className="text-slate-500 font-medium">UPA Pediátrica - Controle Assistencial</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Protocolo Interno</p>
            <p className="text-lg font-mono font-bold text-slate-700"># {patient.id.toUpperCase()}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {/* Dados do Paciente */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
              <User size={14} />
              <span>Identificação do Paciente</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Nome Completo</p>
                <p className="text-lg font-bold text-slate-900">{patient.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Idade</p>
                  <p className="font-semibold text-slate-700">{age} anos</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Sexo</p>
                  <p className="font-semibold text-slate-700">{patient.sex}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Filiação/Responsável</p>
                <p className="font-semibold text-slate-700">{patient.parentage}</p>
              </div>
            </div>
          </div>

          {/* Internamento Status */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
              <Calendar size={14} />
              <span>Status de Internamento</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status Atual</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${patient.status === 'Internado' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {patient.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Leito</p>
                  <p className="font-black text-slate-900 text-xl">{patient.bed}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Data Entrada</p>
                  <p className="font-semibold text-slate-700">{formatDate(patient.admissionDate)}</p>
                </div>
                {patient.dischargeDate && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Data Saída</p>
                    <p className="font-semibold text-green-700">{formatDate(patient.dischargeDate)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Clínica */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
              <Stethoscope size={14} />
              <span>Avaliação Clínica e Tratamento</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-blue-500">
              <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Suspeita Diagnóstica</p>
                <p className="text-slate-800 leading-relaxed font-medium">{patient.diagnosisSuspect}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wider">Esquema Antibiótico Ativo</p>
                <div className="flex flex-wrap gap-2">
                  {patient.antibiotics.map(ab => (
                    <span key={ab} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-black rounded-lg shadow-sm uppercase">
                      {ab}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Regulação */}
          {patient.regulationRegistered && (
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                <ClipboardCheck size={14} />
                <span>Dados de Regulação</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status Regulação</p>
                  <p className="font-bold text-slate-800 uppercase text-sm">CADASTRADO E AGUARDANDO VAGA / TRANSFERÊNCIA</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Protocolo Regulação</p>
                  <p className="font-mono font-black text-blue-700 text-lg">{patient.regulationProtocol}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Print Only Footer */}
        <div className="hidden print:block mt-24 border-t border-slate-200 pt-8 text-center space-y-12">
          <div className="flex justify-around items-end">
            <div className="w-64 border-t-2 border-slate-900 pt-2">
              <p className="text-xs font-bold uppercase">Carimbo e Assinatura Médica</p>
            </div>
            <div className="w-64 border-t-2 border-slate-900 pt-2">
              <p className="text-xs font-bold uppercase">Enfermagem de Plantão</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">Documento gerado eletronicamente pelo sistema UPA Pediátrica em {new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientReport;
