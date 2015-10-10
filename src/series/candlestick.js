import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import fractionalBarWidth from '../util/fractionalBarWidth';
import {noop} from '../util/fn';
import candlestickSvg from '../svg/candlestick';
import ohlcBase from './ohlcBase';

export default function() {

    var decorate = noop,
        barWidth = fractionalBarWidth(0.75);

    var base = ohlcBase();

    var dataJoin = dataJoinUtil()
        .selector('g.candlestick')
        .element('g')
        .attr('class', 'candlestick');

    var candlestick = function(selection) {

        selection.each(function(data, index) {

            var g = dataJoin(this, data);

            g.enter()
                .append('path');

            var pathGenerator = candlestickSvg()
                .x(function() { return 0; })
                .width(barWidth(data.map(base.x)))
                .high(function() { return 0; });

            g.each(function(d, i) {

                var yHigh = base.yHigh(d, i);

                var g = d3.select(this)
                    .attr('class', 'candlestick ' + base.upDown(d, i))
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

    candlestick.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return candlestick;
    };
    candlestick.barWidth = function(x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(x);
        return candlestick;
    };

    d3.rebind(candlestick, base, 'xScale', 'xValue', 'yScale', 'yValue', 'yOpenValue', 'yHighValue', 'yLowValue', 'yCloseValue');
    d3.rebind(candlestick, dataJoin, 'key');

    return candlestick;

}
