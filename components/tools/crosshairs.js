(function(d3, fc) {
    'use strict';

    fc.tools.crosshairs = function() {

        var eventTarget = null,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            snap = function(xPixel, yPixel) {
                return {
                    datum: {
                        date: xScale.invert(xPixel),
                        close: xScale.invert(yPixel)
                    },
                    xPixel: xPixel,
                    yPixel: yPixel
                };
            },
            xLabel = fc.utilities.valueAccessor('date'),
            yLabel = fc.utilities.valueAccessor('close'),
            active = true,
            freezable = true,
            padding = 2;

        var lineH = null,
            lineV = null,
            circle = null,
            calloutH = null,
            calloutV = null;

        var highlight = null;

        var crosshairs = function(selection) {

            var root = d3.select(selection.node())
                .append('g')
                .attr('class', 'crosshairs');

            lineH = root.append('line')
                .attr('class', 'crosshairs horizontal')
                .attr('x1', xScale.range()[0])
                .attr('x2', xScale.range()[1])
                .attr('display', 'none');

            lineV = root.append('line')
                .attr('class', 'crosshairs vertical')
                .attr('y1', yScale.range()[0])
                .attr('y2', yScale.range()[1])
                .attr('display', 'none');

            circle = root.append('circle')
                .attr('class', 'crosshairs circle')
                .attr('r', 6)
                .attr('display', 'none');

            calloutH = root.append('text')
                .attr('class', 'crosshairs callout horizontal')
                .attr('x', xScale.range()[1] - padding)
                .attr('style', 'text-anchor: end')
                .attr('display', 'none');

            calloutV = root.append('text')
                .attr('class', 'crosshairs callout vertical')
                .attr('y', '1em')
                .attr('style', 'text-anchor: end')
                .attr('display', 'none');

            if (eventTarget == null) {
                crosshairs.eventTarget(selection);
            }
        };

        function mousemove() {

            if (active) {
                crosshairs.update();
            }
        }

        function mouseout() {

            if (active) {
                crosshairs.clear();
            }
        }

        function mouseclick() {

            if (freezable) {
                crosshairs.active(!active);
            }
        }

        function redraw() {

            var x = highlight.xPixel,
                y = highlight.yPixel;

            lineH.attr('y1', y)
                .attr('y2', y);
            lineV.attr('x1', x)
                .attr('x2', x);
            circle.attr('cx', x)
                .attr('cy', y);
            calloutH.attr('y', y - padding)
                .text(yLabel(highlight.datum));
            calloutV.attr('x', x - padding)
                .text(xLabel(highlight.datum));

            lineH.attr('display', 'inherit');
            lineV.attr('display', 'inherit');
            circle.attr('display', 'inherit');
            calloutH.attr('display', 'inherit');
            calloutV.attr('display', 'inherit');
        }

        crosshairs.update = function() {

            if (!active) {

                redraw();

            } else {

                var mouse = [0, 0];
                try {
                    mouse = d3.mouse(eventTarget[0][0]);
                }
                catch (exception) {
                    // Mouse is elsewhere
                }

                var nearest = snap(mouse[0], mouse[1]);
                if (nearest != null) {
                    highlight = nearest;
                    redraw();
                }
            }
        };

        crosshairs.clear = function() {

            highlight = null;

            lineH.attr('display', 'none');
            lineV.attr('display', 'none');
            circle.attr('display', 'none');
            calloutH.attr('display', 'none');
            calloutV.attr('display', 'none');
        };

        crosshairs.eventTarget = function(value) {
            if (!arguments.length) {
                return eventTarget;
            }

            if (eventTarget) {

                eventTarget.on('mousemove.crosshairs', null);
                eventTarget.on('mouseout.crosshairs', null);
                eventTarget.on('click.crosshairs', null);
            }

            eventTarget = value;

            eventTarget.on('mousemove.crosshairs', mousemove);
            eventTarget.on('mouseout.crosshairs', mouseout);
            eventTarget.on('click.crosshairs', mouseclick);

            return crosshairs;
        };

        crosshairs.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return crosshairs;
        };

        crosshairs.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return crosshairs;
        };

        crosshairs.snap = function(value) {
            if (!arguments.length) {
                return snap;
            }
            snap = value;
            return crosshairs;
        };

        crosshairs.xLabel = function(value) {
            if (!arguments.length) {
                return xLabel;
            }
            xLabel = value;
            return crosshairs;
        };

        crosshairs.yLabel = function(value) {
            if (!arguments.length) {
                return yLabel;
            }
            yLabel = value;
            return crosshairs;
        };

        crosshairs.active = function(value) {
            if (!arguments.length) {
                return active;
            }
            active = value;

            lineH.classed('frozen', !active);
            lineV.classed('frozen', !active);
            circle.classed('frozen', !active);

            return crosshairs;
        };

        crosshairs.freezable = function(value) {
            if (!arguments.length) {
                return freezable;
            }
            freezable = value;
            return crosshairs;
        };

        crosshairs.padding = function(value) {
            if (!arguments.length) {
                return padding;
            }
            padding = value;
            return crosshairs;
        };

        return crosshairs;
    };

}(d3, fc));
