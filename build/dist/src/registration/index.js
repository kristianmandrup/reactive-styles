class Registration {
    registerStyles(styles) {
        styles = styles || this.styles;
    }
    // We have two different dependency maps
    // one keyed per type, one per name
    // ie. to allow styleObj.state
    registerDependencies(name, propertyNames) {
        this.dependencyMap.set(name, propertyNames);
        if (propertyNames.length == 0) {
            this.staticMap = this.staticMap || {};
            this.staticMap[name] = this.styles[name]();
            return this.typeMap.static.add(name); // list
        }
        if (propertyNames.length == 2) {
            return this.typeMap.any.add(name); // list
        }
        for (let prop of propertyNames) {
            this.typeMap[prop].add(name); // list
        }
        this.dependenciesRegistered = true;
        return this;
    }
}
//# sourceMappingURL=index.js.map