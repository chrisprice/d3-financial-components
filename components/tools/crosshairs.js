(function(d3, fc) {
    'use strict';

    fc.tools.crosshairs = function() {

        var //eventTarget = null,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            snap = function(x, y) {
                return {
                    datum: {
                        date: xScale.invert(x),
                        close: yScale.invert(y)
                    },
                    x: x,
                    y: y
                };
            },
            xLabel = fc.utilities.valueAccessor('date'),
            yLabel = fc.utilities.valueAccessor('close'),
            active = true,
            freezable = true,
            padding = 2;

        var targets = [];

        var crosshairs = function(selection) {

            selection.each(function() {

                var container = d3.select(this);

                var g = container.selectAll('g.crosshairs')
                    .data(targets);

                var enter = g.enter()
                    .append('g')
                    .attr('class', 'crosshairs');
                enter.append('rect')
                    .attr('class', 'crosshairs overlay')
                    .style('opacity', 0);
                enter.append('line')
                    .attr('class', 'crosshairs horizontal');
                enter.append('line')
                    .attr('class', 'crosshairs vertical');
                enter.append('circle')
                    .attr('class', 'crosshairs circle')
                    .attr('r', 6);
                enter.append('text')
                    .attr('class', 'crosshairs callout horizontal')
                    .attr('style', 'text-anchor: end');
                enter.append('text')
                    .attr('class', 'crosshairs callout vertical')
                    .attr('y', '1em')
                    .attr('style', 'text-anchor: end');

                g.exit()
                    .remove();

                g.select('rect.overlay')
                    .attr('x', xScale.range()[0])
                    .attr('y', yScale.range()[1])
                    .attr('width', xScale.range()[1])
                    .attr('height', yScale.range()[0]);

                g.select('line.horizontal')
                    .attr('x1', xScale.range()[0])
                    .attr('x2', xScale.range()[1])
                    .attr('y1', function(d) { return d.y; })
                    .attr('y2', function(d) { return d.y; })
                    .classed('frozen', !active);

                g.select('line.vertical')
                    .attr('y1', yScale.range()[0])
                    .attr('y2', yScale.range()[1])
                    .attr('x1', function(d) { return d.x; })
                    .attr('x2', function(d) { return d.x; })
                    .classed('frozen', !active);

                g.select('circle')
                    .attr('cx', function(d) { return d.x; })
                    .attr('cy', function(d) { return d.y; })
                    .classed('frozen', !active);

                g.select('text.horizontal')
                    .attr('x', xScale.range()[1] - padding)
                    .attr('y', function(d) { return d.y - padding; })
                    .text(function(d) { return yLabel(d.datum); });

                g.select('text.vertical')
                    .attr('x', function(d) { return d.x - padding; })
                    .text(function(d) { return xLabel(d.datum); });

                container.on('mousemove.crosshairs', mousemove);
                container.on('mouseleave.crosshairs', mouseleave);
                container.on('click.crosshairs', mouseclick);
            });

        };

        function mousemove() {

            var container = d3.select(this);

            if (active) {

                var mouse = d3.mouse(container[0][0]);
                var nearest = snap(mouse[0], mouse[1]);
                if (nearest != null) {
                    var target = targets[0];
                    if (target == null) {
                        target = targets[0] = {};
                    }
                    target.datum = nearest.datum;
                    target.x = nearest.x;
                    target.y = nearest.y;
                }
            }

            container.call(crosshairs);
        }

        function mouseleave() {

            if (active) {
                d3.select(this)
                    .call(crosshairs.clear);
            }
        }

        function mouseclick() {

            if (freezable) {
                active = !active;
                d3.select(this)
                    .call(crosshairs);
            }
        }

        crosshairs.clear = function(selection) {
            targets.length = 0; // THIS COULD BE STORED AS A PROPERTY
            selection.call(crosshairs);
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
