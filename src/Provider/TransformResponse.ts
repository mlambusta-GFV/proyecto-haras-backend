export class TransformResponse {
    private _response: any;
    private readonly _isBody: boolean;
    private _data: any;

    constructor(response: any, isBody: boolean) {
        this._response = response
        this._isBody = isBody
        this._data = null
        if (this._isBody) {
            if (this._response.body !== undefined)
                this._data = this._response.body
        } else {
            if (this._response.query !== undefined)
                this._data = this._response.query
        }
    }

    getAsNumber(key: string, defaultValue: any) {
        if (this._data !== null)
            return this._data[key] === undefined || this._data[key] === "undefined" || this._data[key] === "null"
                ? defaultValue : Number(this._data[key])
        return defaultValue
    }

    getAsString(key: string, defaultValue: any) {
        if (this._data !== null)
            return this._data[key] === undefined || this._data[key] === "undefined" || this._data[key] === "null"
                ? defaultValue : this._data[key]
        return defaultValue
    }

    getAsDate(key: string, defaultValue: any) {
        if (this._data !== null)
            if (this._data[key] !== undefined) {
                if (!this._data[key].includes(":")){
                    const year = this._data[key].split("-")[0];
                    const month = this._data[key].split("-")[1];
                    const day = this._data[key].split("-")[2];
                    return new Date(year, month - 1, day, 0, 0, 0, 0)
                }
                else{
                    return this._data[key] === undefined ? defaultValue : new Date(this._data[key])
                }
            }
        return defaultValue
    }

    getAsJSON(key: string, defaultValue: any) {
        if (this._data !== null)
            return this._data[key] === undefined ? defaultValue : JSON.parse(this._data[key])
        return defaultValue
    }

    getNameFromFile(nameFile: string, defaultValue: any) {
        if (this._response.files !== undefined && this._response.files !== null && this._response.files[nameFile] !== undefined) {
            const imageProfileFile = this._response.files[nameFile];
            return imageProfileFile.name
        }
        return defaultValue
    }

    getArrayBufferFromFile(nameFile: string, defaultValue: any) {
        if (this._response.files !== undefined && this._response.files !== null && this._response.files[nameFile] !== undefined) {
            if (!Array.isArray(this._response.files[nameFile])) {
                const imageProfileFile = this._response.files[nameFile];
                return [{ name: imageProfileFile.name, arrayBuffer: imageProfileFile.data }]
            }
            else {
                const tmp = this._response.files[nameFile].map((file: any) => {
                    return { name: file.name, arrayBuffer: file.data }
                })

                return tmp;
            }
        }
        return defaultValue
    }

    getAsBoolean(key: string, defaultValue: any) {
        if (this._data !== null) {
            const data = this._data[key] === undefined || this._data[key] === "undefined" || this._data[key] === "null"
                ? defaultValue : this._data[key]
            if (data === true || data === "true" || data == 1)
                return true
            else
                return false
        }
        return defaultValue
    }
}