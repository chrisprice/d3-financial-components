(function(d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(10);

    var width = 425, height = 400;

    var container = d3.select('#line-interpolate')
        .append('svg')
        .style({
            'stroke-opacity': 0.5,
            'stroke-width': 3
        })
        .attr('width', width)
        .attr('height', height);

    container.append('path')
        .style({
            'fill': 'none',
            'stroke': 'red'
        });

    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent().fields('date')(data))
        .range([0, width])
        .nice();

    var priceScale = d3.scale.linear()
        .domain(fc.util.extent().fields(['high', 'low'])(data))
        .range([height, 0])
        .nice();

    var color = d3.scale.category10();

    var lineSeries = fc.series.line()
        .xScale(dateScale)
        .yScale(priceScale)
        .yValue(function(d) { return d.open; })
        .interpolate('linear')
        .tension(0.75)
        .decorate(function(g) {
            g.style('stroke', function(d, i) {
                return color(i);
            });
        });

    var lineSvg = d3.svg.line()
        .x(function(d) { return dateScale(d.date); })
        .y(function(d) { return priceScale(d.open); });

    var interpolate = 'linear';
    var tension = '0.75';

    function render() {

        lineSeries.interpolate(interpolate)
            .tension(tension);

        lineSvg.interpolate(interpolate)
            .tension(tension);

        container.datum(data)
            .call(lineSeries)
            .select('path')
            .attr('d', lineSvg);
    }

    var interpolateSelect =  d3.select('#interpolate-select');
    interpolateSelect.on('change', function() {
        interpolate = interpolateSelect.property('value');
        render();
    });

    var tensionSelect =  d3.select('#tension-select');
    tensionSelect.on('change', function() {
        tension = tensionSelect.property('value');
        render();
    });

    render();

})(d3, fc);
