(function(d3, fc) {
    'use strict';

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

    var titleContainer = svg.append('g')
        .attr('layout-css', 'height: 30');

    titleContainer.append('text')
        .text('FC');

    var toolbarContainer = svg.append('g')
        .attr('layout-css', 'height: 30');

    var mainContainer = svg.append('svg')
        .attr('layout-css', 'flex: 0.5')
        .attr('overflow', 'hidden');

    var mainGridlinesContainer = mainContainer.append('g')
        .attr('class', 'gridlines');

    var mainAxisContainer = mainContainer.append('g')
        .attr('layout-css', 'position: absolute; right: 0')
        .attr('class', 'axis');

    var mainSeriesContainer = mainContainer.append('g')
        .attr('class', 'series');

    var volumeContainer = svg.append('svg')
        .attr('layout-css', 'flex: 0.2')
        .attr('overflow', 'hidden');

    var volumeGridlinesContainer = volumeContainer.append('g')
        .attr('class', 'gridlines');

    var volumeAxisContainer = volumeContainer.append('g')
        .attr('layout-css', 'position: absolute; right: 0')
        .attr('class', 'axis');

    var volumeSeriesContainer = volumeContainer.append('g')
        .attr('class', 'series');

    var dateAxisContainer = svg.append('svg')
        .attr('layout-css', 'flex: 0.1')
        .attr('overflow', 'hidden')
        .attr('class', 'axis');

    var navigatorContainer = svg.append('g')
        .attr('layout-css', 'flex: 0.2');

    var navigatorGridlinesContainer = navigatorContainer.append('g')
        .attr('class', 'gridlines');

    var navigatorAxisContainer = navigatorContainer.append('g')
        .attr('layout-css', 'position: absolute; bottom: 0')
        .attr('class', 'axis');

    var navigatorSeriesContainer = navigatorContainer.append('g')
        .attr('class', 'series');

    var layout = fc.utilities.layout();

    svg.call(layout);

    console.log(data, titleContainer, toolbarContainer, mainContainer, volumeContainer, navigatorContainer);

    // Create x axis

    var maxDate = fc.utilities.extent(data, 'date')[1];
    var dateScale = d3.time.scale()
        .domain([maxDate - 50 * 24 * 60 * 60 * 1000, maxDate])
        .range([0, dateAxisContainer.attr('width')])
        .nice();

    var dateAxis = d3.svg.axis()
        .scale(dateScale)
        .orient('bottom')
        .ticks(10);

    dateAxisContainer.call(dateAxis);

    // Create main chart
    var priceScale = d3.scale.linear()
        .domain(fc.utilities.extent(data, ['high', 'low']))
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

    // Create volume chart
    var volumeScale = d3.scale.linear()
        .domain(fc.utilities.extent(data, 'volume'))
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

    var navigatorSeries = fc.series.line()
        .xScale(navigatorDateScale)
        .yScale(navigatorPriceScale)
        .yValue(function(d) { return d.close; });
    navigatorSeriesContainer.datum(data)
        .call(navigatorSeries);

    var brush = d3.svg.brush()
        .x(navigatorDateScale)
        .extent(dateScale.domain())
        .on('brush', function() {
            dateScale.domain(brush.extent());
        });
    navigatorContainer.append('g')
        .call(brush)
        .selectAll('rect')
        .attr('height', navigatorContainer.attr('layout-height'));

})(d3, fc);