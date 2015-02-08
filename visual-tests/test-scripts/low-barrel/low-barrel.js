(function(d3, fc) {
    'use strict';

/*

Things missing -

The data generator seems to have a bug which means all values tend towards zero.
Tick labels are positioned on top of ticks rather than above.
Ticks are positioned using a differenct algorithm.
Pan/drag.
Separating out the append breaks the d3y-ness.

Other noticings -

d3 core has a stacked layout; is it appropriate for stackedBar?
Maintaing up-to 3 containers just to render a filled line with points might be a bit much.
    HOW ABOUT A SERIES MULTI-PLEXER?
seriesPointSnap doesn't work if the series doesn't have x/yValue accessors
date scale is returning strings not numbers
laying out text is awkward!
decorate can be harder to work with than I expected, g.enter ... then g.each ...
joining the crosshairs was quite hard, there's lots of events
occasional overlapping of tick labels on x axis, tends to happen with an unusually large string e.g. Wednesday
*/

    var data = fc.utilities.dataGenerator()
        .seedDate(new Date(2014, 1, 1))
        .randomSeed('12345')
        .generate(250);

    var container = d3.select('#low-barrel');

    var svg = container.append('svg')
        .style({
            width: '100%',
            height: '100%'
        });

    var mainOuterContainer = svg.append('g')
        .attr('layout-css', 'flex: 0.5; marginBottom: 10; flexDirection: row');

    var mainContainer = mainOuterContainer.append('svg')
        .attr('class', 'main-container')
        .attr('layout-css', 'flex: 1')
        .attr('overflow', 'hidden');

    mainOuterContainer.append('g')
        .attr('layout-css', 'width: 50; justifyContent: center; alignItems: center')
        .append('g')
        .attr('layout-measure', 'measure')
        .append('text')
        .attr('transform', 'rotate(90)')
        .text('OHLC');

    var volumeOuterContainer = svg.append('g')
        .attr('layout-css', 'flex: 0.2; flexDirection: row');

    var volumeContainer = volumeOuterContainer.append('svg')
        .attr('class', 'volume-container')
        .attr('layout-css', 'flex: 1')
        .attr('overflow', 'hidden');

    volumeOuterContainer.append('g')
        .attr('layout-css', 'width: 50; justifyContent: center; alignItems: center')
        .append('g')
        .attr('layout-measure', 'measure')
        .append('text')
        .attr('transform', 'rotate(90)')
        .text('Volume');

    var navigatorContainer = svg.append('g')
        .attr('layout-css', 'flex: 0.2; marginRight: 50');

    var maxDate = fc.utilities.extent(data, 'date')[1];
    var dateScale = d3.time.scale()
        .domain([maxDate - 50 * 24 * 60 * 60 * 1000, maxDate])
        .nice();

    var layout = fc.utilities.layout();
    svg.call(layout);

    // TODO: This shouldn't be needed
    var crosshairsData = [];

    function render() {
        // Calculate visible data to use when calculating y axis domain extent
        var bisector = d3.bisector(function(d) { return d.date; });
        var visibleData = data.slice(
            bisector.left(data, dateScale.domain()[0]),
            bisector.right(data, dateScale.domain()[1])
        );

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
        volumeChart.series(fc.series.bar());
        volumeChart.yValue(function(d) { return d.volume; });

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
            .decorate(function(g) {
                var container = g.selectOrAppend('g.info')
                    .attr('transform', function(d) {
                        var dx = Number(d.x);
                        var x = dx < 150 ? dx + 10 : dx - 150 + 10;
                        return 'translate(' + x + ',' + 10 + ')';
                    });

                container.selectOrAppend('rect')
                    .attr('width', 130)
                    .attr('height', 76);

                var dateFormat = d3.time.format('%A, %b %e, %Y');
                var priceFormat = d3.format('.3f');
                var volumeFormat = d3.format('0,5p');

                var text = container.selectOrAppend('text');

                var items = [
                    ['date', dateFormat, ''],
                    ['open', priceFormat, 'Open: '],
                    ['high', priceFormat, 'High: '],
                    ['low', priceFormat, 'Low: '],
                    ['close', priceFormat, 'Close: '],
                    ['volume', volumeFormat, 'Volume: ']
                ];

                items.map(function(item) {
                    text.selectOrAppend('tspan.' + item[0])
                        .attr('x', 4)
                        .attr('dy', 12)
                        .text(function(d) {
                            return item[2] + item[1](d.datum[item[0]]);
                        });
                });

            })
            .on('trackingstart.link', render)
            .on('trackingmove.link', render)
            .on('trackingend.link', render);

        mainContainer.selectOrAppend('g.tooltip')
            .datum(crosshairsData)
            .call(mainCrosshairs);

        var volumeCrosshairs = fc.tools.crosshairs()
            .xScale(dateScale)
            .yScale(volumeChart.yScale())
            .snap(fc.utilities.seriesPointSnap(volumeChart.series(), data))
            .on('trackingstart.link', render)
            .on('trackingmove.link', render)
            .on('trackingend.link', render);

        // TODO: This is because of the data.__ silliness in crosshairs
        crosshairsData.__crosshairs__.overlay = false;

        volumeContainer.selectOrAppend('g.tooltip')
            .datum(crosshairsData)
            .call(volumeCrosshairs);

        var navigatorBrush = d3.svg.brush()
            .x(navigatorChart.xScale())
            .extent(dateScale.domain())
            .on('brush', function() {
                dateScale.domain(navigatorBrush.extent());
                render();
            });
        navigatorContainer.selectOrAppend('g.brush')
            .call(navigatorBrush)
            .selectAll('rect')
            .attr('height', navigatorContainer.attr('layout-height'));

    }

    render();

})(d3, fc);