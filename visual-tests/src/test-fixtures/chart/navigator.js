(function(d3, fc) {
    'use strict';

    var dataGenerator = fc.data.random.financial()
        .startDate(new Date(2014, 1, 1));
    var data = dataGenerator(50);

    // Calculate the scale domain
    var day = 8.64e7, // One day in milliseconds,
        dateFrom = d3.min(data, function(d) { return d.date; }),
        dateTo = d3.max(data, function(d) { return d.date; }),
        priceFrom = d3.min(data, function(d) { return d.low; }),
        priceTo = d3.max(data, function(d) { return d.high; });

    var scale = fc.scale.dateTime()
        .domain([new Date(dateTo - 7 * day), dateTo]);

    var gridlines = fc.annotation.gridline()
        .xTicks(5)
        .yTicks(0);
    var line = fc.series.line()
        .yValue(function(d) { return d.open; });
    var area = fc.series.area()
        .yValue(function(d) { return d.open; });
    var multi = fc.series.multi()
        .series([gridlines, area, line]);

    var navigator = fc.chart.navigator()
        .scale(scale)
        .series(multi)
        .decorate(function(g) {
            g.enter()
                .select('rect.extent')
                .attr('fill', 'red');
        })
        .xDomain([dateFrom, dateTo])
        .xTicks(5)
        .yDomain([priceFrom, priceTo])
        .yNice();

    d3.select('#navigator')
        .append('svg')
        .style({
            height: '80px',
            width: '320px'
        })
        .datum(data)
        .call(navigator);

})(d3, fc);
