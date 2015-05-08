import d3 from 'd3';
import barSeries from '../series/bar';
import * as fn from '../utilities/fn';
import fractionalBarWidth from '../utilities/fractionalBarWidth';
import property from '../utilities/property';
import rebind from '../utilities/rebind';

export default function() {

    var stackLayout = d3.layout.stack();

    var stackedBar = function(selection) {

        var bar = barSeries()
            .xScale(stackedBar.xScale.value)
            .yScale(stackedBar.yScale.value)
            .xValue(stackLayout.x())
            .yValue(stackLayout.y())
            .y0Value(stackedBar.y0Value.value);

        selection.each(function(data) {

            var layers = stackLayout(data);

            var container = d3.select(this);

            // Pull data from series objects.
            var layeredData = layers.map(stackLayout.values());

            var series = container.selectAll('g.stacked-bar')
                .data(layeredData)
                .enter()
                .append('g')
                .attr('class', 'stacked-bar')
                .call(bar);

            stackedBar.decorate.value(series);
        });
    };

    stackedBar.decorate = property(fn.noop);

    stackedBar.barWidth = property.functor(fractionalBarWidth(0.75));

    stackedBar.xScale = property(d3.time.scale());

    stackedBar.yScale = property(d3.scale.linear());

    // Implicitly dependant on the implementation of the stack layout's `out`.
    stackedBar.y0Value = property(function(d) {
        return d.y0;
    });

    return rebind(stackedBar, stackLayout, {
        xValue: 'x',
        yValue: 'y',
        out: 'out',
        offset: 'offset',
        values: 'values',
        order: 'order'
    });
}
