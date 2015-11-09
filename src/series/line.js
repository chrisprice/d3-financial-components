import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import xyBase from './xyBase';

export default function() {

    var decorate = noop,
        interpolate = 'linear';

    var base = xyBase();

    var lineData = d3.svg.line()
        .defined(base.defined)
        .x(base.x)
        .y(base.y);

    var dataJoin = dataJoinUtil()
        .selector('g.line')
        .element('g')
        .attr('class', 'line');

    // function containerTranslation(d, i) {
    //     return 'translate(' + base.x.call(this, d, i) + ', ' + base.y.call(this, d, i) + ')';
    // }

    function segmentData(data, i) {
        switch (interpolate) {
        case 'linear':
        case 'step':
        case 'step-before':
        case 'step-after':
            return data.slice(i - 1, i + 1);
        default:
            return i === 0 ? [] : data.slice(i - 1);
        }
    }

    var line = function(selection) {

        lineData.interpolate(interpolate);

        selection.each(function(data, index) {

            var g = dataJoin(this, data);

            g.enter()
                .append('path');

            g.select('path')
                .attr('d', function(d, i) {
                    return lineData(segmentData(data, i));
                });

            decorate(g, data, index);
        });
    };

    line.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return line;
    };
    line.interpolate = function(x) {
        if (!arguments.length) {
            return interpolate;
        }
        interpolate = x;
        return line;
    };

    d3.rebind(line, base, 'xScale', 'xValue', 'yScale', 'yValue');
    d3.rebind(line, dataJoin, 'key');
    d3.rebind(line, lineData, 'tension');

    return line;
}
