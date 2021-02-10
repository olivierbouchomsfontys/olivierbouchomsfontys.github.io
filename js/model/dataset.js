class Dataset{
    name;
    url;
    dataKey;
    labelKey;
    headers;

    getDataKey() {
        return this.dataKey;
    }

    getLabelKey() {
        return this.labelKey;
    }

    constructor(name, url, dataKey, labelKey, headers) {
        this.name = name;
        this.url = url;
        this.dataKey = dataKey;
        this.labelKey = labelKey;
        this.headers = headers;
    }
}
