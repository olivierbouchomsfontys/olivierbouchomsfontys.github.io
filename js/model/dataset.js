class Dataset{
    name;
    url;
    dataKey;
    labelKey;

    getDataKey() {
        return this.dataKey;
    }

    getLabelKey() {
        return this.labelKey;
    }

    constructor(name, url, dataKey, labelKey) {
        this.name = name;
        this.url = url;
        this.dataKey = dataKey;
        this.labelKey = labelKey;
    }
}
