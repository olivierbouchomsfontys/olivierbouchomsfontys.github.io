class ThreeDimensionalDataSet{
    name;
    url;
    xKey;
    yKey;
    zKey;
    headers;

    constructor(name, url, xKey, yKey, zKey, headers) {
        this.name = name;
        this.url = url;
        this.xKey = xKey;
        this.yKey = yKey;
        this.zKey = zKey;
        this.headers = headers;
    }
}
