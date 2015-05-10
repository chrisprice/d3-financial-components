/* global fc, d3 */
(function(d3, fc) {
    'use strict';

    var data = fc.dataGenerator().startDate(new Date(2014, 1, 1))(50);

    var chart = d3.select('#fc-time-fc-linear-hide-weekend'),
        chartLayout = fc.test.chartLayout();

    chart.call(chartLayout);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
        .domain(fc.utilities.extent(data, 'date'))
        .range([0, chartLayout.getPlotAreaWidth()]);

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.utilities.extent(data, ['high', 'low']))
        .range([chartLayout.getPlotAreaHeight(), 0])
        .nice();

    // Create the axes
    var dateAxis = d3.svg.axis()
        .scale(dateScale)
        .orient('bottom')
        .ticks(10);

    var priceAxis = d3.svg.axis()
        .scale(priceScale)
        .orient('right')
        .ticks(5);

    // Add the axes to the chart
    chartLayout.getAxisContainer('bottom').call(dateAxis);
    chartLayout.getAxisContainer('right').call(priceAxis);

    // Create the gridlines
    var gridlines = fc.scale.gridlines()
        .xScale(dateScale)
        .yScale(priceScale)
        .xTicks(10);

    // Add the gridlines
    chartLayout.getPlotArea().append('g')
        .attr('class', 'gridlines')
        .call(gridlines);

    // Create the OHLC series
    var ohlc = fc.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add the primary OHLC series
    chartLayout.getPlotArea().append('g')
        .attr('class', 'series')
        .datum(data)
        .call(ohlc);

})(d3, fc);