(function(d3, fc) {
    'use strict';

    // SVG viewbox constants
    var WIDTH = 1024, HEIGHT = 576;

    // Obviously you should use ES6 modules and mutiple files for this. I'm
    // trying to keep the example as simple (and copy/paste-able) as possible.
    var basecoin = {};

    basecoin.verticalLines = function() {

        return function(selection) {

            selection.each(function(data) {

                var xScale = d3.time.scale()
                    .domain([data[0].date, data[data.length - 1].date])
                    // Use the full width
                    .range([0, WIDTH]);

                // Use the simplest scale we can get away with
                var yScale = d3.scale.linear()
                    // Define an arbitrary domain
                    .domain([0, 1])
                    // Use the full height
                    .range([HEIGHT, 0]);

                var line = fc.annotation.line()
                    .value(function(d) { return d.date; })
                    .orient('vertical')
                    .xScale(xScale)
                    .yScale(yScale);

                d3.select(this)
                    .call(line);
            });
        };
    };

    basecoin.gridlines = function() {

        return function(selection) {

            selection.each(function(data) {

                // Use the simplest scale we can get away with
                var xScale = d3.scale.linear()
                    // Define an arbitrary domain
                    .domain([0, 1])
                    // Use the full width
                    .range([0, WIDTH]);

                // Use the simplest scale we can get away with
                var yScale = d3.scale.linear()
                    // Define an arbitrary domain
                    .domain([0, 1])
                    // Use the full height
                    .range([HEIGHT, 0]);

                var gridline = fc.annotation.gridline()
                    .xScale(xScale)
                    .yScale(yScale)
                    .xTicks(40)
                    .yTicks(20);

                d3.select(this)
                    .call(gridline);
            });
        };
    };

    basecoin.series = function() {

        return function(selection) {

            selection.each(function(data) {

                var xScale = d3.time.scale()
                    .domain([data[0].date, data[data.length - 1].date])
                    // Modify the range so that the series only takes up left half the width
                    .range([0, WIDTH * 0.5]);

                var yScale = d3.scale.linear()
                    .domain(fc.util.extent(data, ['low', 'high']))
                    // Modify the range so that the series only takes up middle third of the the width
                    .range([HEIGHT * 0.66, HEIGHT * 0.33]);

                var candlestick = fc.series.candlestick();

                fc.indicator.algorithm.bollingerBands()
                    // Modify the window size so that we more closely track the data
                    .windowSize(8)
                    // Modify the multiplier to narrow the gap between the bands
                    .multiplier(1)(data);

                fc.indicator.algorithm.exponentialMovingAverage()
                    // Use a different window size so that the indicators occasionally touch
                    .windowSize(3)(data);

                var bollingerBands = fc.indicator.renderer.bollingerBands();

                var ema = fc.series.line()
                    // Reference the value computed by the EMA algorithm
                    .yValue(function(d) { return d.exponentialMovingAverage; });

                var multi = fc.series.multi()
                    .xScale(xScale)
                    .yScale(yScale)
                    .series([candlestick, bollingerBands, ema])
                    .decorate(function(g) {
                        g.enter()
                            .attr('class', function(d, i) {
                                return ['candlestick', 'bollinger-bands', 'ema'][i];
                            });
                    });

                d3.select(this)
                    .call(multi);
            });
        };
    };

    var dataGenerator = fc.data.random.financial()
        .mu(0.2)                     // % drift
        .sigma(0.05)                 // % volatility
        .filter(fc.util.fn.identity) // don't filter weekends
        .startDate(new Date(2014, 1, 1));

    var data = dataGenerator(300);

    data.forEach(function(d, i) {
        // Mark data points which match the sequence
        var sequenceValue = (i % (data.length / 2)) / 10;
        d.highlight = [1, 2, 3, 5, 8].indexOf(sequenceValue) > -1;
    });

    var verticalLines = basecoin.verticalLines();

    d3.select('#vertical-lines')
        // Filter to only show vertical lines for the marked data points
        .datum(data.filter(function(d) { return d.highlight; }))
        .call(verticalLines);

    var gridlines = basecoin.gridlines();

    d3.select('#gridlines')
        .call(gridlines);

    var series = basecoin.series();

    d3.select('#series')
        // Filter to only show the series for the first half of the data
        .datum(data.filter(function(d, i) { return i < 150; }))
        .call(series);

})(d3, fc);
