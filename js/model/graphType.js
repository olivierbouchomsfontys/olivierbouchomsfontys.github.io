class GraphType {
    _name;
    _type;

    constructor(name, type) {
        this._name = name;
        this._type = type;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }
}