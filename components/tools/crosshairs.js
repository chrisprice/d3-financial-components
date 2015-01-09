(function(d3, fc) {
    'use strict';

    fc.tools.crosshairs = function() {

        var event = d3.dispatch('trackingstart', 'trackingmove', 'freeze', 'unfreeze', 'trackingend'),
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            snap = function(x, y) { return {x: x, y: y}; },
            xLabel = function(d) { return ''; },
            yLabel = function(d) { return ''; },
            decorate = function(s) { },
            freezable = true,
            padding = 2;

        var crosshairs = function(selection) {

            selection.each(function() {

                var container = d3.select(this);

                var g = container.selectAll('g.crosshairs');
                // Lazily create one target to be used for data binding
                this.__chart__ = this.__chart__ || {};
                var data = this.__chart__.crosshairs;
                if (data == null) {
                    data = [{
                        tracking: false,
                        x: 0,
                        y: 0
                    }];
                    this.__chart__.crosshairs = data;
                }
                g = g.data(data);

                var enter = g.enter()
                    .append('g')
                    .attr('class', 'crosshairs')
                    .style('pointer-events', 'all');
                enter.append('rect')
                    .attr('class', 'overlay')
                    .style('visibility', 'hidden');
                enter.append('line')
                    .attr('class', 'horizontal');
                enter.append('line')
                    .attr('class', 'vertical');
                enter.append('circle')
                    .attr('r', 6);
                enter.append('text')
                    .attr('class', 'horizontal');
                enter.append('text')
                    .attr('class', 'vertical')
                    .attr('y', '1em');

                g.exit()
                    .remove();

                g.style('visibility', function(d) { return d.tracking || d.frozen ? '' : 'hidden'; })
                    .classed('frozen', function(d) { return d.frozen; });

                g.select('rect.overlay')
                    .attr('x', xScale.range()[0])
                    .attr('y', yScale.range()[1])
                    .attr('width', xScale.range()[1])
                    .attr('height', yScale.range()[0]);

                g.select('line.horizontal')
                    .attr('x1', xScale.range()[0])
                    .attr('x2', xScale.range()[1])
                    .attr('y1', function(d) { return d.y; })
                    .attr('y2', function(d) { return d.y; });

                g.select('line.vertical')
                    .attr('y1', yScale.range()[0])
                    .attr('y2', yScale.range()[1])
                    .attr('x1', function(d) { return d.x; })
                    .attr('x2', function(d) { return d.x; });

                g.select('circle')
                    .attr('cx', function(d) { return d.x; })
                    .attr('cy', function(d) { return d.y; });

                g.select('text.horizontal')
                    .attr('x', xScale.range()[1] - padding)
                    .attr('y', function(d) { return d.y - padding; })
                    .text(function(d) { return yLabel(d.datum); });

                g.select('text.vertical')
                    .attr('x', function(d) { return d.x - padding; })
                    .text(function(d) { return xLabel(d.datum); });

                decorate(g);

                container.on('mouseenter.crosshairs', mouseenter);
            });

        };

        function mouseenter() {
            var container = d3.select(this)
                .on('mousemove.crosshairs', mousemove)
                .on('mouseleave.crosshairs', mouseleave)
                .on('click.crosshairs', mouseclick);
            container.selectAll('g.crosshairs')
                .each(function(d) {
                    d.tracking = true;
                    event.trackingstart.apply(this, arguments);
                });
            container.call(crosshairs);
        }

        function mousemove() {
            var container = d3.select(this);
            container.selectAll('g.crosshairs')
                .each(function(d) {
                    if (d.frozen) {
                        return;
                    }
                    var mouse = d3.mouse(this);
                    var nearest = snap(mouse[0], mouse[1]);
                    if (nearest != null &&
                        (d.datum !== nearest.datum || d.x !== nearest.x || d.y !== nearest.y)) {
                        d.datum = nearest.datum;
                        d.x = nearest.x;
                        d.y = nearest.y;
                        event.trackingmove.apply(this, arguments);
                    }
                });
            container.call(crosshairs);
        }

        function mouseleave() {
            var container = d3.select(this);
            container.selectAll('g.crosshairs')
                .each(function(d) {
                    d.tracking = false;
                    event.trackingend.apply(this, arguments);
                });
            container.call(crosshairs)
                .on('mousemove.crosshairs', null)
                .on('mouseleave.crosshairs', null)
                .on('click.crosshairs', null);
        }

        function mouseclick() {
            if (freezable) {
                var container = d3.select(this);
                container.selectAll('g.crosshairs')
                    .each(function(d) {
                        d.frozen = !d.frozen;
                        event[d.frozen ? 'freeze' : 'unfreeze'].apply(this, arguments);
                    });
                container.call(crosshairs);
            }
        }

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

        crosshairs.decorate = function(value) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = value;
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

        d3.rebind(crosshairs, event, 'on');

        return crosshairs;
    };

}(d3, fc));
