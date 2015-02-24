(function(d3, fc) {
    'use strict';

    fc.layouts.navigator = function() {

        var event = d3.dispatch('navigate');

        var chart = fc.layouts.basicTimeSeries()
            .decorate(function(selection) {
                selection.select('g.x-axis')
                    .attr('layout-css', 'position: absolute; right: 0; bottom: 0; left: 0');
                navigator.decorate.value.apply(this, arguments);
            });
        chart.xAxis()
            .orient('top')
            .ticks(3);
        chart.yAxis(null);
        chart.gridlines()
            .xTicks(3)
            .yTicks(0);
        chart.series(
            fc.series.multi()
                .series([
                    fc.series.area(),
                    fc.series.line()
                ])
        );

        var brush = d3.svg.brush()
            .on('brush', function() {
                event.navigate.call(navigator, brush.extent());
            });

        var navigator = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this)
                    .call(chart);

                brush.x(chart.xScale())
                    .extent(navigator.extent.value);

                container.selectOrAppend('g', 'brush')
                    .call(brush)
                    .selectAll('rect')
                    .attr('height', container.attr('layout-height'));
            });
        };

        navigator.decorate = fc.utilities.property(fc.utilities.fn.noop);
        // Cache extent as setting extent on brush before x causes issues
        navigator.extent = fc.utilities.property(null);

        d3.rebind(navigator, chart, 'xScale', 'yScale', 'xAxis', 'yAxis', 'gridlines', 'series', 'layout');
        d3.rebind(navigator, brush);
        d3.rebind(navigator, event, 'on');

        return navigator;
    };

})(d3, fc);