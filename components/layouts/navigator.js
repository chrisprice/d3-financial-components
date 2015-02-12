(function(d3, fc) {
    'use strict';

    fc.layouts.navigator = function() {

        var event = d3.dispatch('navigate');

        var chart = fc.layouts.basicTimeSeries()
            .decorate(function(selection) {
                selection.select('g.x-axis')
                    .attr('layout-css', 'position: absolute; right: 0; bottom: 0; left: 0');
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

                var container = d3.select(this);

                // Ideally the chart would be appended here...
                // ...in this case we could just lay things out again
                // but that's not exactly scalable.
                // ...we could also nest the component creation (BIG! STACK)

                container.call(chart);

                var brushContainer = container.selectOrAppend('g', 'brush');

                // navigator.decorate.value(container);

                // var BODGE = container.attr('transform');
                // navigator.layout.value(container,
                //     container.attr('layout-width'), container.attr('layout-height'));
                // container.attr('transform', BODGE);

                brush.x(chart.xScale())
                    .extent(navigator.extent.value);

                console.log(brush.x().range(), brush.x().domain(), brush.extent());

                brushContainer.call(brush)
                    .selectAll('rect')
                    .attr('height', container.attr('layout-height'));
            });
        };

        navigator.decorate = fc.utilities.property(fc.utilities.fn.noop);
        navigator.layout = fc.utilities.property(fc.utilities.layout());

        // setting extent before x causes issues
        navigator.extent = fc.utilities.property(null);

        d3.rebind(navigator, chart, 'xScale', 'yScale', 'xAxis', 'yAxis', 'gridlines', 'series');
        d3.rebind(navigator, brush);
        d3.rebind(navigator, event, 'on');

        return navigator;
    };

})(d3, fc);