(function(d3, fc) {
    'use strict';

    fc.layouts.basicTimeSeries = function() {

        d3.selection.prototype.selectOrAppend = function(selector) {
            var selection = this.select(selector);
            if (selection.empty()) {
                var parts = selector.split('.');
                var elementName = parts[0];
                var className = parts[1];
                selection = this.append(elementName);
                if (className != null) {
                    selection.attr('class', className);
                }
            }
            return selection;
        };

        var basicTimeSeries = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var mainContainer = container.selectOrAppend('svg')
                    .attr('layout-css', 'flex: 1')
                    .attr('overflow', 'hidden');

                mainContainer.selectOrAppend('rect.background')
                    .attr('layout-css', 'position: absolute; top: 0; right: 0; bottom: 0; left: 0');

                var gridlinesContainer;
                if (basicTimeSeries.gridlines.value != null) {
                    gridlinesContainer = mainContainer.selectOrAppend('g.gridlines');
                } else {
                    mainContainer.select('g.gridlines')
                        .remove();
                }

                var yAxisContainer;
                if (basicTimeSeries.yAxis.value != null) {
                    yAxisContainer = mainContainer.selectOrAppend('g.y-axis')
                        .attr('layout-css', 'position: absolute; top: 0; right: 0; bottom: 0')
                        .attr('class', 'axis y-axis');
                } else {
                    mainContainer.select('g.y-axis')
                        .remove();
                }

                var seriesContainer;
                if (basicTimeSeries.series.value != null) {
                    seriesContainer = mainContainer.selectOrAppend('g.series')
                        .attr('layout-css', 'position: absolute; top: 0; right: 0; bottom: 0; left: 0');
                } else {
                    mainContainer.select('g.series')
                        .remove();
                }

                var xAxisContainer;
                if (basicTimeSeries.xAxis.value != null) {
                    xAxisContainer = container.selectOrAppend('g.x-axis')
                        .attr('class', 'axis x-axis')
                        .attr('layout-css', 'height: 20');
                } else {
                    mainContainer.select('g.x-axis')
                        .remove();
                }

                basicTimeSeries.decorate.value(container);

                var BODGE = container.attr('transform');
                basicTimeSeries.layout.value(container,
                    container.attr('layout-width'), container.attr('layout-height'));
                container.attr('transform', BODGE);

                basicTimeSeries.xScale.value.range([0, (xAxisContainer || seriesContainer).attr('layout-width')]);

                basicTimeSeries.yScale.value.range([(yAxisContainer || seriesContainer).attr('layout-height'), 0]);

                if (basicTimeSeries.xAxis.value != null) {
                    basicTimeSeries.xAxis.value.scale(basicTimeSeries.xScale.value);
                    xAxisContainer.call(basicTimeSeries.xAxis.value);
                }

                if (basicTimeSeries.yAxis.value != null) {
                    basicTimeSeries.yAxis.value.scale(basicTimeSeries.yScale.value);
                    yAxisContainer.call(basicTimeSeries.yAxis.value);
                }

                if (basicTimeSeries.gridlines.value != null) {
                    basicTimeSeries.gridlines.value.xScale(basicTimeSeries.xScale.value)
                        .yScale(basicTimeSeries.yScale.value);
                    gridlinesContainer.call(basicTimeSeries.gridlines.value);
                }

                if (basicTimeSeries.series.value != null) {
                    basicTimeSeries.series.value.xScale(basicTimeSeries.xScale.value)
                        .yScale(basicTimeSeries.yScale.value)
                        .xValue(basicTimeSeries.xValue.value)
                        .yValue(basicTimeSeries.yValue.value);
                    seriesContainer.call(basicTimeSeries.series.value);
                }

            });
        };

        basicTimeSeries.decorate = fc.utilities.property(fc.utilities.fn.noop);
        basicTimeSeries.layout = fc.utilities.property(fc.utilities.layout());
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