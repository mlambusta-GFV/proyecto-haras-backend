/* eslint-disable @typescript-eslint/ban-ts-comment */
export class Filter {
    private _columnsName: string[];
    private _condition: string[];
    private _types: string[];
    private _columnsSearch: string[];
    private _tabla: string;

    static readonly ERROR_INVALID_FILTER_TYPE = "This filter is invalid"
    static readonly ERROR_INVALID_FILTER_CONDITION = "This condition is invalid"
    static readonly ERROR_INVALID_FILTER_NAME = "This name is invalid";
    static readonly ERROR_EMPTY_TABLA = "Tabla is empty"

    private static assertValidColumnToSearch(columnNames: string[], columnsToSearch: string[]): void {
        const isValidCondition = columnsToSearch.every(
            (columnSearch: string) => columnNames.some((columnName: string) => columnName === columnSearch))
        if (!isValidCondition) {
            throw new Error(Filter.ERROR_INVALID_FILTER_NAME)
        }
    }

    public static assertNotEmptyTabla(tabla: string) {
        if (tabla === null || tabla === undefined || tabla.trim().length === 0)
            throw new Error(Filter.ERROR_EMPTY_TABLA)
    }

    static initialize(tabla: string, columnNames: string[], condition: string[], types: string[], columnToSearch: string[]) {
        this.assertValidColumnToSearch(columnNames, columnToSearch)
        this.assertNotEmptyTabla(tabla)

        return new this(tabla, columnNames, condition, types, columnToSearch)
    }

    constructor(tabla: string, columnsName: string[], condition: string[], types: string[], columnsSearch: string[]) {
        this._tabla = tabla
        this._columnsName = columnsName;
        this._condition = condition;
        this._types = types;
        this._columnsSearch = columnsSearch;
    }

    private assertValidFilterType(filters: [{ name: string, values: [], condition: string, type: string }]): void {
        if (filters.length > 0) {
            const isValidFilter = filters.every(filter => this._types.some((type: string) => type === filter.type))
            if (!isValidFilter) {
                throw new Error(Filter.ERROR_INVALID_FILTER_TYPE)
            }
        }
    }

    private assertValidCondition(filters: [{ name: string, values: [], condition: string, type: string }]): void {
        if (filters.length > 0) {
            const isValidCondition = filters.every(filter => this._condition.includes(filter.condition))
            if (!isValidCondition) {
                throw new Error(Filter.ERROR_INVALID_FILTER_CONDITION)
            }
        }
    }

    private assertValidName(filters: [{ name: string, values: [], condition: string, type: string }]): void {
        if (filters.length > 0) {
            const isValidCondition = filters.every(filter => this._columnsName.some((type: string) => type === filter.name))
            if (!isValidCondition) {
                throw new Error(Filter.ERROR_INVALID_FILTER_NAME)
            }
        }
    }

    createWhere(textSearch: string, filters: [{ name: string, values: [], condition: string, type: string }]) {
        if (filters.length > 0 || textSearch.length > 0) {
            this.assertValidFilterType(filters)
            this.assertValidCondition(filters)
            this.assertValidName(filters)

            const filtersWithoutEmpty = this.deleteEmptyFilters(filters)

            let whereFiltersArray: any = []
            if (filtersWithoutEmpty.length > 0) {
                whereFiltersArray = filtersWithoutEmpty.map((filter: { name: string, values: [], condition: string, type: string }) => {
                    let columnName = filter.name
                    if (filter.type === "object") {
                        columnName += "._id"

                        const values = filter.values.join(",")
                        // @ts-ignore
                        return `${columnName} IN (${values})`
                    }
                    else if (filter.type === "boolean") {
                        let filterBol = false
                        // @ts-ignore
                        if (filter.values[0] === "true") {
                            filterBol = true
                        }

                        return `${this._tabla}._${columnName}  =  ${filterBol}`
                    }

                    if (filter.condition === "like") {
                        // @ts-ignore
                        return `${this._tabla}._${columnName} like '%${filter.values[0]}%'`
                    }

                    if (filter.condition === "between") {
                        // @ts-ignore
                        return `${this._tabla}._${columnName} between '${filter.values[0]}' AND '${filter.values[1]}'`
                    }

                    if (filter.condition === "<") {
                        // @ts-ignore
                        return `(${this._tabla}._${columnName} < '${filter.values[0]}' OR ${this._tabla}._${columnName} IS NULL)`
                    }

                    if (filter.condition === ">") {
                        // @ts-ignore
                        return `(${this._tabla}._${columnName} > '${filter.values[0]}' OR ${this._tabla}._${columnName} IS NULL)`
                    }

                    if (filter.condition === "<=") {
                        // @ts-ignore
                        return `(${this._tabla}._${columnName} <= '${filter.values[0]}' OR ${this._tabla}._${columnName} IS NULL)`
                    }

                    if (filter.condition === ">=") {
                        // @ts-ignore
                        return `(${this._tabla}._${columnName} >= '${filter.values[0]}' OR ${this._tabla}._${columnName} IS NULL)`
                    }

                    let values = filter.values.join("','")
                    values = "'" + values + "'"

                    return `${this._tabla}._${columnName} IN (${values})`
                })
            }
            const whereSearch = this.addSearch(textSearch)
            const whereFilter = whereFiltersArray.join(" AND ")

            let where = "";
            if (whereFilter.length > 0 && whereSearch.length > 0) {
                where = whereSearch + " AND " + whereFilter
            }
            else if (whereFilter.length == 0 && whereSearch.length > 0) {
                where = whereSearch
            }
            else {
                where = whereFilter
            }
            return where
        }
        return ""
    }

    private addSearch(textSearch: string) {
        if (textSearch.trim().length > 0) {
            const whereConditions = this._columnsSearch.map((columnSearch: string) => columnSearch.indexOf(".") !== -1 ? `${columnSearch} like "%${textSearch}%"` : `${this._tabla}._${columnSearch} like "%${textSearch}%"`)

            const where = whereConditions.join(" OR ")

            return "("+where+")"
        }
        return ""
    }

    private hasFilter(filters: { name: string; values: []; condition: string; type: string }) {
        return filters.name !== undefined;
    }

    private deleteEmptyFilters(filters: [{ name: string; values: []; condition: string; type: string }]) {
        return filters.filter(filter => this.hasFilter(filter))
    }
}