---
layout: example
title: Basecoin chart
---
<style>

svg {
    width: 100%;
    background: black;
}
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

.candlestick.up>path {
    fill: white;
    stroke: rgba(77, 175, 74, 1);
}
.candlestick.down>path {
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
.blur>.gridline {
    visibility: hidden;
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
        <svg id="chart" viewbox="0 0 1000 562">
            <defs>
                <mask id="blur-mask">
                    <rect width="1000" height="562" fill="url(#blur-mask-gradient)"></rect>
                    <linearGradient id="blur-mask-gradient" x1="0" y1="0" x2="0.5" y2="0">
                        <stop stop-color="white" offset="0%"/>
                        <stop stop-color="black" offset="100%"/>
                    </linearGradient>
                </mask>
                <filter id="blur-filter">
                    <feFlood flood-opacity="1" flood-color="black" result="flood"/>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
                    <feComposite in="blur" in2="flood" operator="over"/>
                </filter><!--
                <filter id="blur">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
                </filter> -->
            </defs>
        </svg>
    </div>
</div>


<script type="text/javascript">
(function(d3, fc) {
    'use strict';

    var WIDTH = 1000, HEIGHT = 562;

    var dataGenerator = fc.data.random.financial()
        .filter(fc.util.fn.identity)
        .startDate(new Date(2014, 1, 1));

    var data = dataGenerator(100);

    var container = d3.select('#chart');

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

        var gridline = fc.annotation.gridline()
            .xTicks(WIDTH/HEIGHT * 12)
            .yTicks(HEIGHT/WIDTH * 12);

        var candlestick = fc.series.candlestick();

        var bollingerBands = fc.indicator.renderer.bollingerBands();

        var ema = fc.series.line()
            .yValue(function(d) { return d.exponentialMovingAverage; });

        var seriesMulti = fc.series.multi()
            .series([gridline, candlestick, bollingerBands, ema])
            .decorate(function(g) {
                g.enter()
                    .attr('class', function(d, i) {
                        return ['gridline', 'candlestick', 'bollinger-bands', 'ema'][i];
                    });
            });

        // To pull off the progressive blur we need a second copy of the chart
        // and to get the flare we need yet another.
        var multi = fc.series.multi()
            .xScale(xScale)
            .yScale(yScale)
            .series([seriesMulti, seriesMulti])
            .decorate(function(g) {
                g.enter()
                    .attr('class', function(d, i) {
                        return ['series', 'blur', 'flare'][i];
                    });
            });


        fc.indicator.algorithm.bollingerBands()
            .windowSize(8)
            .multiplier(1)(data);

        fc.indicator.algorithm.exponentialMovingAverage()
            .windowSize(3)(data);

        container.datum(data)
            .call(multi);
    }

    render();

})(d3, fc);

</script>

