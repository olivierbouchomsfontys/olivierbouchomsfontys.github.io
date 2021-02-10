class ThreeDimensionalDataSet{
    name;
    url;
    xKey;
    yKey;
    zKey;

    getLabelKey() {
        return this.xKey;
    }

    getDataKey() {
        return this.yKey;
    }

    constructor(name, url, xKey, yKey, zKey) {
        this.name = name;
        this.url = url;
        this.xKey = xKey;
        this.yKey = yKey;
        this.zKey = zKey;
    }
}
