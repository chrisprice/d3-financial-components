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

svg {
    pointer-events: none;
}

.gridline {
    stroke: white;
    stroke-width: 0.5;
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

.left-blur {
    filter: url(#left-blur-filter);
    mask: url(#left-blur-mask);
}

.right-blur {
    filter: url(#right-blur-filter);
    mask: url(#right-blur-mask);
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

#viewport {

    overflow: hidden;
    background: black;
    position: relative;
    height: 347px; /*<- ew*/

    perspective: 150px;
    transform-origin: 50% 50%;
    transform-style: preserve-3d;
}

#camera {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    transform-style: preserve-3d;


    animation-duration: 5s;
    /*animation-name: pan-camera;*/
    animation-iteration-count: infinite;
    animation-direction: alternate;
}

@keyframes pan-camera {
  from {
    transform: scale(1.6) rotateX(5deg) rotateY(-50deg);
  }
  to {
    transform: scale(2.0) rotateX(15deg) rotateY(-30deg) translateX(-150px);
  }
}

#assembly {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}



#background {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateZ(-100px);
}

#chart {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

#label>svg {
    /*filter: url(#left-blur-filter);*/
/*    mask: url(#left-blur-mask);*/
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /* weird chrome bug */
    height: 100%;
    width: 100%;
}

#label text {
    stroke: white;
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
        <div id="viewport">
            <div id="camera">
                <div id="assembly">
                    <svg id="background" viewbox="0 0 1000 562">
                    </svg>
                    <svg id="chart" viewbox="0 0 1000 562">
                        <defs>
                            <mask id="left-blur-mask">
                                <rect width="1000" height="562" fill="url(#left-blur-mask-gradient)"></rect>
                                <linearGradient id="left-blur-mask-gradient" x1="0" y1="0" x2="0.5" y2="0">
                                    <stop stop-color="white" offset="0%"/>
                                    <stop stop-color="black" offset="100%"/>
                                </linearGradient>
                            </mask>
                            <filter id="left-blur-filter" x="0" width="50%">
                                <feImage xlink:href="#series" x="0"  y="0" width="1000" height="562" result="image" />
                                <feFlood flood-opacity="1" flood-color="black" result="flood"/>
                                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
                                <feComposite in="blur" in2="flood" operator="over"/>
                            </filter>

                            <mask id="right-blur-mask">
                                <rect width="1000" height="562" fill="url(#right-blur-mask-gradient)"></rect>
                                <linearGradient id="right-blur-mask-gradient" x1="0.7" y1="0" x2="1" y2="0">
                                    <stop stop-color="black" offset="0%"/>
                                    <stop stop-color="white" offset="100%"/>
                                </linearGradient>
                            </mask>
                            <filter id="right-blur-filter" x="70%" width="30%">
                                <feFlood flood-opacity="1" flood-color="black"/>
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
                        <g class="left-blur"/>
                        <g class="right-blur"/>
                        <g class="flare"/>
                    </svg>
                    <div id="label">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">

    fc.basecoin = {};

(function(d3, fc) {
    'use strict';

    fc.basecoin.candlestick = function() {

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

(function(d3, fc) {
    'use strict';

    fc.basecoin.label = function() {

        var xScale = fc.scale.dateTime(),
            yScale = d3.scale.linear();

        var dataJoin = fc.util.dataJoin()
            .selector('svg')
            .element('svg')
            .key(function(d) { return d.date; });

        var labels = function(selection) {
            selection.each(function(data) {
                var update = dataJoin(this, data);

                var enter = update.enter()
                    .attr('viewport', '0 0 1000 562')
                    .append('g');

                enter.append('path')
                    .attr('d', function(d) {
                        return d.open < d.close ?
                            'M 0 14 L 8 0 L 15 14 Z' : 'M 0 0 L 8 14 L 15 0 Z';
                    })
                    .attr('fill', function(d) {
                        return d.open < d.close ?
                            'green' : 'red';
                    });

                enter.append('text')
                    .attr({
                        x: 18,
                        y: 12
                    })
                    .text(function(d) {
                        return d.close.toFixed(3);
                    });

                update.style('transform', function(d) {
                        return 'translateZ(' + d.depth.toFixed(2) + 'px)';
                    })
                    .select('g')
                    .attr('transform', function(d) {
                        return 'translate(' + xScale(d.date) + ',' + yScale(d.close) + ')';
                    });

            });
        };

        labels.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return labels;
        };
        labels.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return labels;
        };

        return labels;
    };
})(d3, fc);

(function(d3, fc) {
    'use strict';

    fc.basecoin.camera = function() {

        var camera = function(selection) {

            var data = selection.datum();
            if (!data) {
                selection.datum({
                    rotation: [7, 11, 0],
                    position: [116, -67, 41]
                });
            }

            selection.on('mousedown.camera', mousedown)
                .on('mousemove.camera', mousemove)
                .on('mouseup.camera', mouseup);

            selection.select('#camera')
                .style('transform', function(d) {
                    return [
                        'rotateX(' + d.rotation[1].toFixed(2) + 'deg)',
                        'rotateY(' + d.rotation[0].toFixed(2) + 'deg)',
                        'translate3d(' + d.position[0].toFixed(2) + 'px, ' +
                            d.position[1].toFixed(2) + 'px, ' +
                            d.position[2].toFixed(2) + 'px)'
                    ].join(' ');
                });

        };

        function mousedown() {
            var mouse = d3.mouse(document.body);
            var container = d3.select(this);
            var data = container.datum();

            data.origin = mouse;
        }

        function mousemove() {
            var mouse = d3.mouse(document.body);
            var container = d3.select(this);
            var data = container.datum();

            if (data.origin) {

                var dx = mouse[0] - data.origin[0],
                    dy = mouse[1] - data.origin[1];

                if (d3.event.shiftKey) {
                    data.rotation[0] += dx;
                    data.rotation[1] += dy;
                } else if (d3.event.ctrlKey) {
                    data.position[2] += dy;
                } else {
                    data.position[0] += dx;
                    data.position[1] += dy;
                }

                container.call(camera);

                data.origin = mouse;
            }
        }

        function mouseup() {
            var mouse = d3.mouse(document.body);
            var container = d3.select(this);
            var data = container.datum();

            if (data.origin) {

                var dx = mouse[0] - data.origin[0],
                    dy = mouse[1] - data.origin[1];

                if (d3.event.shiftKey) {
                    data.rotation[0] += dx;
                    data.rotation[1] += dy;
                } else if (d3.event.ctrlKey) {
                    data.position[2] += dy;
                } else {
                    data.position[0] += dx;
                    data.position[1] += dy;
                }

                container.call(camera);

                data.origin = null;
            }
        }

        return camera;
    };

    d3.select('#viewport')
        .call(fc.basecoin.camera());
})(d3, fc);


</script>

<script type="text/javascript">
(function(d3, fc) {
    'use strict';

    var WIDTH = 1000, HEIGHT = 562;

    var dataGenerator = fc.data.random.financial()
        .filter(fc.util.fn.identity)
        .startDate(new Date(2014, 1, 1));

    var data = dataGenerator(150);

    data.forEach(function(d, i) {
        d.verticalLine = [12, 48, 55, 65, 80].indexOf(i) > -1;
    });

    var backgroundContainer = d3.select('#background'),
        chartContainer = d3.select('#chart'),
        gridlineContainer = chartContainer.select('#gridline'),
        seriesContainer = chartContainer.select('#series'),
        labelContainer = d3.select('#label');

    function render() {
        var xExtent = [data[20].date, data[data.length-1].date];
        var xDelta = xExtent[1] - xExtent[0];

        var xScale = fc.scale.dateTime()
            .domain([xExtent[0], new Date(xExtent[1].getTime() + xDelta/2)])
            .range([0, WIDTH]);

        var yExtent = fc.util.extent(data, ['low', 'high']);
        var yMid = (yExtent[1] - yExtent[0]) / 2 + yExtent[0];

        var yScale = d3.scale.linear()
            .domain([yMid - 20, yMid + 20])
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
            .yTicks(12);

        gridlineContainer.datum(data)
            .call(gridline);

        // ---

        var candlestick = fc.basecoin.candlestick();

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

        // ---

        var label = fc.basecoin.label()
            .xScale(xScale)
            .yScale(yScale);

        labelContainer.datum(data.filter(function(d) { return d.label; }))
            .call(label);
    }

    var frames = 10000;

    requestAnimationFrame(function raf() {
        // d3.select('#camera')
        //     .attr('transform', [
        //         'scale(1.6)',
        //         'rotateX(' + rx.toFixed(2) + 'deg)',
        //         'rotateY(' + ry.toFixed(2) + 'deg)'
        //     ].join(' '));

        data.shift();

        var item = dataGenerator(1)[0];

        item.verticalLine = Math.random() > 0.95;

        if (Math.random() > 0.9) {
            item.label = true;
            item.depth = Math.random() * 150;
        }

        data.push(item);

        render();

        if (frames-->0) {
            requestAnimationFrame(raf);
        }
    });

})(d3, fc);

</script>

