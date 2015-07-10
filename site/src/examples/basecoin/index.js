(function(d3, fc) {
    'use strict';

    // SVG viewbox constants
    var WIDTH = 1024, HEIGHT = 576;

    var dataGenerator = fc.data.random.financial()
        .mu(0.2)                     // % drift
        .sigma(0.05)                 // % volatility
        .filter(fc.util.fn.identity) // don't filter weekends
        .startDate(new Date(2014, 1, 1));

    var data = dataGenerator(150);

    var xScale = d3.time.scale()
        .domain([data[0].date, data[data.length - 1].date])
        // Modify the range so that the series only takes up left half the width
        .range([0, WIDTH * 0.5]);

    var yScale = d3.scale.linear()
        .domain(fc.util.extent(data, ['low', 'high']))
        // Modify the range so that the series only takes up middle third of the the width
        .range([HEIGHT * 0.66, HEIGHT * 0.33]);

    var candlestick = fc.series.candlestick()
        .xScale(xScale)
        .yScale(yScale);

    d3.select('#series')
        .datum(data)
        .call(candlestick);

})(d3, fc);
