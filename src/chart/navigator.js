(function(d3, fc) {
    'use strict';

    fc.chart.navigator = function() {

        var chart = fc.chart.linearTimeSeries()
            .yTicks(0);

        var scale = fc.scale.dateTime(),
            series = fc.series.line(),
            event = d3.dispatch('navigate'),
            decorate = fc.util.fn.noop;

        var navigator = function(selection) {
            selection.each(function(data) {
                var container = d3.select(this);

                var brush = d3.svg.brush()
                    .on('brush', function() {
                        // this is the brush g, navigator expects the svg
                        var container = d3.select(this.parentNode.parentNode),
                            domain = [brush.extent()[0][0], brush.extent()[1][0]];
                        // Scales with a domain delta of 0 === NaN
                        if (domain[0] - domain[1] !== 0) {
                            scale.domain(domain);
                            container.call(navigator);
                            event.navigate.call(this, domain);
                        }
                    });

                var multi = fc.series.multi()
                    .series([series, brush])
                    .mapping(function(series) {
                        // Need to set the extent AFTER the scales
                        // are set AND their ranges defined
                        if (series === brush) {
                            brush.extent([
                                [scale.domain()[0], chart.yDomain()[0]],
                                [scale.domain()[1], chart.yDomain()[1]]
                            ]);
                        }
                        return data;
                    })
                    .decorate(function(g) {
                        // EW
                        function filter() {
                            return this.__series__ === brush;
                        }
                        var g2 = g.filter(filter);
                        g2.enter = d3.functor(g.enter().filter(filter));
                        g2.exit = d3.functor(g.exit().filter(filter));
                        decorate(g2);
                    });

                chart.plotArea(multi);

                container.call(chart);
            });
        };

        navigator.scale = function(x) {
            if (!arguments.length) {
                return scale;
            }
            scale = x;
            return navigator;
        };
        navigator.series = function(x) {
            if (!arguments.length) {
                return series;
            }
            series = x;
            return navigator;
        };
        navigator.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return navigator;
        };

        fc.util.rebind(navigator, chart, {
            xDiscontinuityProvider: 'xDiscontinuityProvider',
            xScale: 'xScale',
            xDomain: 'xDomain',
            yScale: 'yScale',
            xNice: 'xNice',
            yDomain: 'yDomain',
            yNice: 'yNice',
            xAxisHeight: 'xAxisHeight',
            xTicks: 'xTicks',
            xTickValues: 'xTickValues',
            xTickSize: 'xTickSize',
            xInnerTickSize: 'xInnerTickSize',
            xOuterTickSize: 'xOuterTickSize',
            xTickPadding: 'xTickPadding',
            xTickFormat: 'xTickFormat',
            xOrient: 'xOrient',
            yTicks: 'yTicks',
            yTickValues: 'yTickValues',
            yTickSize: 'yTickSize',
            yInnerTickSize: 'yInnerTickSize',
            yOuterTickSize: 'yOuterTickSize',
            yTickPadding: 'yTickPadding',
            yTickFormat: 'yTickFormat',
            yOrient: 'yOrient'
        });

        fc.util.rebind(navigator, event, 'navigate');

        return navigator;
    };

})(d3, fc);
