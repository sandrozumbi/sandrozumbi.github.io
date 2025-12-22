
import { Patient } from './types';

/**
 * Serviço de API para comunicação com o backend.
 * Em ambiente Vercel, o prefixo /api é automaticamente roteado para Serverless Functions
 * ou para o backend configurado no vercel.json.
 */
const API_BASE_URL = '/api/patients';

export const api = {
  /**
   * READ - Lista todos os pacientes
   * GET /api/patients
   */
  getPatients: async (): Promise<Patient[]> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Erro na conexão com o servidor: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      throw error;
    }
  },

  /**
   * CREATE / UPDATE - Salva um novo registro ou atualiza um existente
   * POST /api/patients (Criação)
   * PUT /api/patients/:id (Edição)
   */
  savePatient: async (patient: Partial<Patient>): Promise<Patient> => {
    const isUpdate = !!patient.id;
    const url = isUpdate ? `${API_BASE_URL}/${patient.id}` : API_BASE_URL;
    const method = isUpdate ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patient),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
      throw new Error(errorData.message || `Erro ao salvar dados: ${response.status}`);
    }

    return await response.json();
  },

  /**
   * DELETE - Remove o registro do paciente permanentemente
   * DELETE /api/patients/:id
   */
  deletePatient: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Erro ao excluir registro: ${response.status}`);
    }
  },

  /**
   * DISCHARGE (ALTA) - Registra a saída do paciente
   * POST /api/patients/:id/discharge
   */
  dischargePatient: async (id: string, date: string): Promise<Patient> => {
    const response = await fetch(`${API_BASE_URL}/${id}/discharge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dischargeDate: date }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao processar alta: ${response.status}`);
    }

    return await response.json();
  }
};
