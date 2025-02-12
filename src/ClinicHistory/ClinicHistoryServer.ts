import { HarasSystem } from "../HarasSystem";
import { ClinicHistory } from "./ClinicHistory";
import logger from "../../logger";
import { TransformResponse } from "../Provider/TransformResponse";
import { exceptions } from "winston";

export class ClinicHistoryServer {
    private _system: HarasSystem;

    constructor(server: any, system: HarasSystem) {
        this._system = system
        this.registerOn(server)
    }

    private async registerOn(server: any) {
        server.post("/clinicHistory/appointments", async (request: any, response: any) => this.createAppointment(request, response))

        server.post("/clinicHistory/appointments/batch", async (request: any, response: any) => this.createAppointmentBatch(request, response))

        server.put("/clinicHistory/appointments/:id", async (request: any, response: any) => this.updateAppointment(request, response))

        server.get("/clinicHistory/appointments/horse/:idHorse", async (request: any, response: any) => this.getAllAppointmentByHorse(request, response))

        server.get("/clinicHistory/appointments", async (request: any, response: any) => this.filterAppointment(request, response))

        server.get("/clinicHistory/appointments/lastAppointmentByHorse", async (request: any, response: any) => this.findLastAppointmentByHorse(request, response))

        server.delete("/clinicHistory/appointments/:id", async (request: any, response: any) => this.deleteAppointment(request, response))

        server.delete("/clinicHistory/diagnosis/:id", async (request: any, response: any) => this.deleteDiagnosis(request, response))

        server.delete("/clinicHistory/treatment/:id", async (request: any, response: any) => this.deleteTreatment(request, response))

        server.delete("/clinicHistory/interventions/:id", async (request: any, response: any) => this.deleteIntervention(request, response))

        server.post("/clinicHistory/diagnosis", async (request: any, response: any) => this.addDiagnosis(request, response))

        server.put("/clinicHistory/diagnosis/:id", async (request: any, response: any) => this.updateDiagnosis(request, response))

        server.post("/clinicHistory/treatments", async (request: any, response: any) => this.addTreatments(request, response))

        server.put("/clinicHistory/treatments/:id", async (request: any, response: any) => this.updateTreatments(request, response))

        server.post("/clinicHistory/interventions", async (request: any, response: any) => this.addIntervention(request, response))

        server.put("/clinicHistory/interventions/:id", async (request: any, response: any) => this.updateIntervention(request, response))

        server.post("/clinicHistory/attachment/interventions/:id", async (request: any, response: any) => this.addAttachmentToIntervention(request, response))
    }

    async executeSystemAction(systemAction: () => any, req: any, res: any) {
        try {
            await this._system.beginTransaction()
            const data = await systemAction();
            await this._system.commitTransaction()
            res.status(200);
            if (data !== undefined)
                res.send(data);
            else
                res.send({ status: "ok" });
        } catch (error) {
            logger.error(`Error in clinic history. Error: ${error.message}`)

            await this._system.rollbackTransaction()
            res.status(400);
            res.json({ msg: error.message });
        }
    }

    private async updateTreatments(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const convert = new TransformResponse(request, true)
        const id = request.params.id
        const diagnosisId = convert.getAsNumber("diagnosisId", null)
        const name = convert.getAsString("name", null)
        const description = convert.getAsString("description", null)
        const startDate = convert.getAsDate("startDate", null)
        const endDate = convert.getAsDate("endDate", null)

        this.executeSystemAction(async () => {
            return await clinicHistory.updateTreatmentById(id, diagnosisId, name, description, startDate, endDate)
        }, request, response)
    }


    private async addTreatments(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const convert = new TransformResponse(request, true)
        const diagnosisId = convert.getAsNumber("diagnosisId", null)
        const name = convert.getAsString("name", null)
        const description = convert.getAsString("description", null)
        const startDate = convert.getAsDate("startDate", null)
        const endDate = convert.getAsDate("endDate", null)

        this.executeSystemAction(async () => {
            return await clinicHistory.addTreatment(diagnosisId, name, description, startDate, endDate)
        }, request, response)
    }

    private async addIntervention(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const convert = new TransformResponse(request, true)
        const appointmentId = convert.getAsNumber("appointmentId", null)
        const typeId = convert.getAsNumber("typeId", null)
        const description = convert.getAsString("description", null)

        this.executeSystemAction(async () => {
            return await clinicHistory.addIntervention(appointmentId, description, typeId)
        }, request, response)
    }

    private async updateIntervention(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const id = request.params.id
        const convert = new TransformResponse(request, true)
        const appointmentId = convert.getAsNumber("appointmentId", null)
        const typeId = convert.getAsNumber("typeId", null)
        const description = convert.getAsString("description", null)

        this.executeSystemAction(async () => {
            return await clinicHistory.updateIntervention(id, appointmentId, description, typeId)
        }, request, response)
    }

    private async addAttachmentToIntervention(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const interventionId = request.params.id
        const convert = new TransformResponse(request, true)
        const description = convert.getAsString("description", null)
        const attachmentFiles = convert.getArrayBufferFromFile("attachment", null)

        this.executeSystemAction(async () => {
            return await clinicHistory.addAttachmentToIntervention(interventionId, description, attachmentFiles)
        }, request, response)
    }

    private async addDiagnosis(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const convert = new TransformResponse(request, true)
        const appointmentId = convert.getAsNumber("appointmentId", null)
        const name = convert.getAsString("name", null)
        const description = convert.getAsString("description", null)
        const anamnesis = convert.getAsString("anamnesis", null)

        this.executeSystemAction(async () => {
            return await clinicHistory.addDiagnosis(appointmentId, name, description, anamnesis)
        }, request, response)
    }

    private async updateDiagnosis(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const convert = new TransformResponse(request, true)
        const id = request.params.id
        const appointmentId = convert.getAsNumber("appointmentId", null)
        const name = convert.getAsString("name", null)
        const description = convert.getAsString("description", null)
        const anamnesis = convert.getAsString("anamnesis", null)

        this.executeSystemAction(async () => {
            return await clinicHistory.updateDiagnosisById(id, appointmentId, name, description, anamnesis)
        }, request, response)
    }

    private async filterAppointment(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const convert = new TransformResponse(request, true)
        const page = convert.getAsNumber("page", 0)
        const limit = convert.getAsNumber("limit", 50)
        const search = convert.getAsString("search", "")
        const order = convert.getAsJSON("order", { field: "id", order: "DESC" })
        const filter = convert.getAsJSON("filter", [{}])

        this.executeSystemAction(async () => {
            const appointmentsFound = await clinicHistory.filterAppointment(search, filter, page, limit, order)
            return {
                "total": appointmentsFound[1],
                "page": page,
                "rows": appointmentsFound[0]
            }
        }, request, response)
    }

    private async createAppointment(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const convert = new TransformResponse(request, true)
        const horseId = convert.getAsNumber("horseId", null)
        const veterinarianId = convert.getAsNumber("veterinarianId", null)
        const veterinarianAssistantId = convert.getAsNumber("veterinarianAssistantId", null)
        const name = convert.getAsString("name", null)
        const info = convert.getAsString("info", null)
        const date = convert.getAsDate("date", null)

        this.executeSystemAction(async () => {
            return await clinicHistory.addAppointment(horseId, veterinarianId, veterinarianAssistantId, info, date, name)
        }, request, response)
    }

    private async createAppointmentBatch(request: any, response: any) {
        this.executeSystemAction(async () => {
            try {
                const clinicHistory = this._system.clinicHistory()
                const convert = new TransformResponse(request, true)
                const horses = convert.getAsJSON("horses", null)
                const veterinarianId = convert.getAsNumber("veterinarianId", null)
                const veterinarianAssistantId = convert.getAsNumber("veterinarianAssistantId", null)
                const name = convert.getAsString("name", null)
                const info = convert.getAsString("info", null)
                const date = convert.getAsDate("date", null)
                const interventionInfo = convert.getAsString("interventionInfo", null)
                const interventionType = convert.getAsNumber("interventionType", null)
                let altas = 0;
                if (horses != null) {
                    for (let index = 0; index < horses.length; index++) {
                        const horse = horses[index];
                        const appointment = await clinicHistory.addAppointment(horse, veterinarianId, veterinarianAssistantId, info, date, name)

                        if (interventionType !== null) {
                            const intervention = await clinicHistory.addIntervention(appointment.id, interventionInfo, interventionType)
                        }
                        altas++
                    }
                }
                return {"added": altas}
            }
            catch (error: any) {
                throw new Error(error.message)
            }
        }, request, response)
    }

    private async updateAppointment(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const id = request.params.id
        const convert = new TransformResponse(request, true)
        const horseId = convert.getAsNumber("horseId", null)
        const veterinarianId = convert.getAsNumber("veterinarianId", null)
        const veterinarianAssistantId = convert.getAsNumber("veterinarianAssistantId", null)
        const name = convert.getAsString("name", null)
        const info = convert.getAsString("info", null)
        const date = convert.getAsDate("date", null)

        this.executeSystemAction(async () => {
            return await clinicHistory.updateAppointmentById(id, horseId, veterinarianId, veterinarianAssistantId,
                info, date, name)
        }, request, response)
    }

    private async deleteAppointment(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const id = request.params.id

        this.executeSystemAction(async () => {
            return await clinicHistory.deleteAppointment(id)
        }, request, response)
    }

    private async deleteDiagnosis(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const id = request.params.id

        this.executeSystemAction(async () => {
            return await clinicHistory.deleteDiagnosis(id)
        }, request, response)
    }

    private async deleteTreatment(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const id = request.params.id

        this.executeSystemAction(async () => {
            return await clinicHistory.deleteTreatment(id)
        }, request, response)
    }

    private async deleteIntervention(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const id = request.params.id

        this.executeSystemAction(async () => {
            return await clinicHistory.deleteIntervention(id)
        }, request, response)
    }

    private async getAllAppointmentByHorse(request: any, response: any) {
        const clinicHistory = this._system.clinicHistory()
        const idHorse = request.params.idHorse
        const convert = new TransformResponse(request, true)
        const page = convert.getAsNumber("page", 0)
        const limit = convert.getAsNumber("limit", 50)

        this.executeSystemAction(async () => {
            const appointment = await clinicHistory.findAppointmentHorse(idHorse, () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_APPOINTMENT)
            }, limit, page)

            return {
                "total": appointment[1],
                "page": page,
                "rows": appointment[0]
            }
        }, request, response)
    }

    private async findLastAppointmentByHorse(request: any, response: any) {
        try {
            const clinicHistory = this._system.clinicHistory()
            const convert = new TransformResponse(request, false)
            const idHorse = convert.getAsNumber("idHorse", null)
            const lastAppointment = await clinicHistory.findLastAppointmentByHorse(idHorse)

            response.json(lastAppointment)
        } catch (error) {
            logger.error(`Error in clinic history. Error: ${error.message}`)
            response.status(400);
            response.json({ msg: error.message });
        }

    }
}