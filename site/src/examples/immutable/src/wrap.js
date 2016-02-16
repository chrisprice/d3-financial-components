function wrap(componentFactory) {
    return function proxyFactory(options) {
        options = options || Immutable.OrderedMap();
        var component = componentFactory();
        options.forEach(function(value, key) {
            component[key].apply(component, value.toJS());
        });
        var dataJoin = fc.util.dataJoin()
            .children(true);
        function proxy(selection) {
            selection.each(function(data) {
                dataJoin(this, [data.toJS()])
                    .call(component);
            });
        }
        Object.keys(component)
            .forEach(function(key) {
                proxy[key] = function() {
                    var args = Immutable.List(arguments);
                    var updatedOptions = options.set(key, args);
                    return updatedOptions.equals(options) ?
                        proxy : proxyFactory(updatedOptions);
                };
            });
        return proxy;
    };
}
