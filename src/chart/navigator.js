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

                var brush = fc.tool.brush()
                    .on('brushmove', brushmove);

                var multi = fc.series.multi()
                    .series([series, brush])
                    .mapping(function(s) {
                        switch (s) {
                            case series:
                                return data;
                            case brush:
                                return [
                                    [
                                        [scale.domain()[0], chart.yDomain()[0]],
                                        [scale.domain()[1], chart.yDomain()[1]]
                                    ]
                                ];
                        }
                        return data;
                    });

                chart.plotArea(multi);

                container.call(chart);
            });
        };

        function brushmove() {
            var brushContainer = d3.select(this),
                navigatorContainer = d3.select(this.parentNode.parentNode),
                data = brushContainer.datum(),
                datum = data[data.length - 1],
                domain = [datum[0][0], datum[1][0]];
            // Scales with a domain delta of 0 === NaN
            if (domain[0] - domain[1] !== 0) {
                scale.domain(domain);
            }
            navigatorContainer.call(navigator);
            event.navigate.call(this, domain);
        }

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
