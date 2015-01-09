(function(d3, fc) {
    'use strict';

    var data = fc.utilities.dataGenerator()
        .seedDate(new Date(2014, 1, 1))
        .randomSeed('12345')
        .generate(50);

    var chart = d3.select('#bar'),
        chartLayout = fc.utilities.chartLayout();

    chart.call(chartLayout);

    // Calculate the scale domain
    var day = 8.64e7, // One day in milliseconds
        dateFrom = new Date(d3.min(data, function(d) { return d.date; }).getTime() - day),
        dateTo = new Date(d3.max(data, function(d) { return d.date; }).getTime() + day),
        priceFrom = d3.min(data, function(d) { return d.low; }),
        priceTo = d3.max(data, function(d) { return d.high; });

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .alignPixels(true)
        .domain([dateFrom, dateTo])
        .range([0, chartLayout.getPlotAreaWidth()])
        .nice();

    // Create scale for y axis
    var priceScale = fc.scale.linear()
        .alignPixels(true)
        .domain([priceFrom, priceTo])
        .range([chartLayout.getPlotAreaHeight(), 0])
        .nice();

    // Create the axes
    var dateAxis = d3.svg.axis()
        .scale(dateScale)
        .orient('bottom')
        .ticks(5);

    var priceAxis = d3.svg.axis()
        .scale(priceScale)
        .orient('right')
        .ticks(5);

    // Add the axes to the chart
    chartLayout.getAxisContainer('bottom').call(dateAxis);
    chartLayout.getAxisContainer('right').call(priceAxis);

    // Create the bar series
    var bar = fc.series.bar()
        .xScale(dateScale)
        .yScale(priceScale)
        .yValue(fc.utilities.valueAccessor('close'))
        .classForBar(function(d) {
            return 'bar-' + d.date.getDay();
        })
        .barWidth(9);

    // Add the primary bar series
    chartLayout.getPlotArea().append('g')
        .attr('class', 'series')
        .datum(data)
        .call(bar);

    // Create the Bollinger bands component
    var bollinger = fc.indicators.bollingerBands()
        .xScale(dateScale)
        .yScale(priceScale)
        .movingAverage(4)
        .standardDeviations(2);

    // Add it to the chart
    chartLayout.getPlotArea().append('g')
        .attr('class', 'bollinger-band')
        .datum(data)
        .call(bollinger);

    // Create a measure tool
    var measure = fc.tools.crosshairs()
        .xScale(dateScale)
        .yScale(priceScale)
        .snap(fc.utilities.seriesPointSnap(bar, data))
        .on('trackingstart', function() { chartLayout.getPlotAreaBackground().style('fill', '#efe'); })
        .on('trackingmove', function() { console.log('trackingmove', this, arguments); })
        .on('freeze', function() { console.log('freeze', this, arguments); })
        .on('unfreeze', function() { console.log('unfreeze', this, arguments); })
        .on('trackingend', function() { chartLayout.getPlotAreaBackground().style('fill', ''); })
        .decorate(function(selection) {
            selection.enter()
                .select(function() {
                    // https://github.com/mbostock/d3/issues/2182
                    return d3.select(this).select('g.crosshairs').node();
                })
                .append('rect')
                .attr('class', 'example')
                .attr('width', 50)
                .attr('height', 50)
                .style('opacity', 0.5);
            selection.select('rect.example')
                .attr('x', function(d) { return d.x - 25; })
                .attr('y', function(d) { return d.y - 25; })
                .classed({
                    'bar-1': function(d) { return d.datum && d.datum.date && d.datum.date.getDay() === 1; },
                    'bar-2': function(d) { return d.datum && d.datum.date && d.datum.date.getDay() === 2; },
                    'bar-3': function(d) { return d.datum && d.datum.date && d.datum.date.getDay() === 3; },
                    'bar-4': function(d) { return d.datum && d.datum.date && d.datum.date.getDay() === 4; },
                    'bar-5': function(d) { return d.datum && d.datum.date && d.datum.date.getDay() === 5; }
                });
        });

    // Add it to the chart
    chartLayout.getPlotArea()
        .append('g')
        .attr('class', 'crosshairs-container')
        .call(measure);

})(d3, fc);
