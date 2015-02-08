(function(d3, fc) {
    'use strict';

    fc.layouts.basicTimeSeries = function() {

        var basicTimeSeries = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);
                var mainContainer = container.select('svg');
                var xAxisContainer = container.select('g.x-axis');
                var yAxisContainer = mainContainer.select('g.y-axis');

                basicTimeSeries.xScale.value.range([0, xAxisContainer.attr('layout-width')]);

                basicTimeSeries.yScale.value.range([yAxisContainer.attr('layout-height'), 0]);

                if (basicTimeSeries.xAxis.value != null) {
                    basicTimeSeries.xAxis.value.scale(basicTimeSeries.xScale.value);
                    xAxisContainer.call(basicTimeSeries.xAxis.value);
                }

                if (basicTimeSeries.yAxis.value != null) {
                    basicTimeSeries.yAxis.value.scale(basicTimeSeries.yScale.value);
                    yAxisContainer.call(basicTimeSeries.yAxis.value);
                }

                basicTimeSeries.gridlines.value.xScale(basicTimeSeries.xScale.value)
                    .yScale(basicTimeSeries.yScale.value);

                mainContainer.select('g.gridlines')
                    .call(basicTimeSeries.gridlines.value);

                basicTimeSeries.series.value.xScale(basicTimeSeries.xScale.value)
                    .yScale(basicTimeSeries.yScale.value)
                    .xValue(basicTimeSeries.xValue.value)
                    .yValue(basicTimeSeries.yValue.value);

                mainContainer.select('g.series')
                    .call(basicTimeSeries.series.value);

            });
        };

        basicTimeSeries.append = function(selection) {

            selection.each(function() {

                var container = d3.select(this);

                var mainContainer = container.append('svg')
                    .attr('layout-css', 'flex: 1')
                    .attr('overflow', 'hidden');

                mainContainer.append('rect')
                    .attr('class', 'background')
                    .attr('layout-css', 'position: absolute; top: 0; right: 0; bottom: 0; left: 0');

                mainContainer.append('g')
                    .attr('class', 'gridlines');

                mainContainer.append('g')
                    .attr('layout-css', 'position: absolute; top: 0; right: 0; bottom: 0')
                    .attr('class', 'axis y-axis');

                mainContainer.append('g')
                    .attr('class', 'series');

                container.append('g')
                    .attr('class', 'axis x-axis')
                    .attr('layout-css', 'height: 20');

            });
        };

        basicTimeSeries.decorate = fc.utilities.property(fc.utilities.fn.noop);
        basicTimeSeries.xScale = fc.utilities.property(d3.time.scale());
        basicTimeSeries.yScale = fc.utilities.property(d3.scale.linear());
        basicTimeSeries.xAxis = fc.utilities.property(
            d3.svg.axis()
                .orient('bottom')
        );
        basicTimeSeries.yAxis = fc.utilities.property(
            d3.svg.axis()
                .orient('left')
        );
        basicTimeSeries.xValue = fc.utilities.property(function(d) { return d.date; });
        basicTimeSeries.yValue = fc.utilities.property(function(d) { return d.close; });
        basicTimeSeries.gridlines = fc.utilities.property(fc.scale.gridlines());
        basicTimeSeries.series = fc.utilities.property(fc.series.line());

        return basicTimeSeries;
    };

})(d3, fc);