var navigatorChartRecord = Immutable.Record({
    xScale: fc.scale.dateTime()
        .range([0, 500]),
    yScale: d3.scale.linear()
        .range([50, 0]),
    areaSeries: wrap(fc.series.area)()
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.close; })
});


function navigatorChart(options) {
    options = navigatorChartRecord(options);

    var xExtent = fc.util.extent()
        .fields(['date']);

    var yExtent = fc.util.extent()
        .fields(['close']);

    var dataJoin = fc.util.dataJoin()
        .children(true);

    function component(selection) {

        selection.each(function(data) {

            console.log('navigatorChart', Date.now());

            var rawData = data.toArray(); // <- Unwrap for extent

            options = options.update('xScale', function(x) {
                return x.domain(xExtent(rawData))
                  .copy();
            });

            options = options.update('yScale', function(x) {
                return x.domain(yExtent(rawData))
                  .copy();
            });

            options = options.update('areaSeries', function(x) {
                return x.xScale(options.xScale)
                  .yScale(options.yScale);
            });

            dataJoin(this, [data])
                .call(options.areaSeries);
        });
    }

    return component;
}
