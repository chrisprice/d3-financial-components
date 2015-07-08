---
layout: example
title: Basecoin chart
---
<style>

/*
R rgb(228, 26, 28)
G rgb(77, 175, 74)
B rgb(55, 126, 184)
*/

.gridline {
    stroke: white;
    stroke-dasharray: 3, 5;
    stroke-opacity: 0.5;
}

.candlestick>path.up {
    fill: white;
    stroke: rgba(77, 175, 74, 1);
}
.candlestick>path.down {
    fill: black;
    stroke: rgba(77, 175, 74, 1);
}

.bollinger-bands>.area,
.bollinger-bands>.average {
    visibility: hidden;
}
.bollinger-bands>.upper>path {
    stroke: rgba(55, 126, 184, 1);
    stroke-width: 2px;
}
.bollinger-bands>.lower>path {
    stroke: rgba(77, 175, 74, 1);
    stroke-width: 2px;
}

.ema>path {
    stroke: rgba(228, 26, 28, 1);
    stroke-width: 2px;
}

.blur {
    filter: url(#blur-filter);
    mask: url(#blur-mask);
}

.flare {
    filter: url(#flare-filter);
    mask: url(#flare-mask);
}

.annotation>line {
    stroke: rgb(255, 255, 51);
    stroke-dasharray: 0;
    stroke-opacity: 0.5;
}

#scene {
    overflow: hidden;
    background: black;
    position: relative;
    height: 347px; /*<- ew*/
}

#camera {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    perspective: 150px;
    transform-origin: 50% 50%;
    transform: scale(1.6) rotateX(5deg) rotateY(-50deg);
}

#background {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateZ(-10px);
}

#chart {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

</style>

<div class="row">
    <div class="col-md-12">
        <h1>Basecoin Example</h1>
    </div>
</div>

<div class="row">
    <div class="col-md-4">
        <p></p>
    </div>
    <div class="col-md-8">
        <div id="scene">
            <div id="camera">
                <svg id="background" viewbox="0 0 1000 562">
                </svg>
                <svg id="chart" viewbox="0 0 1000 562">
                    <defs>
                        <mask id="blur-mask">
                            <rect width="1000" height="562" fill="url(#blur-mask-gradient)"></rect>
                            <linearGradient id="blur-mask-gradient" x1="0" y1="0" x2="0.5" y2="0">
                                <stop stop-color="white" offset="0%"/>
                                <stop stop-color="black" offset="100%"/>
                            </linearGradient>
                        </mask>
                        <filter id="blur-filter" x="0" width="50%">
                            <feImage xlink:href="#series" x="0"  y="0" width="1000" height="562" result="image" />
                            <feFlood flood-opacity="1" flood-color="black" result="flood"/>
                            <feGaussianBlur in="image" stdDeviation="5" result="blur"/>
                            <feComposite in="blur" in2="flood" operator="over"/>
                        </filter>

                        <mask id="flare-mask">
                            <rect width="1000" height="562" fill="url(#flare-mask-gradient)"></rect>
                            <linearGradient id="flare-mask-gradient" x1="0.5" y1="0" x2="0.7" y2="0">
                                <stop stop-color="black" offset="0%"/>
                                <stop stop-color="white" offset="60%"/>
                                <stop stop-color="white" offset="90%"/>
                                <stop stop-color="black" offset="100%"/>
                            </linearGradient>
                        </mask>
                        <filter id="flare-filter" x="50%" width="20%">
                            <feImage xlink:href="#series" x="0"  y="0" width="1000" height="562" result="image" />
                            <feFlood flood-opacity="1" flood-color="white" result="white-flood"/>
                            <feComposite in="white-flood" in2="image" operator="atop" result="composite1"/>
                            <feGaussianBlur in="composite1" stdDeviation="5" result="blur"/>

                            <feBlend in="blur" in2="blur" mode="multiply" result="blend1"/>
                            <feBlend in="blend1" in2="blur" mode="multiply" result="blend2"/>
                            <feBlend in="blend2" in2="blur" mode="multiply" result="blend3"/>

                            <feBlend in="blend3" in2="image" mode="lighten" result="blend"/>

                            <feColorMatrix type="saturate" in="blend" values="10"/>
                        </filter>
                    </defs>
                    <g id="gridline"/>
                    <g id="series"/>
                    <g class="blur"/>
                    <g class="flare"/>
                </svg>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
(function(d3, fc) {
    'use strict';

    fc.series.optimised = {};

    fc.series.optimised.candlestick = function() {

        var xScale = fc.scale.dateTime(),
            yScale = d3.scale.linear();

        var candlestick = fc.svg.candlestick()
            .x(function(d) { return xScale(d.date); })
            .open(function(d) { return yScale(d.open); })
            .high(function(d) { return yScale(d.high); })
            .low(function(d) { return yScale(d.low); })
            .close(function(d) { return yScale(d.close); })
            .width(5);

        var upDataJoin = fc.util.dataJoin()
            .selector('path.up')
            .element('path')
            .attrs({'class': 'up'});

        var downDataJoin = fc.util.dataJoin()
            .selector('path.down')
            .element('path')
            .attrs({'class': 'down'});

        var optimisedCandlestick = function(selection) {
            selection.each(function(data) {
                var upData = data.filter(function(d) { return d.open < d.close; }),
                    downData = data.filter(function(d) { return d.open >= d.close; });

                upDataJoin(this, [upData])
                    .attr('d', candlestick);

                downDataJoin(this, [downData])
                    .attr('d', candlestick);
            });
        };

        optimisedCandlestick.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return optimisedCandlestick;
        };
        optimisedCandlestick.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return optimisedCandlestick;
        };

        return optimisedCandlestick;
    };
})(d3, fc);


</script>

<script type="text/javascript">
(function(d3, fc) {
    'use strict';

    var WIDTH = 1000, HEIGHT = 562;

    var dataGenerator = fc.data.random.financial()
        .filter(fc.util.fn.identity)
        .startDate(new Date(2014, 1, 1));

    var data = dataGenerator(100);

    data.forEach(function(d, i) {
        d.verticalLine = [12, 48, 55, 65, 80].indexOf(i) > -1;
    });

    var backgroundContainer = d3.select('#background'),
        chartContainer = d3.select('#chart'),
        gridlineContainer = chartContainer.select('#gridline'),
        seriesContainer = chartContainer.select('#series');

    function render() {
        var xExtent = [data[20].date, data[data.length-1].date];
        var xDelta = xExtent[1] - xExtent[0];

        var xScale = fc.scale.dateTime()
            .domain([xExtent[0], new Date(xExtent[1].getTime() + xDelta/2)])
            .range([0, WIDTH]);

        var yExtent = fc.util.extent(data, ['low', 'high']);
        var yDelta = yExtent[1] - yExtent[0];

        var yScale = d3.scale.linear()
            .domain([yExtent[0] - yDelta, yExtent[1] + yDelta])
            .range([HEIGHT, 0]);

        // ---

        var verticalLines = fc.annotation.line()
            .xScale(xScale)
            .yScale(yScale)
            .orient('vertical')
            .value(function(d) { return d.date; });

        var verticalLineData = data.filter(function(d, i) {
            return d.verticalLine;
        });

        backgroundContainer.datum(verticalLineData)
            .call(verticalLines);

        // ---

        var gridline = fc.annotation.gridline()
            .xScale(xScale)
            .yScale(yScale)
            .xTicks(WIDTH/HEIGHT * 12)
            .yTickValues([75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125]);

        gridlineContainer.datum(data)
            .call(gridline);

        // ---

        var candlestick = fc.series.optimised.candlestick();

        var bollingerBands = fc.indicator.renderer.bollingerBands();

        var ema = fc.series.line()
            .yValue(function(d) { return d.exponentialMovingAverage; });

        var seriesMulti = fc.series.multi()
            .xScale(xScale)
            .yScale(yScale)
            .series([candlestick, bollingerBands, ema])
            .decorate(function(g) {
                g.enter()
                    .attr('class', function(d, i) {
                        return ['candlestick', 'bollinger-bands', 'ema'][i];
                    });
            });

        fc.indicator.algorithm.bollingerBands()
            .windowSize(8)
            .multiplier(1)(data);

        fc.indicator.algorithm.exponentialMovingAverage()
            .windowSize(3)(data);

        seriesContainer.datum(data)
            .call(seriesMulti);
    }

    var frames = 10000;

    requestAnimationFrame(function raf() {

        data.shift();

        var item = dataGenerator(1)[0];

        item.verticalLine = Math.random() > 0.99;

        data.push(item);

        render();

        if (frames-->0) {
            requestAnimationFrame(raf);
        }
    })

})(d3, fc);

</script>

