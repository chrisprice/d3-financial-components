var mainChartRecord = Immutable.Record({
    dateDomain: [new Date() - 1, new Date()],
    xScale: fc.scale.dateTime()
        .range([0, 500]),
    yScale: d3.scale.linear()
        .range([200, 0]),
    candlestickSeries: wrap(fc.series.candlestick)()
});

function mainChart(options) {
    options = mainChartRecord(options);

    var bisector = d3.bisector(function(d) { return d.date; });

    var yExtent = fc.util.extent()
        .fields(['high', 'low'])
        .pad(0.1);

    var dataJoin = fc.util.dataJoin()
        .children(true);

    function component(selection) {

        selection.each(function(data) {

            console.log('mainChart', Date.now());

            options = options.update('xScale', function(x) {
                return x.domain(options.dateDomain.toArray())
                  .copy();
            });

            var rawData = data.toArray(); // <-- Unwrap for bisector operations
            var visibleData = data.slice(
                // Pad and clamp the bisector values to ensure extents can be calculated
                Math.max(0, bisector.left(rawData, options.dateDomain.get(0)) - 1),
                Math.min(bisector.right(rawData, options.dateDomain.get(1)) + 1, rawData.length)
            );

            options = options.update('yScale', function(x) {
                return x.domain(yExtent(visibleData.toArray()))
                  .copy();
            });

            options = options.update('candlestickSeries', function(x) {
                return x.xScale(options.xScale)
                  .yScale(options.yScale);
            });

            dataJoin(this, [visibleData])
                .call(options.candlestickSeries);
        });
    }

    component.dateDomain = function(x) {
        if (!arguments.length) {
            return options.get('dateDomain');
        }
        var updatedOptions = options.set('dateDomain', x);
        return options === updatedOptions ?
            component : mainChart(updatedOptions);
    };

    return component;
}
