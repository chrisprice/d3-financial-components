import d3 from 'd3';
import * as fn from '../utilities/fn';
import property from '../utilities/property';
import simpleDataJoin from '../utilities/simpleDataJoin';

export default function() {

    // convenience functions that return the x & y screen coords for a given point
    var x = function(d) { return point.xScale.value(point.xValue.value(d)); };
    var y = function(d) { return point.yScale.value(point.yValue.value(d)); };

    var point = function(selection) {

        selection.each(function(data) {

            var container = d3.select(this);

            var g = simpleDataJoin(container, 'point', data, point.xValue.value);

            g.enter()
                .append('circle');

            g.select('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', point.radius.value);

            point.decorate.value(g);
        });
    };

    point.decorate = property(fn.noop);
    point.xScale = property(d3.time.scale());
    point.yScale = property(d3.scale.linear());
    point.yValue = property(function(d) { return d.close; });
    point.xValue = property(function(d) { return d.date; });
    point.radius = property.functor(5);

    return point;
}
