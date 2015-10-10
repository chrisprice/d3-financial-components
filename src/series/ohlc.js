import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import fractionalBarWidth from '../util/fractionalBarWidth';
import {noop} from '../util/fn';
import ohlcSvg from '../svg/ohlc';
import ohlcBase from './ohlcBase';

export default function(drawMethod) {

    var decorate = noop,
        barWidth = fractionalBarWidth(0.75);

    var base = ohlcBase();

    var dataJoin = dataJoinUtil()
        .selector('g.ohlc')
        .element('g')
        .attr('class', 'ohlc');

    var ohlc = function(selection) {
        selection.each(function(data, index) {

            var g = dataJoin(this, data);

            g.enter()
                .append('path');

            var pathGenerator = ohlcSvg()
                .x(function() { return 0; })
                .width(barWidth(data.map(base.x)))
                .high(function() { return 0; });

            g.each(function(d, i) {
                var yHigh = base.yHigh(d, i);

                var g = d3.select(this)
                    .attr('class', 'ohlc ' + base.upDown(d, i))
                    .attr('transform', 'translate(' + base.x(d, i) + ', ' + yHigh + ')');

                pathGenerator.open(function() { return base.yOpen(d, i) - yHigh; })
                    .low(function() { return base.yLow(d, i) - yHigh; })
                    .close(function() { return base.yClose(d, i) - yHigh; });

                g.select('path')
                    .attr('d', pathGenerator([d]));
            });

            decorate(g, data, index);
        });
    };

    ohlc.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return ohlc;
    };
    ohlc.barWidth = function(x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(x);
        return ohlc;
    };

    d3.rebind(ohlc, base, 'xScale', 'xValue', 'yScale', 'yValue', 'yOpenValue', 'yHighValue', 'yLowValue', 'yCloseValue');
    d3.rebind(ohlc, dataJoin, 'key');

    return ohlc;
}
