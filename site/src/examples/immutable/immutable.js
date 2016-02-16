d3.selection.prototype.call = function(callback) {
    return this.each(function() {
        var previous = this.__previous__ || Immutable.Map();
        var current = previous.merge({
            callback: callback,
            data: this.__data__
        });
        if (!previous.equals(current)) {
            this.__previous__ = current;
            callback.call(this, d3.select(this));
        }
    });
};

(function() {

    var container = d3.select('#immutable');

    var dataGenerator = fc.data.random.financial()
        .startDate(new Date(2014, 1, 1));
    var data = Immutable.List(dataGenerator(250)); // <-- Make data immutable

    var _chart = chart()
        .dateDomain([data.get(200).date, data.last().date]); // <-- NICE!

    container.on('click', function() {
        _chart = _chart.dateDomain([data.first().date, data.last().date]);
        render();
    });

    var render = fc.util.render(function() {
        container.datum(data)
        .call(_chart);
    });

    render();

})();
