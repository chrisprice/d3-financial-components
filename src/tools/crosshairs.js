import d3 from 'd3';
import * as fn from '../utilities/fn';
import property from '../utilities/property';
import simpleDataJoin from '../utilities/simpleDataJoin';

export default function() {

    var event = d3.dispatch('trackingstart', 'trackingmove', 'trackingend');

    var crosshairs = function(selection) {

        selection.each(function(data) {

            var container = d3.select(this)
                .style('pointer-events', 'all')
                .on('mouseenter.crosshairs', mouseenter);

            var overlay = container.selectAll('rect')
                .data([data]);

            overlay.enter()
                .append('rect')
                .style('visibility', 'hidden');

            // ordinal axes have a rangeExtent function, this adds any padding that
            // was applied to the range. This functions returns the rangeExtent
            // if present, or range otherwise
            function rangeForScale(scaleProperty) {
                return scaleProperty.value.rangeExtent ?
                    scaleProperty.value.rangeExtent() : scaleProperty.value.range();
            }

            function rangeStart(scaleProperty) {
                return rangeForScale(scaleProperty)[0];
            }

            function rangeEnd(scaleProperty) {
                return rangeForScale(scaleProperty)[1];
            }

            container.select('rect')
                .attr('x', rangeStart(crosshairs.xScale))
                .attr('y', rangeEnd(crosshairs.yScale))
                .attr('width', rangeEnd(crosshairs.xScale))
                .attr('height', rangeStart(crosshairs.yScale));

            var g = simpleDataJoin(container, 'crosshairs', data);

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
                .attr('x1', rangeStart(crosshairs.xScale))
                .attr('x2', rangeEnd(crosshairs.xScale))
                .attr('y1', function(d) { return d.y; })
                .attr('y2', function(d) { return d.y; });

            g.select('line.vertical')
                .attr('y1', rangeStart(crosshairs.yScale))
                .attr('y2', rangeEnd(crosshairs.yScale))
                .attr('x1', function(d) { return d.x; })
                .attr('x2', function(d) { return d.x; });

            var paddingValue = crosshairs.padding.value.apply(this, arguments);

            g.select('text.horizontal')
                .attr('x', rangeEnd(crosshairs.xScale) - paddingValue)
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
        var mouse = d3.mouse(this);
        var container = d3.select(this)
            .on('mousemove.crosshairs', mousemove)
            .on('mouseleave.crosshairs', mouseleave);
        var snapped = crosshairs.snap.value.apply(this, mouse);
        var data = container.datum();
        data.push(snapped);
        container.call(crosshairs);
        event.trackingstart.apply(this, arguments);
    }

    function mousemove() {
        var mouse = d3.mouse(this);
        var container = d3.select(this);
        var snapped = crosshairs.snap.value.apply(this, mouse);
        var data = container.datum();
        data[data.length - 1] = snapped;
        container.call(crosshairs);
        event.trackingmove.apply(this, arguments);
    }

    function mouseleave() {
        var container = d3.select(this);
        var data = container.datum();
        data.pop();
        container.call(crosshairs)
            .on('mousemove.crosshairs', null)
            .on('mouseleave.crosshairs', null);
        event.trackingend.apply(this, arguments);
    }

    crosshairs.xScale = property(d3.time.scale());
    crosshairs.yScale = property(d3.scale.linear());
    crosshairs.snap = property(function(x, y) { return {x: x, y: y}; });
    crosshairs.decorate = property(fn.noop);
    crosshairs.xLabel = property.functor('');
    crosshairs.yLabel = property.functor('');
    crosshairs.padding = property.functor(2);

    d3.rebind(crosshairs, event, 'on');

    return crosshairs;
}
