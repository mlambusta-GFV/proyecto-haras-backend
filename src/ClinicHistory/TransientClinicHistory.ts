import { ClinicHistory } from "./ClinicHistory";
import { Appointment } from "./Appointment";
import { Diagnosis } from "./Diagnosis";
import { Treatment } from "./Treatment";
import { Interventions } from "./Interventions";

export class TransientClinicHistory extends ClinicHistory {
    cosolidatedHistoryConsolidation(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        throw new Error("Method not implemented.");
    }
    addAppointment(idHorse: number, idVeterinarian: number, idVeterinarianAssistant: number, information: string, date: Date, name: string): Promise<Appointment> {
        return Promise.resolve(undefined);
    }

    amountAppointment(): Promise<number> {
        return Promise.resolve(1);
    }

    containAppointmentId(id: number): Promise<boolean> {
        return Promise.resolve(false);
    }

    addDiagnosis(appointmentId: number, name: string, description: string, anamnesis: string): Promise<Diagnosis> {
        return Promise.resolve(undefined);
    }

    findAppointmentById(appointmentId: number, failedClosure: () => void): Promise<any> {
        return Promise.resolve(undefined);
    }

    findAppointmentHorse(idHorse: number, failedClosure: () => any, limit: number, page: number): Promise<Appointment[]> {
        return Promise.resolve(undefined);
    }

    addTreatment(diagnosisId: number, name: string, info: string, startDate: Date, endDate: Date): Promise<Treatment> {
        return Promise.resolve(undefined);
    }

    addIntervention(appointmentId: number, descriptions: string, typeId: number): Promise<Interventions> {
        return Promise.resolve(undefined);
    }

    addAttachmentToIntervention(interventionId: number, description: string, imageProfileArrayBuffer: any): Promise<void> {
        return Promise.resolve(undefined);
    }

    updateAppointmentById(appointmentId: number, idHorse: number, idVeterinarian: number, idVeterinarianAssistant: number, information: string, date: Date, name: string): Promise<Appointment> {
        return Promise.resolve(undefined);
    }

    updateDiagnosisById(diagnosisId: number, appointmentId: number, name: string, description: string, anamnesis: string): Promise<Diagnosis> {
        return Promise.resolve(undefined);
    }

    updateTreatmentById(idTreatment: number, diagnosisId: number, name: string, info: string, startDate: Date, endDate: Date): Promise<Treatment> {
        return Promise.resolve(undefined);
    }

    updateIntervention(interventionId: number, appointmentId: number, descriptions: string, typeId: number): Promise<Interventions> {
        return Promise.resolve(undefined);
    }

    filterAppointment(search: string, filters: any, page: number, limit: number, order: any): Promise<Appointment[]> {
        return Promise.resolve([]);
    }

    deleteAppointment(appointmentId: number): Promise<void> {
        return Promise.resolve(undefined);
    }

    deleteDiagnosis(diagnosisId: number): Promise<void> {
        return Promise.resolve(undefined);
    }

    deleteIntervention(interventionId: number): Promise<void> {
        return Promise.resolve(undefined);
    }

    deleteTreatment(diagnosisId: number): Promise<void> {
        return Promise.resolve(undefined);
    }

    findLastAppointmentByHorse(idHorse: number): Promise<any> {
        return Promise.resolve(undefined);
    }
}