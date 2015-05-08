import d3 from 'd3';
import * as fn from '../utilities/fn';
import property from '../utilities/property';

export default function() {

    // convenience functions that return the x & y screen coords for a given point
    var x = function(d) { return area.xScale.value(area.xValue.value(d)); };
    var y0 = function(d) { return area.yScale.value(area.y0Value.value(d)); };
    var y1 = function(d) { return area.yScale.value(area.y1Value.value(d)); };

    var areaData = d3.svg.area()
        .defined(function(d) {
            return !isNaN(y0(d)) && !isNaN(y1(d));
        })
        .x(x)
        .y0(y0)
        .y1(y1);

    var area = function(selection) {

        selection.each(function(data) {

            var path = d3.select(this)
                .selectAll('path.area')
                .data([data]);

            path.enter()
                .append('path')
                .attr('class', 'area');

            path.attr('d', areaData);

            area.decorate.value(path);
        });
    };

    area.decorate = property(fn.noop);
    area.xScale = property(d3.time.scale());
    area.yScale = property(d3.scale.linear());
    area.y0Value = property.functor(0);
    area.y1Value = property(function(d) { return d.close; });
    area.xValue = property(function(d) { return d.date; });

    return d3.rebind(area, areaData, 'interpolate', 'tension');
}
