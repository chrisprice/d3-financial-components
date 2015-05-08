import d3 from 'd3';
import * as fn from '../utilities/fn';
import fractionalBarWidth from '../utilities/fractionalBarWidth';
import property from '../utilities/property';
import simpleDataJoin from '../utilities/simpleDataJoin';

export default function(drawMethod) {

    // convenience functions that return the x & y screen coords for a given point
    var x = function(d) { return ohlc.xScale.value(ohlc.xValue.value(d)); };
    var yOpen = function(d) { return ohlc.yScale.value(ohlc.yOpenValue.value(d)); };
    var yHigh = function(d) { return ohlc.yScale.value(ohlc.yHighValue.value(d)); };
    var yLow = function(d) { return ohlc.yScale.value(ohlc.yLowValue.value(d)); };
    var yClose = function(d) { return ohlc.yScale.value(ohlc.yCloseValue.value(d)); };

    var ohlc = function(selection) {
        selection.each(function(data) {

            var container = d3.select(this);

            var g = simpleDataJoin(container, 'ohlc', data, ohlc.xValue.value);

            g.enter()
                .append('path');

            g.classed({
                    'up': function(d) {
                        return ohlc.yCloseValue.value(d) > ohlc.yOpenValue.value(d);
                    },
                    'down': function(d) {
                        return ohlc.yCloseValue.value(d) < ohlc.yOpenValue.value(d);
                    }
                });

            var width = ohlc.barWidth.value(data.map(x));
            var halfWidth = width / 2;

            g.select('path')
                .attr('d', function(d) {
                    var moveToLow = 'M' + x(d) + ',' + yLow(d),
                        verticalToHigh = 'V' + yHigh(d),
                        openTick = 'M' + x(d) + ',' + yOpen(d) + 'h' + (-halfWidth),
                        closeTick = 'M' + x(d) + ',' + yClose(d) + 'h' + halfWidth;
                    return moveToLow + verticalToHigh + openTick + closeTick;
                });

            ohlc.decorate.value(g);
        });
    };

    ohlc.decorate = property(fn.noop);
    ohlc.xScale = property(d3.time.scale());
    ohlc.yScale = property(d3.scale.linear());
    ohlc.barWidth = property.functor(fractionalBarWidth(0.75));
    ohlc.yOpenValue = property(function(d) { return d.open; });
    ohlc.yHighValue = property(function(d) { return d.high; });
    ohlc.yLowValue = property(function(d) { return d.low; });
    ohlc.yCloseValue = property(function(d) { return d.close; });
    ohlc.xValue = property(function(d) { return d.date; });

    return ohlc;
}
