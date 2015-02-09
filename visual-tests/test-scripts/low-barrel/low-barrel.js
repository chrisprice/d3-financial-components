(function(d3, fc) {
    'use strict';

/*

Remove layout-measure, use text-anchor.

Things missing -

The data generator seems to have a bug which means all values tend towards zero.
Tick labels are positioned on top of ticks rather than above.
Ticks are positioned using a differenct algorithm.
Pan/drag.
Separating out the append breaks the d3y-ness.
Random glitching of brush (rect width goes -ve around x=100)

Other noticings -

d3 core has a stacked layout; is it appropriate for stackedBar?
Maintaing up-to 3 containers just to render a filled line with points might be a bit much.
    HOW ABOUT A SERIES MULTI-PLEXER?
    ADD YVALUE TO OHLC/CANDLESTICK
    REMOVE Y/XVALUE FROM LAYOUT
seriesPointSnap doesn't work if the series doesn't have x/yValue accessors
date scale is returning strings not numbers
laying out text is awkward!
decorate can be harder to work with than I expected, g.enter ... then g.each ...
joining the crosshairs was quite hard, there's lots of events
occasional overlapping of tick labels on x axis, tends to happen with an unusually large string e.g. Wednesday
merging of layout transforms? e.g. rotate on the text element
*/

    var lowBarrel = {};

    lowBarrel.tooltip = function() {

        var tooltip = function(selection) {

            var container = selection.selectOrAppend('g', 'info')
                .attr('transform', function(d) {
                    var dx = Number(d.x);
                    var x = dx < 150 ? dx + 10 : dx - 150 + 10;
                    return 'translate(' + x + ',' + 10 + ')';
                });

            container.selectOrAppend('rect')
                .attr('width', 130)
                .attr('height', 76);

            // if only simple data join were more flexible...
            var tspan = container.selectOrAppend('text')
                .selectAll('tspan')
                .data(tooltip.items.value);

            tspan.enter()
                .append('tspan')
                .attr('x', 4)
                .attr('dy', 12);

            tspan.text(function(d) {
                return d(container.datum().datum);
            });
        };

        function format(type, value) {
            return tooltip.formatters.value[type](value);
        }

        tooltip.items = fc.utilities.property([
            function(d) { return format('date', d.date); },
            function(d) { return 'Open: ' + format('price', d.open); },
            function(d) { return 'High: ' + format('price', d.high); },
            function(d) { return 'Low: ' + format('price', d.low); },
            function(d) { return 'Close: ' + format('price', d.close); },
            function(d) { return 'Volume: ' + format('volume', d.volume); }
        ]);
        tooltip.formatters = fc.utilities.property({
            date: d3.time.format('%A, %b %e, %Y'),
            price: d3.format('.2f'),
            volume: d3.format('0,5p')
        });

        return tooltip;
    };

    lowBarrel.createRow = function(container, className, flexValue, label) {
        var outer = container.selectOrAppend('g', className)
            .attr('layout-css', 'flex: ' + flexValue + '; marginBottom: 10; flexDirection: row');
        var main = outer.selectOrAppend('svg')
            .attr('layout-css', 'flex: 1')
            .attr('overflow', 'hidden');
        outer.selectOrAppend('g', className + '-label')
            .attr('layout-css', 'width: 50; justifyContent: center; alignItems: center')
            .selectOrAppend('g')
            .attr('layout-css', 'width: 0')
            .selectOrAppend('text')
            .attr('transform', 'rotate(90)')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'middle')
            .text(label);
        return main;
    };

    var data = fc.utilities.dataGenerator()
        .seedDate(new Date(2014, 1, 1))
        .randomSeed('12345')
        .generate(250);

    var maxDate = fc.utilities.extent(data, 'date')[1];
    var dateScale = d3.time.scale()
        .domain([maxDate - 50 * 24 * 60 * 60 * 1000, maxDate])
        .nice();

    function render() {
        // Calculate visible data to use when calculating y axis domain extent
        var bisector = d3.bisector(function(d) { return d.date; });
        var visibleData = data.slice(
            bisector.left(data, dateScale.domain()[0]),
            bisector.right(data, dateScale.domain()[1])
        );

        var svg = d3.select('#low-barrel')
            .selectOrAppend('svg')
            .style({
                width: '100%',
                height: '100%'
            });

        var mainContainer = lowBarrel.createRow(svg, 'main', 0.5, 'OHLC');
        var volumeContainer = lowBarrel.createRow(svg, 'volume', 0.3, 'Volume');
        var navigatorContainer = lowBarrel.createRow(svg, 'navigator', 0.2, '');

        var layout = fc.utilities.layout();
        svg.call(layout);

        var mainChart = fc.layouts.basicTimeSeries();
        mainChart.xScale(dateScale);
        mainChart.yScale()
            .domain(fc.utilities.extent(visibleData, ['high', 'low']))
            .nice();
        mainChart.xAxis(null);
        mainChart.yAxis()
            .ticks(3);
        mainChart.gridlines()
            .yTicks(3);

        mainContainer.datum(data)
            .call(mainChart);

        var volumeChart = fc.layouts.basicTimeSeries();
        volumeChart.xScale(dateScale);
        volumeChart.yScale()
            .domain(fc.utilities.extent(visibleData, 'volume'))
            .nice();
        volumeChart.yAxis()
            .ticks(2);
        volumeChart.gridlines()
            .yTicks(2);
        volumeChart.series(
            fc.series.bar()
                .yValue(function(d) { return d.volume; })
        );

        volumeContainer.datum(data)
            .call(volumeChart);

        var navigatorChart = fc.layouts.basicTimeSeries()
            .decorate(function(selection) {
                selection.select('g.x-axis')
                    .attr('layout-css', 'position: absolute; right: 0; bottom: 0; left: 0');
            });
        navigatorChart.xScale()
            .domain(fc.utilities.extent(data, 'date'));
        navigatorChart.yScale()
            .domain(fc.utilities.extent(data, 'close'));
        navigatorChart.xAxis()
            .orient('top')
            .ticks(3);
        navigatorChart.yAxis(null);
        navigatorChart.gridlines()
            .xTicks(3)
            .yTicks(0);

        navigatorContainer.datum(data)
            .call(navigatorChart);

        var mainCrosshairs = fc.tools.crosshairs()
            .xScale(dateScale)
            .yScale(mainChart.yScale())
            .snap(fc.utilities.seriesPointSnap(mainChart.series(), data))
            .decorate(lowBarrel.tooltip())
            .on('trackingstart.link', render)
            .on('trackingmove.link', render)
            .on('trackingend.link', render);

        var mainCrosshairsContainer = mainContainer.selectOrAppend('g', 'tooltip')
            .call(mainCrosshairs);

        var volumeCrosshairs = fc.tools.crosshairs()
            .xScale(dateScale)
            .yScale(volumeChart.yScale())
            .snap(fc.utilities.seriesPointSnap(volumeChart.series(), data))
            .on('trackingstart.link', render)
            .on('trackingmove.link', render)
            .on('trackingend.link', render);

        var volumeCrosshairsContainer = volumeContainer.selectOrAppend('g', 'tooltip')
            .call(volumeCrosshairs);

        volumeCrosshairsContainer.datum(mainCrosshairsContainer.datum());

        var navigatorBrush = d3.svg.brush()
            .x(navigatorChart.xScale())
            .extent(dateScale.domain())
            .on('brush', function() {
                dateScale.domain(navigatorBrush.extent());
                render();
            });
        navigatorContainer.selectOrAppend('g', 'brush')
            .call(navigatorBrush)
            .selectAll('rect')
            .attr('height', navigatorContainer.attr('layout-height'));

    }

    render();

})(d3, fc);