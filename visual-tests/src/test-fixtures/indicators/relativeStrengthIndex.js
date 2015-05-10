/* global fc, d3 */
(function(d3, fc) {
    'use strict';

    var data = fc.dataGenerator().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#rsi')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.utilities.extent(data, 'date'))
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain([0, 100]) // Perctange scale
        .range([height, 0])
        .nice();

    // Create the relative strength indicator component
    var rsi = fc.indicators.relativeStrengthIndicator()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(rsi);

})(d3, fc);