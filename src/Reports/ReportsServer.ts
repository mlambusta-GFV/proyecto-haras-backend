/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HarasSystem } from "../HarasSystem";
import { getTranslation } from "../Provider/Translator";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const basicAuth = require("basic-auth");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const xlsx = require("json-as-xlsx")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const htmlToPdf = require("html-pdf");
const options = {
    format: "A4"
};

const dataCompeticiones = [
    {
        sheet: "Competiciones",
        columns: [
            { label: "Jinete", value: "horseRider" },
            { label: "Caballo", value: "horse" },
            { label: "Club", value: "club" },
            { label: "Fecha", value: "date", format: "dd/MM/yyyy" },
            { label: "Altura", value: "jump" },
            { label: "Faltas", value: "faults" },
            { label: "Resultado", value: "result" },
            { label: "Link", value: "url" },
            { label: "Link Caballo", value: "horseURL" },
        ],
        content: [{}]
    }
]

const dataEducacion = [
    {
        sheet: "Educación",
        columns: [
            { label: "Caballo", value: "horse" },
            { label: "Responsable", value: "responsible" },
            { label: "Ubicacion", value: "location" },
            { label: "Fecha", value: "date", format: "dd/MM/yyyy" },
            { label: "Nombre", value: "name" },
            { label: "Observaciones", value: "description" },
            { label: "Link", value: "url" },
            { label: "Link Caballo", value: "horseURL" },
        ],
        content: [{}]
    }
]

const dataStock = [
    {
        sheet: "Stock",
        columns: [
            { label: "Caballo", value: "horse" },
            { label: "Fecha", value: "date", format: "dd/MM/yyyy" },
            { label: "Observaciones", value: "comment" },
            { label: "Stock", value: "stock" },
            { label: "Dosis Inseminables", value: "dosis" },
            { label: "Link Caballo", value: "horseURL" },
        ],
        content: [{}]
    }
]

const dataLocations = [
    {
        sheet: "Ubicaciones",
        columns: [
            { label: "Caballo", value: "horse" },
            { label: "Ubicacion", value: "location" },
            { label: "Responsable", value: "resposible" },
            { label: "Fecha de Inicio", value: "date", format: "dd/MM/yyyy" },
            { label: "Fecha de Fin", value: "departureDate", format: "dd/MM/yyyy" },
            { label: "Link Caballo", value: "horseURL" },
        ],
        content: [{}]
    }
]

const dataClinicHistory = [
    {
        sheet: "Historia clinica",
        columns: [
            { label: "Caballo", value: "Appointment_horse" },
            { label: "Fecha", value: "Appointment_date", format: "dd/MM/yyyy" },
            { label: "Profesional", value: "Appointment_veterinarian" },
            { label: "Asistente", value: "Appointment_veterinarianAssistant" },
            { label: "Cita", value: "Appointment_name" },
            { label: "Descripción Cita", value: "Appointment_description" },
            { label: "Diagnóstico", value: "Diagnosis_name" },
            { label: "Anamnesis", value: "Diagnosis_anamnesis" },
            { label: "Descripción Diag", value: "Diagnosis_description" },
            { label: "Tratamiento", value: "Treatment_name" },
            { label: "Descripción Trat.", value: "Treatment_info" },
            { label: "Inicio Trat", value: "Treatment_info", format: "dd/MM/yyyy" },
            { label: "Fin Trat", value: "Treatment_startDate", format: "dd/MM/yyyy" },
            { label: "Intervención", value: "Interventions_type" },
            { label: "Descripción Int.", value: "Interventions_description" },
            { label: "Link Caballo", value: "horseURL" },
        ],
        content: [{}]
    }
]

const dataYeguaGestanteWhitLastCycle = [
    {
        sheet: "YeguasGestante",
        columns: [
            { label: "Yegua Gestante", value: "name" },
            { label: "Yegua Madre", value: "motherMare" },
            { label: "Inseminada con Padre", value: "inseminatedWithFather" },
            { label: "Ubicación", value: "location" },
            { label: "Clasificación", value: "lastCycle" },
            { label: "Fecha de Inseminación", value: "inseminationDate", format: "dd/MM/yyyy" },
            { label: "Estimación de Parto", value: "estimatedBirthday", format: "dd/MM/yyyy" },
            { label: "Link Yegua Gestante", value: "pregnantMareURL" },
            { label: "Link Yegua Madre", value: "motherMareURL" },
            { label: "Link Padre", value: "inseminatedWithFatherURL" }
        ],
        content: [{}]
    }
]

const dataRecipientMares = [
    {
        sheet: "Yeguas Madres",
        columns: [
            { label: "Yegua Receptora", value: "recipientName" },
            { label: "Yegua Madre", value: "motherName" },
            { label: "Padrillo", value: "fatherName" },
            { label: "Cant. Hijos", value: "sons", format: "0" },
            { label: "Cant. Preñada", value: "pregnancies", format: "0" },
            { label: "Intentos", value: "attempts", format: "0" },
            { label: "Efectividad", value: "effectiveness", format: "0" },
            { label: "Link Yegua Receptora", value: "recipientURL" },
            { label: "Link Yegua Madre", value: "motherURL" },
            { label: "Link Padrillo", value: "fatherURL" }
        ],
        content: [{}]
    }
]

const dataMothersMares = [
    {
        sheet: "Yeguas Receptoras",
        columns: [
            { label: "Yegua Receptora", value: "recipientName" },
            { label: "Yegua Madre", value: "motherName" },
            { label: "Padrillo", value: "fatherName" },
            { label: "Cant. Hijos", value: "sons", format: "0" },
            { label: "Cant. Preñada", value: "pregnancies", format: "0" },
            { label: "Intentos", value: "attempts", format: "0" },
            { label: "Efectividad", value: "effectiveness", format: "0" },
            { label: "Link Yegua Madre", value: "motherURL" },
            { label: "Link Padrillo", value: "fatherURL" }
        ],
        content: [{}]
    }
]

const dataActiveMares = [
    {
        sheet: "Yeguas Activas",
        columns: [
            { label: "Yegua Activa", value: "mareName" },
            { label: "Yegua Madre", value: "motherName" },
            { label: "Padrillo", value: "fatherName" },
            { label: "Ubicación", value: "locationName" },
            { label: "Clasificación", value: "clasificationName" },
            { label: "Fecha De Inseminación", value: "inseminationDate" },
            { label: "Estimacion De parto", value: "estimationBirthDate" },
            { label: "Link Yegua Activa", value: "mareURL" },
            { label: "Link Yegua Madre", value: "motherURL" },
            { label: "Link Padrillo", value: "fatherURL" },
        ],
        content: [{}]
    }
]

const allHorses = [
    {
        sheet: "Caballos",
        columns: [
            { label: "ID", value: "id" },
            { label: "Nombre", value: "name" },
            { label: "Fecha de nacimiento", value: "dateOfBirth", format: "dd/MM/yyyy" },
            { label: "Ubicación", value: "location" },
            { label: "Sexo", value: "sex" },
            { label: "Veterinario/a", value: "veterinarian" },
            { label: "Pelaje", value: "fur" },
            { label: "Pedigree", value: "pedigree" },
            { label: "Madre", value: "mother" },
            { label: "Padre", value: "father" },
            { label: "Jinete", value: "rider" },
            { label: "Dueño", value: "owner" },
            { label: "Stock", value: "stock" },
            { label: "Dosis Inseminable", value: "dosis" },
            { label: "Observaciones", value: "observation" },
            { label: "Inicio doma", value: "startDressage" },
            { label: "Fin doma", value: "endDressage" },
            { label: "Clasificación", value: "classification" },
            { label: "Enlace", value: "horseURL" }
        ],
        content: [{}]
    }
]
const settings = {
    fileName: "Reporte", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeOptions: {
        type: "buffer",
        bookType: "xlsx"
    }, // Style options from https://github.com/SheetJS/sheetjs#writing-options
}

const auth = function (req: any, res: any, next: any) {
    const user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        res.set("WWW-Authenticate", "Basic realm=Authorization Required");
        res.sendStatus(401);
        return;
    }
    if (user.name === process.env.AUTH_USER_PBI && user.pass === process.env.AUTH_PASSWORD_PBI) {
        next();
    } else {
        res.set("WWW-Authenticate", "Basic realm=Authorization Required");
        res.sendStatus(401);
        return;
    }
}

const traslateJSON = function (json: unknown) {
    const result = {};
    Object.keys(json).forEach((element: string) => {
        // @ts-ignore
        result[getTranslation(element)] = json[element]
    })
    return result;
}

export class ReportsServer {
    private _system: HarasSystem;

    constructor(server: any, system: HarasSystem) {
        this._system = system
        this.registerOn(server)
    }

    private async registerOn(server: any) {

        server.get("/pbi/competitions", [auth], async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                    filter.push({ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" })
                }
                else {
                    filter = [{ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" }]
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: `_${auxorder.field}`,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "_horseRider",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const mediaCenter = this._system.mediaCenter()
                const report = await mediaCenter.getAllFileTrainings(search, filter, page, limit, order)
                const result = report[0].map(element => traslateJSON(element))

                response.json(result)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/pbi/inServiceMares", [auth], async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                }
                else {
                    filter = []
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: auxorder.field,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "mareName",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const historyClassification = this._system.historyClassification()
                const report = await historyClassification.inActivityMares(search, filter, page, limit, order)
                const result = report[0].map(element => traslateJSON(element))

                response.json(result)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/pbi/horses", [auth], async (request: any, response: any) => {
            try {
                const horses = this._system.horses()

                const report = await horses.exportHorses()
                const result = report.map((element: unknown) => traslateJSON(element))

                response.json(result)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/report/competitions", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                    filter.push({ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" })
                }
                else {
                    filter = [{ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" }]
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: `_${auxorder.field}`,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "_horseRider",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const mediaCenter = this._system.mediaCenter()
                const report = await mediaCenter.getAllFileTrainings(search, filter, page, limit, order)

                response.json({
                    "total": report[1],
                    "page": page,
                    "rows": report[0]
                })
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/export/competitions", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                    filter.push({ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" })
                }
                else {
                    filter = [{ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" }]
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: `_${auxorder.field}`,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "_horseRider",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const mediaCenter = this._system.mediaCenter()
                const report = await mediaCenter.getAllFileTrainings(search, filter, page, limit, order)
                dataCompeticiones[0].content = report[0];

                const buffer = xlsx(dataCompeticiones, settings)
                response.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-disposition": "attachment; filename=Reporte_Competiciones.xlsx",
                })
                response.end(buffer)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/report/education", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                    filter.push({ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" })
                }
                else {
                    filter = [{ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" }]
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: `_${auxorder.field}`,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "_horse",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const mediaCenter = this._system.mediaCenter()
                const report = await mediaCenter.getAllFileEducation(search, filter, page, limit, order)

                response.json({
                    "total": report[1],
                    "page": page,
                    "rows": report[0]
                })
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/export/education", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                    filter.push({ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" })
                }
                else {
                    filter = [{ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" }]
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: `_${auxorder.field}`,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "_horse",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const mediaCenter = this._system.mediaCenter()
                const report = await mediaCenter.getAllFileEducation(search, filter, page, limit, order)
                dataEducacion[0].content = report[0];

                const buffer = xlsx(dataEducacion, settings)
                response.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-disposition": "attachment; filename=Reporte_Educacion.xlsx",
                })
                response.end(buffer)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/report/horsesxlocations", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                }
                else {
                    filter = []
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: `_${auxorder.field}`,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "_horse",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const horses = this._system.horses()
                const horsesFound = await horses.getLocationHistory(search, filter, page, limit, order)

                response.json({
                    "total": horsesFound[1],
                    "page": page,
                    "rows": horsesFound[0]
                })
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/export/horsesxlocations", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                }
                else {
                    filter = []
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: `_${auxorder.field}`,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "_horse",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const horses = this._system.horses()
                const report = await horses.getLocationHistory(search, filter, page, limit, order)
                dataLocations[0].content = report[0];

                const buffer = xlsx(dataLocations, settings)
                response.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-disposition": "attachment; filename=Reporte_LocacionCaballos.xlsx",
                })
                response.end(buffer)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/report/stock", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                    filter.push({ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" })
                }
                else {
                    filter = [{ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" }]
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: `_${auxorder.field}`,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "_horse",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const historyClassification = this._system.historyClassification()
                const report = await historyClassification.getAllStock(search, filter, page, limit, order)

                response.json({
                    "total": report[1],
                    "page": page,
                    "rows": report[0]
                })
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/export/stock", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                    filter.push({ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" })
                }
                else {
                    filter = [{ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" }]
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: `_${auxorder.field}`,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "_horse",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const historyClassification = this._system.historyClassification()
                const report = await historyClassification.getAllStock(search, filter, page, limit, order)
                dataStock[0].content = report[0];

                const buffer = xlsx(dataStock, settings)
                response.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-disposition": "attachment; filename=Reporte_stock.xlsx",
                })
                response.end(buffer)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/report/clinicHistory", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                    filter.push({ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" })
                }
                else {
                    filter = [{ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" }]
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: `_${auxorder.field}`,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "_id",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const historyClassification = this._system.clinicHistory()
                const report = await historyClassification.cosolidatedHistoryConsolidation(search, filter, page, limit, order)

                response.json({
                    "total": report[1],
                    "page": page,
                    "rows": report[0]
                })
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/export/clinicHistory", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                    filter.push({ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" })
                }
                else {
                    filter = [{ "name": "deleted", "values": ["false"], "condition": "equal", "type": "boolean" }]
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: `_${auxorder.field}`,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "_Appointment_horse",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const historyClassification = this._system.clinicHistory()
                const report = await historyClassification.cosolidatedHistoryConsolidation(search, filter, page, limit, order)
                dataClinicHistory[0].content = report[0];

                const buffer = xlsx(dataClinicHistory, settings)
                response.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-disposition": "attachment; filename=Reporte_HistoriaClinica.xlsx",
                })
                response.end(buffer)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/export/mareActivity", async (request: any, response: any) => {
            try {
                let { page, limit, order } = request.query

                if (order !== undefined) {
                    order = JSON.parse(order)
                }
                else {
                    order = {
                        field: "id",
                        order: "DESC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const horses = this._system.horses()
                const horsesFound = await horses.getYeguaGestanteWhitLastCycleExport(page, limit)

                dataYeguaGestanteWhitLastCycle[0].content = horsesFound[0];

                const buffer = xlsx(dataYeguaGestanteWhitLastCycle, settings)
                response.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-disposition": "attachment; filename=Yeguas_Gestantes.xlsx",
                })
                response.end(buffer)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/report/performanceRecipientMares", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                }
                else {
                    filter = []
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: auxorder.field,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "recipientName",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const historyClassification = this._system.historyClassification()
                const report = await historyClassification.performanceRecipientMares(search, filter, page, limit, order)

                response.json({
                    "total": report[1],
                    "page": page,
                    "rows": report[0]
                })
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/export/performanceRecipientMares", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                }
                else {
                    filter = []
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: auxorder.field,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "recipientName",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const historyClassification = this._system.historyClassification()
                const report = await historyClassification.performanceRecipientMares(search, filter, page, limit, order)
                dataRecipientMares[0].content = report[0];

                const buffer = xlsx(dataRecipientMares, settings)
                response.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-disposition": "attachment; filename=Yeguas_Receptoras.xlsx",
                })
                response.end(buffer)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/report/performanceMothersMares", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                }
                else {
                    filter = []
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: auxorder.field,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "motherName",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const historyClassification = this._system.historyClassification()
                const report = await historyClassification.performanceMothersMares(search, filter, page, limit, order)

                response.json({
                    "total": report[1],
                    "page": page,
                    "rows": report[0]
                })
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/export/performanceMothersMares", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                }
                else {
                    filter = []
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: auxorder.field,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "motherName",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const historyClassification = this._system.historyClassification()
                const report = await historyClassification.performanceMothersMares(search, filter, page, limit, order)
                dataMothersMares[0].content = report[0];

                const buffer = xlsx(dataMothersMares, settings)
                response.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-disposition": "attachment; filename=Yeguas_Madres.xlsx",
                })
                response.end(buffer)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/report/inServiceMares", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                }
                else {
                    filter = []
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: auxorder.field,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "mareName",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const historyClassification = this._system.historyClassification()
                const report = await historyClassification.inActivityMares(search, filter, page, limit, order)


                response.json({
                    "total": report[1],
                    "page": page,
                    "rows": report[0]
                })
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/export/inServiceMares", async (request: any, response: any) => {
            try {
                let { page, limit, search, order, filter } = request.query

                if (search === undefined) {
                    search = ""
                }

                if (filter !== undefined) {
                    filter = JSON.parse(filter)
                }
                else {
                    filter = []
                }

                if (order !== undefined) {
                    const auxorder = JSON.parse(order);
                    order = {
                        field: auxorder.field,
                        order: auxorder.order
                    }
                }
                else {
                    order = {
                        field: "motherName",
                        order: "ASC"
                    }
                }

                if (page === undefined)
                    page = 0
                if (limit === undefined)
                    limit = 0

                const historyClassification = this._system.historyClassification()
                const report = await historyClassification.inActivityMares(search, filter, page, limit, order)
                dataActiveMares[0].content = report[0];

                const buffer = xlsx(dataActiveMares, settings)
                response.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-disposition": "attachment; filename=Yeguas_Activas.xlsx",
                })
                response.end(buffer)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/export/clinicHistoryPDF/:horseId", async (request: any, response: any) => {
            try {
                const horseId = request.params.horseId
                const historyClassification = this._system.historyClassification()
                const content = await historyClassification.clinicHistoryPDF(horseId)
                const date = new Date();
                const name = `Historia_Clinica_${date.toLocaleDateString("es-AR")}.pdf`
                htmlToPdf.create(content.trim(), options).toBuffer((err: any, buffer: any) => {
                    if (err) {
                        response.status(400).json({ msg: err.message })
                    } else {
                        response.writeHead(200, {
                            "Content-Type": "application/pdf",
                            "Content-disposition": "attachment; filename=" + name
                        })
                        response.end(buffer);
                    }
                });
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/export/allhorses", async (request: any, response: any) => {
            try {
                const horses = this._system.horses()

                const horsesFound = await horses.exportHorses()
                allHorses[0].content = horsesFound;

                const buffer = xlsx(allHorses, settings)
                response.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-disposition": "attachment; filename=Caballos.xlsx",
                })
                response.end(buffer)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/export/horses", async (request: any, response: any) => {
            try {


                const horses = this._system.horses()

                const horsesFound = await horses.exportHorses()

                response.json(horsesFound)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })
    }
}