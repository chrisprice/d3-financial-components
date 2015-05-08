import d3 from 'd3';
import * as fn from '../utilities/fn';
import property from '../utilities/property';

export default function() {

    // convenience functions that return the x & y screen coords for a given point
    var x = function(d) { return line.xScale.value(line.xValue.value(d)); };
    var y = function(d) { return line.yScale.value(line.yValue.value(d)); };

    var lineData = d3.svg.line()
        .defined(function(d) {
            return !isNaN(y(d));
        })
        .x(x)
        .y(y);

    var line = function(selection) {

        selection.each(function(data) {

            var path = d3.select(this)
                .selectAll('path.line')
                .data([data]);

            path.enter()
                .append('path')
                .attr('class', 'line');

            path.attr('d', lineData);

            line.decorate.value(path);
        });
    };

    line.decorate = property(fn.noop);
    line.xScale = property(d3.time.scale());
    line.yScale = property(d3.scale.linear());
    line.yValue = property(function(d) { return d.close; });
    line.xValue = property(function(d) { return d.date; });

    return d3.rebind(line, lineData, 'interpolate', 'tension');
}
