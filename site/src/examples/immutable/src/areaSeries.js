var areaSeriesRecord = Immutable.Record({
    xScale: d3.scale.identity(),
    yScale: d3.scale.identity()
});

function areaSeries(options) {
    options = areaSeriesRecord(options);

    var dataJoin = fc.util.dataJoin()
        .children(true);

    var area = fc.series.area()
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.close; });

    function component(selection) {

        selection.each(function(data) {

            console.log('areaSeries', Date.now());

            area.xScale(options.xScale)
                .yScale(options.yScale);

            dataJoin(this, [data.toArray()]) // <- Convert back from Immutable structure for compatability
                .call(area);
        });
    }

    component.xScale = function(x) {
        if (!arguments.length) {
            return options.get('xScale');
        }
        var updatedOptions = options.set('xScale', x);
        return options === updatedOptions ?
            component : areaSeries(updatedOptions);
    };

    component.yScale = function(x) {
        if (!arguments.length) {
            return options.get('yScale');
        }
        var updatedOptions = options.set('yScale', x);
        return options === updatedOptions ?
            component : areaSeries(updatedOptions);
    };

    return component;
}
