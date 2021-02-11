class Dataset{
    name;
    url;
    dataKey;
    labelKey;
    headers;

    constructor(name, url, dataKey, labelKey, headers) {
        this.name = name;
        this.url = url;
        this.dataKey = dataKey;
        this.labelKey = labelKey;
        this.headers = headers;
    }
}
