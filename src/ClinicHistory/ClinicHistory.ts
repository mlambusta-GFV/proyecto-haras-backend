import { Appointment } from "./Appointment";
import { Diagnosis } from "./Diagnosis";
import { Treatment } from "./Treatment";
import { Interventions } from "./Interventions";

export abstract class ClinicHistory {
    static readonly ERROR_CAN_NOT_FIND_APPOINTMENT = "Can not find appointment";
    static readonly ERROR_CAN_NOT_FIND_DIAGNOSIS = "Can not find diagnosis"
    static readonly ERROR_CAN_NOT_FIND_INTERVENTION = "Can not find intervention";
    static readonly ERROR_CAN_NOT_FIND_TREATMENT = "Can not find treatment";

    abstract addAppointment(idHorse: number, idVeterinarian: number, idVeterinarianAssistant: number, information: string,
        date: Date, name: string): Promise<Appointment>;

    abstract amountAppointment(): Promise<number>

    abstract containAppointmentId(id: number): Promise<boolean>

    abstract addDiagnosis(appointmentId: number, name: string, description: string, anamnesis: string): Promise<Diagnosis>

    abstract findAppointmentById(appointmentId: number, failedClosure: () => void): Promise<any | void>;

    abstract findAppointmentHorse(idHorse: number, failedClosure: () => any, limit: number, page: number): Promise<Appointment[]>

    abstract addTreatment(diagnosisId: number, name: string, info: string, startDate: Date, endDate: Date): Promise<Treatment>;

    abstract addIntervention(appointmentId: number, descriptions: string, typeId: number): Promise<Interventions>

    abstract addAttachmentToIntervention(interventionId: number, description: string, imageProfileArrayBuffer: any): Promise<void>;

    public abstract updateAppointmentById(appointmentId: number, idHorse: number, idVeterinarian: number, idVeterinarianAssistant: number,
        information: string, date: Date, name: string): Promise<Appointment>;

    abstract updateDiagnosisById(diagnosisId: number, appointmentId: number, name: string, description: string, anamnesis: string): Promise<Diagnosis>;

    abstract updateTreatmentById(idTreatment: number, diagnosisId: number, name: string, info: string, startDate: Date, endDate: Date): Promise<Treatment>;

    abstract updateIntervention(interventionId: number, appointmentId: number, descriptions: string, typeId: number): Promise<Interventions>;

    abstract filterAppointment(search: string, filters: any, page: number, limit: number, order: any): Promise<Appointment[]>;

    abstract deleteAppointment(appointmentId: number): Promise<void>;

    abstract deleteDiagnosis(diagnosisId: number): Promise<void>;

    abstract deleteTreatment(diagnosisId: number): Promise<void>;

    abstract deleteIntervention(interventionId: number): Promise<void>;

    abstract findLastAppointmentByHorse(idHorse: number): Promise<any>;

    abstract cosolidatedHistoryConsolidation(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]>;
}
