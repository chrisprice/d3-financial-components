import d3 from 'd3';
import * as fn from '../utilities/fn';
import property from '../utilities/property';
import simpleDataJoin from '../utilities/simpleDataJoin';

export default function() {

    var annotation = function(selection) {
        selection.each(function(data) {
            var xScaleRange = annotation.xScale.value.range(),
                y = function(d) { return annotation.yScale.value(annotation.yValue.value(d)); };

            var container = d3.select(this);

            // Create a group for each annotation
            var g = simpleDataJoin(container, 'annotation', data, annotation.keyValue.value);

            // Added the required elements - each annotation consists of a line and text label
            var enter = g.enter();
            enter.append('line');
            enter.append('text');

            // Update the line
            g.select('line')
                .attr('x1', xScaleRange[0])
                .attr('y1', y)
                .attr('x2', xScaleRange[1])
                .attr('y2', y);

            // Update the text label
            var paddingValue = annotation.padding.value.apply(this, arguments);
            g.select('text')
                .attr('x', xScaleRange[1] - paddingValue)
                .attr('y', function(d) { return y(d) - paddingValue; })
                .text(annotation.label.value);

            annotation.decorate.value(g);
        });
    };

    annotation.xScale = property(d3.time.scale());
    annotation.yScale = property(d3.scale.linear());
    annotation.yValue = property.functor(fn.identity);
    annotation.keyValue = property.functor(fn.index);
    annotation.label = property.functor(annotation.yValue.value);
    annotation.padding = property.functor(2);
    annotation.decorate = property(fn.noop);

    return annotation;
}
