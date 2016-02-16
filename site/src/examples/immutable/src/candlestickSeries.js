var candlestickSeriesRecord = Immutable.Record({
    xScale: d3.scale.identity(),
    yScale: d3.scale.identity()
});

function candlestickSeries(options) {
    options = candlestickSeriesRecord(options);

    var dataJoin = fc.util.dataJoin()
        .children(true);

    var candlestick = fc.series.candlestick();

    function component(selection) {

        selection.each(function(data) {

            console.log('candlestickSeries', Date.now());

            // data = data.toArray(); // <- Convert back from Immutable structure for compatability

            candlestick.xScale(options.xScale)
                .yScale(options.yScale);

            dataJoin(this, [data])
                .call(candlestick);
        });
    }

    component.xScale = function(x) {
        if (!arguments.length) {
            return options.get('xScale');
        }
        var updatedOptions = options.set('xScale', x);
        return options === updatedOptions ?
            component : candlestickSeries(updatedOptions);
    };

    component.yScale = function(x) {
        if (!arguments.length) {
            return options.get('yScale');
        }
        var updatedOptions = options.set('yScale', x);
        return options === updatedOptions ?
            component : candlestickSeries(updatedOptions);
    };

    return component;
}
