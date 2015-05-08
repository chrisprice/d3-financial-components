import d3 from 'd3';
import * as fn from '../utilities/fn';
import fractionalBarWidth from '../utilities/fractionalBarWidth';
import property from '../utilities/property';
import simpleDataJoin from '../utilities/simpleDataJoin';

export default function() {

    // convenience functions that return the x & y screen coords for a given point
    var x = function(d) { return bar.xScale.value(bar.xValue.value(d)); };
    var barTop = function(d) { return bar.yScale.value(bar.y0Value.value(d) + bar.yValue.value(d)); };
    var barBottom = function(d) { return bar.yScale.value(bar.y0Value.value(d)); };

    var bar = function(selection) {
        selection.each(function(data) {
            var container = d3.select(this);
            var series = simpleDataJoin(container, 'bar', data, bar.xValue.value);

            // enter
            series.enter()
                .append('rect');

            var width = bar.barWidth.value(data.map(x));

            // update
            series.select('rect')
                .attr('x', function(d) {
                    return x(d) - width / 2;
                })
                .attr('y', barTop)
                .attr('width', width)
                .attr('height', function(d) {
                    return barBottom(d) - barTop(d);
                });

            // properties set by decorate will transition too
            bar.decorate.value(series);
        });
    };

    bar.decorate = property(fn.noop);
    bar.xScale = property(d3.time.scale());
    bar.yScale = property(d3.scale.linear());
    bar.barWidth = property.functor(fractionalBarWidth(0.75));
    bar.yValue = property(function(d) { return d.close; });
    bar.xValue = property(function(d) { return d.date; });
    bar.y0Value = property.functor(0);

    return bar;
}
