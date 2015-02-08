(function(d3, fc) {
    'use strict';

/*

Things missing -

The data generator seems to have a bug which means all values tend towards zero.
Tick labels are positioned on top of ticks rather than above.
Ticks are positioned using a differenct algorithm.
Pan/drag.

Other noticings -

d3 core has a stacked layout; is it appropriate for stackedBar?
Maintaing up-to 3 containers just to render a filled line with points might be a bit much.
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
        .attr('layout-css', 'flex: 1')
        .attr('overflow', 'hidden');

    mainContainer.append('rect')
        .attr('class', 'background')
        .attr('layout-css', 'position: absolute; top: 0; right: 0; bottom: 0; left: 0');

    var mainGridlinesContainer = mainContainer.append('g')
        .attr('class', 'gridlines');

    var mainAxisContainer = mainContainer.append('g')
        .attr('layout-css', 'position: absolute; right: 0')
        .attr('class', 'axis');

    var mainSeriesContainer = mainContainer.append('g')
        .attr('class', 'series');

    var mainTooltipContainer = mainContainer.append('g')
        .attr('class', 'tooltip');

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
        .attr('layout-css', 'flex: 1')
        .attr('overflow', 'hidden');

    volumeContainer.append('rect')
        .attr('class', 'background')
        .attr('layout-css', 'position: absolute; top: 0; right: 0; bottom: 0; left: 0');

    var volumeGridlinesContainer = volumeContainer.append('g')
        .attr('class', 'gridlines');

    var volumeAxisContainer = volumeContainer.append('g')
        .attr('layout-css', 'position: absolute; right: 0')
        .attr('class', 'axis');

    var volumeSeriesContainer = volumeContainer.append('g')
        .attr('class', 'series');

    var volumeTooltipContainer = volumeContainer.append('g')
        .attr('class', 'tooltip');

    volumeOuterContainer.append('g')
        .attr('layout-css', 'width: 50; justifyContent: center; alignItems: center')
        .append('g')
        .attr('layout-measure', 'measure')
        .append('text')
        .attr('transform', 'rotate(90)')
        .text('Volume');

    var dateAxisContainer = svg.append('svg')
        .attr('layout-css', 'height: 40; marginRight: 50')
        .attr('overflow', 'hidden')
        .attr('class', 'axis');

    var navigatorContainer = svg.append('g')
        .attr('layout-css', 'flex: 0.2; marginRight: 50');

    navigatorContainer.append('rect')
        .attr('class', 'background')
        .attr('layout-css', 'position: absolute; top: 0; right: 0; bottom: 0; left: 0');

    var navigatorGridlinesContainer = navigatorContainer.append('g')
        .attr('class', 'gridlines');

    var navigatorAxisContainer = navigatorContainer.append('g')
        .attr('layout-css', 'position: absolute; bottom: 0')
        .attr('class', 'axis');

    var navigatorAreaSeriesContainer = navigatorContainer.append('g')
        .attr('class', 'series');

    var navigatorLineSeriesContainer = navigatorContainer.append('g')
        .attr('class', 'series');

    var navigatorBrushContainer = navigatorContainer.append('g')
        .attr('class', 'brush');

    var layout = fc.utilities.layout();

    svg.call(layout);

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

        // Create x axis
        dateScale.range([0, dateAxisContainer.attr('width')]);

        var dateAxis = d3.svg.axis()
            .scale(dateScale)
            .orient('bottom')
            .ticks(10);

        dateAxisContainer.call(dateAxis);

        // Create main chart
        var priceScale = d3.scale.linear()
            .domain(fc.utilities.extent(visibleData, ['high', 'low']))
            .range([mainContainer.attr('height'), 0])
            .nice();

        var priceAxis = d3.svg.axis()
            .scale(priceScale)
            .orient('left')
            .ticks(3);
        mainAxisContainer.call(priceAxis);

        var mainGridlines = fc.scale.gridlines()
            .xScale(dateScale)
            .yScale(priceScale)
            .yTicks(3)
            .xTicks(0);
        mainGridlinesContainer.call(mainGridlines);

        var mainSeries = fc.series.candlestick()
            .xScale(dateScale)
            .yScale(priceScale);
        mainSeriesContainer.datum(data)
            .call(mainSeries);

        var mainCrosshairs = fc.tools.crosshairs()
            .xScale(dateScale)
            .yScale(priceScale)
            .snap(fc.utilities.pointSnap(dateScale, priceScale,
                function(d) { return d.date; }, function(d) { return d.close; }, data))
            .decorate(function(g) {

                function transform(d) {
                    var x = Number(d.x) < 150 ? Number(d.x) + 10 : Number(d.x) - 150 + 10;
                    return 'translate(' + x + ',' + 10 + ')';
                }

                var tooltip = g.enter()
                    .append('g')
                    .attr('class', 'tooltip')
                    .style('opacity', 1e-6)
                    .attr('transform', transform);
                tooltip.append('rect');

                var text = tooltip.append('text');
                text.append('tspan')
                    .attr('class', 'date')
                    .attr('x', 4)
                    .attr('dy', 12);
                text.append('tspan')
                    .attr('class', 'open')
                    .attr('x', 4)
                    .attr('dy', 12);
                text.append('tspan')
                    .attr('class', 'high')
                    .attr('x', 4)
                    .attr('dy', 12);
                text.append('tspan')
                    .attr('class', 'low')
                    .attr('x', 4)
                    .attr('dy', 12);
                text.append('tspan')
                    .attr('class', 'close')
                    .attr('x', 4)
                    .attr('dy', 12);
                text.append('tspan')
                    .attr('class', 'volume')
                    .attr('x', 4)
                    .attr('dy', 12);

                g.each(function(d) {

                    var container = d3.select(this);

                    var tooltip = container.select('g.tooltip')
                        .transition()
                        .duration(100)
                        .ease('linear')
                        .style('opacity', 1)
                        .attr('transform', transform);

                    tooltip.select('rect')
                        .attr('width', 130)
                        .attr('height', 76);

                    var text = tooltip.select('text');

                    var dateFormat = d3.time.format('%A, %b %e, %Y');
                    var priceFormat = d3.format('.3f');
                    var volumeFormat = d3.format('0,5p');

                    text.select('tspan.date')
                        .text(dateFormat(d.datum.date));
                    text.select('tspan.open')
                        .text('Open: ' + priceFormat(d.datum.open));
                    text.select('tspan.high')
                        .text('High: ' + priceFormat(d.datum.high));
                    text.select('tspan.low')
                        .text('Low: ' + priceFormat(d.datum.low));
                    text.select('tspan.close')
                        .text('Close: ' + priceFormat(d.datum.close));
                    text.select('tspan.volume')
                        .text('Volume: ' + volumeFormat(d.datum.volume));


                });
            });
        mainTooltipContainer.call(mainCrosshairs);

        // Create volume chart
        var volumeScale = d3.scale.linear()
            .domain(fc.utilities.extent(visibleData, 'volume'))
            .range([volumeContainer.attr('height'), 0])
            .nice();

        var volumeAxis = d3.svg.axis()
            .scale(volumeScale)
            .orient('left')
            .ticks(3);
        volumeAxisContainer.call(volumeAxis);

        var volumeGridlines = fc.scale.gridlines()
            .xScale(dateScale)
            .yScale(volumeScale)
            .yTicks(2)
            .xTicks(0);
        volumeGridlinesContainer.call(volumeGridlines);

        var volumeSeries = fc.series.bar()
            .xScale(dateScale)
            .yScale(volumeScale)
            .yValue(function(d) { return d.volume; });
        volumeSeriesContainer.datum(data)
            .call(volumeSeries);

        var volumeCrosshairs = fc.tools.crosshairs()
            .xScale(dateScale)
            .yScale(volumeScale)
            .snap(fc.utilities.seriesPointSnap(volumeSeries, data));
        volumeTooltipContainer.call(volumeCrosshairs);

        // link the crosshairs
        function renderCrosshairs() {
            mainTooltipContainer.call(mainCrosshairs);
            volumeTooltipContainer.call(volumeCrosshairs);
        }
        mainCrosshairs.on('trackingstart.link', renderCrosshairs);
        mainCrosshairs.on('trackingmove.link', renderCrosshairs);
        mainCrosshairs.on('trackingend.link', renderCrosshairs);
        volumeCrosshairs.on('trackingstart.link', renderCrosshairs);
        volumeCrosshairs.on('trackingmove.link', renderCrosshairs);
        volumeCrosshairs.on('trackingend.link', renderCrosshairs);
        volumeTooltipContainer.datum(mainTooltipContainer.datum());
    }

    render();

    // Create navigator chart
    var navigatorDateScale = d3.time.scale()
        .domain(fc.utilities.extent(data, 'date'))
        .range([0, navigatorContainer.attr('layout-width')])
        .nice();

    var navigatorPriceScale = d3.scale.linear()
        .domain(fc.utilities.extent(data, 'close'))
        .range([navigatorContainer.attr('layout-height'), 0])
        .nice();

    var navigatorAxis = d3.svg.axis()
        .scale(navigatorDateScale)
        .orient('top')
        .ticks(3);
    navigatorAxisContainer.call(navigatorAxis);

    var navigatorGridlines = fc.scale.gridlines()
        .xScale(navigatorDateScale)
        .yScale(navigatorPriceScale)
        .yTicks(0)
        .xTicks(3);
    navigatorGridlinesContainer.call(navigatorGridlines);

    var navigatorAreaSeries = fc.series.area()
        .xScale(navigatorDateScale)
        .yScale(navigatorPriceScale)
        .y1Value(function(d) { return d.close; });
    navigatorAreaSeriesContainer.datum(data)
        .call(navigatorAreaSeries);

    var navigatorLineSeries = fc.series.line()
        .xScale(navigatorDateScale)
        .yScale(navigatorPriceScale)
        .yValue(function(d) { return d.close; });
    navigatorLineSeriesContainer.datum(data)
        .call(navigatorLineSeries);

    var navigatorBrush = d3.svg.brush()
        .x(navigatorDateScale)
        .extent(dateScale.domain())
        .on('brush', function() {
            dateScale.domain(navigatorBrush.extent());
            render();
        });
    navigatorBrushContainer.call(navigatorBrush)
        .selectAll('rect')
        .attr('height', navigatorContainer.attr('layout-height'));

})(d3, fc);