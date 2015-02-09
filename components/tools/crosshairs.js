(function(d3, fc) {
    'use strict';

    fc.tools.crosshairs = function() {

        var event = d3.dispatch('trackingstart', 'tracking', 'trackingend');

        var crosshairs = function(selection) {

            selection.each(function() {

                if (!this.__crosshairs__) {
                    this.__crosshairs__ = [];
                }
                var data = this.__crosshairs__;

                var container = d3.select(this)
                    .style('pointer-events', 'all')
                    .on('mouseenter.crosshairs', mouseenter);

                container.selectOrAppend('rect', 'background')
                    .style('visibility', 'hidden');

                function scaleExtent(domain) {
                    var start = domain[0], stop = domain[domain.length - 1];
                    return start < stop ? [start, stop] : [stop, start];
                }

                function scaleRange(scale) {
                    return scale.rangeExtent ? scale.rangeExtent() : scaleExtent(scale.range());
                }

                var xRange = scaleRange(crosshairs.xScale.value);
                var yRange = scaleRange(crosshairs.yScale.value);

                container.select('rect')
                    .attr('x', xRange[0])
                    .attr('y', yRange[0])
                    .attr('width', xRange[1] - xRange[0])
                    .attr('height', yRange[1] - yRange[0]);

                var g = fc.utilities.simpleDataJoin(container, 'crosshairs', data);

                var enter = g.enter();
                enter.append('line')
                    .attr('class', 'horizontal');
                enter.append('line')
                    .attr('class', 'vertical');
                enter.append('text')
                    .attr('class', 'horizontal');
                enter.append('text')
                    .attr('class', 'vertical');

                g.select('line.horizontal')
                    .attr('x1', xRange[0])
                    .attr('x2', xRange[1])
                    .attr('y1', function(d) { return d.y; })
                    .attr('y2', function(d) { return d.y; });

                g.select('line.vertical')
                    .attr('y1', yRange[0])
                    .attr('y2', yRange[1])
                    .attr('x1', function(d) { return d.x; })
                    .attr('x2', function(d) { return d.x; });

                var paddingValue = crosshairs.padding.value.apply(this, arguments);

                g.select('text.horizontal')
                    .attr('x', xRange[1] - paddingValue)
                    .attr('y', function(d) {
                        return d.y - paddingValue;
                    })
                    .text(crosshairs.yLabel.value);

                g.select('text.vertical')
                    .attr('x', function(d) {
                        return d.x - paddingValue;
                    })
                    .attr('y', paddingValue)
                    .text(crosshairs.xLabel.value);

                crosshairs.decorate.value(g);
            });
        };

        function mouseenter() {
            d3.select(this)
                .on('mousemove.crosshairs', mousemove)
                .on('mouseleave.crosshairs', mouseleave);
            event.trackingstart.apply(this, arguments);
            mousemove.call(this);
        }

        function mousemove() {
            this.__crosshairs__[0] = crosshairs.snap.value.apply(this, d3.mouse(this));
            d3.select(this)
                .call(crosshairs);
            event.tracking.apply(this, arguments);
        }

        function mouseleave() {
            mousemove.call(this);
            this.__crosshairs__.length = 0;
            d3.select(this)
                .call(crosshairs)
                .on('mousemove.crosshairs', null)
                .on('mouseleave.crosshairs', null);
            event.trackingend.apply(this, arguments);
        }

        crosshairs.xScale = fc.utilities.property(d3.time.scale());
        crosshairs.yScale = fc.utilities.property(d3.scale.linear());
        crosshairs.snap = fc.utilities.property(function(x, y) { return {x: x, y: y}; });
        crosshairs.decorate = fc.utilities.property(fc.utilities.fn.noop);
        crosshairs.xLabel = fc.utilities.functorProperty('');
        crosshairs.yLabel = fc.utilities.functorProperty('');
        crosshairs.padding = fc.utilities.functorProperty(2);

        d3.rebind(crosshairs, event, 'on');

        return crosshairs;
    };

}(d3, fc));
