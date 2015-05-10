import d3 from 'd3';
import * as fn from '../utilities/fn';
import fractionalBarWidth from '../utilities/fractionalBarWidth';
import property from '../utilities/property';
import simpleDataJoin from '../utilities/simpleDataJoin';

export default function() {

    // convenience functions that return the x & y screen coords for a given point
    var x = function(d) { return candlestick.xScale.value(candlestick.xValue.value(d)); };
    var yOpen = function(d) { return candlestick.yScale.value(candlestick.yOpenValue.value(d)); };
    var yHigh = function(d) { return candlestick.yScale.value(candlestick.yHighValue.value(d)); };
    var yLow = function(d) { return candlestick.yScale.value(candlestick.yLowValue.value(d)); };
    var yClose = function(d) { return candlestick.yScale.value(candlestick.yCloseValue.value(d)); };

    var candlestick = function(selection) {

        selection.each(function(data) {

            var container = d3.select(this);

            var g = simpleDataJoin(container, 'candlestick', data, candlestick.xValue.value);

            g.enter()
                .append('path');

            g.classed({
                    'up': function(d) {
                        return candlestick.yCloseValue.value(d) > candlestick.yOpenValue.value(d);
                    },
                    'down': function(d) {
                        return candlestick.yCloseValue.value(d) < candlestick.yOpenValue.value(d);
                    }
                });

            var barWidth = candlestick.barWidth.value(data.map(x));

            g.select('path')
                .attr('d', function(d) {
                    // Move to the opening price
                    var body = 'M' + (x(d) - barWidth / 2) + ',' + yOpen(d) +
                    // Draw the width
                    'h' + barWidth +
                    // Draw to the closing price (vertically)
                    'V' + yClose(d) +
                    // Draw the width
                    'h' + -barWidth +
                    // Move back to the opening price
                    'V' + yOpen(d) +
                    // Close the path
                    'z';

                    // Move to the max price of close or open; draw the high wick
                    // N.B. Math.min() is used as we're dealing with pixel values,
                    // the lower the pixel value, the higher the price!
                    var highWick = 'M' + x(d) + ',' + Math.min(yClose(d), yOpen(d)) +
                    'V' + yHigh(d);

                    // Move to the min price of close or open; draw the low wick
                    // N.B. Math.max() is used as we're dealing with pixel values,
                    // the higher the pixel value, the lower the price!
                    var lowWick = 'M' + x(d) + ',' + Math.max(yClose(d), yOpen(d)) +
                    'V' + yLow(d);

                    return body + highWick + lowWick;
                });

            candlestick.decorate.value(g);
        });
    };

    candlestick.decorate = property(fn.noop);
    candlestick.xScale = property(d3.time.scale());
    candlestick.yScale = property(d3.scale.linear());
    candlestick.barWidth = property.functor(fractionalBarWidth(0.75));
    candlestick.yOpenValue = property(function(d) { return d.open; });
    candlestick.yHighValue = property(function(d) { return d.high; });
    candlestick.yLowValue = property(function(d) { return d.low; });
    candlestick.yCloseValue = property(function(d) { return d.close; });
    candlestick.xValue = property(function(d) { return d.date; });

    return candlestick;

}
