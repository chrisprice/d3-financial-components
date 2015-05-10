import d3 from 'd3';
import dateTime from '../scale/dateTime';
import line from '../series/line';
import rebind from '../utilities/rebind';
import property from '../utilities/property';

export default function() {

    var xScale = dateTime();
    var yScale = d3.scale.linear();
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    var linearTimeSeries = function(selection) {

        selection.each(function(data) {

            var container = d3.select(this);

            var mainContainer = container.selectAll('svg')
                .data([data]);
            mainContainer.enter()
                .append('svg')
                .attr('overflow', 'hidden')
                .layout('flex', 1);

            var background = mainContainer.selectAll('rect.background')
                .data([data]);
            background.enter()
                .append('rect')
                .attr('class', 'background')
                .layout({
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                });

            var plotAreaContainer = mainContainer.selectAll('g.plot-area')
                .data([data]);
            plotAreaContainer.enter()
                .append('g')
                .attr('class', 'plot-area')
                .layout({
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                });

            var yAxisContainer = mainContainer.selectAll('g.y-axis')
                .data([data]);
            yAxisContainer.enter()
                .append('g')
                .attr('class', 'axis y-axis')
                .layout({
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0
                });

            var xAxisContainer = container.selectAll('g.x-axis')
                .data([data]);
            xAxisContainer.enter()
                .append('g')
                .attr('class', 'axis x-axis')
                .layout('height', 20);

            container.layout();

            xScale.range([0, xAxisContainer.layout('width')]);

            yScale.range([yAxisContainer.layout('height'), 0]);

            xAxisContainer.call(xAxis);

            yAxisContainer.call(yAxis);

            var plotArea = linearTimeSeries.plotArea.value;
            plotArea.xScale(xScale)
                .yScale(yScale);
            plotAreaContainer.call(plotArea);

        });
    };

    rebind(linearTimeSeries, xScale, {
        xDiscontinuityProvider: 'discontinuityProvider',
        xDomain: 'domain',
        xNice: 'nice'
    });

    rebind(linearTimeSeries, yScale, {
        yDomain: 'domain',
        yNice: 'nice'
    });

    rebind(linearTimeSeries, xAxis, {
        xTicks: 'ticks'
    });

    rebind(linearTimeSeries, yAxis, {
        yTicks: 'ticks'
    });

    linearTimeSeries.xScale = function() { return xScale; };
    linearTimeSeries.yScale = function() { return yScale; };
    linearTimeSeries.plotArea = property(line());

    return linearTimeSeries;
}
