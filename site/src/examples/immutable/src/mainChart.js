var mainChartRecord = Immutable.Record({
    dateDomain: [new Date() - 1, new Date()],
    candlestickSeries: candlestickSeries()
});

function mainChart(options) {
    options = mainChartRecord(options);

    var bisector = d3.bisector(function(d) { return d.date; });

    var xScale = fc.scale.dateTime()
        .range([0, 500]);

    var yScale = d3.scale.linear()
        .range([200, 0]);

    var yExtent = fc.util.extent()
        .fields(['high', 'low'])
        .pad(0.1);

    var dataJoin = fc.util.dataJoin()
        .children(true);

    function component(selection) {

        selection.each(function(data) {

            console.log('mainChart', Date.now());

            data = data.toArray();

            xScale.domain(options.dateDomain);

            var visibleData = data.slice(
                // Pad and clamp the bisector values to ensure extents can be calculated
                Math.max(0, bisector.left(data, options.dateDomain[0]) - 1),
                Math.min(bisector.right(data, options.dateDomain[1]) + 1, data.length)
            );
            yScale.domain(yExtent(visibleData));

            options = options.update('candlestickSeries', function(x) {
                return x.xScale(xScale)
                  .yScale(yScale);
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
