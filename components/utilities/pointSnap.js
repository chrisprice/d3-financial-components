(function(d3, fc) {
    'use strict';

    fc.utilities.pointSnap = function(xScale, yScale, xValue, yValue, data) {
        return function(xPixel, yPixel) {
            var x = xScale.invert(xPixel),
                y = yScale.invert(yPixel),
                nearest = null,
                minDiff = Number.MAX_VALUE;
            for (var i = 0, l = data.length; i < l; i++) {
                var d = data[i],
                    dx = x - xValue(d),
                    dy = y - yValue(d),
                    diff = Math.sqrt(dx * dx + dy * dy);

                if (diff < minDiff) {
                    minDiff = diff;
                    nearest = d;
                } else {
                    break;
                }
            }

            return {
                datum: nearest,
                x: nearest ? xScale(xValue(nearest)) : xPixel,
                y: nearest ? yScale(yValue(nearest)) : yPixel
            };
        };
    };

    fc.utilities.seriesPointSnap = function(series, data) {
        var xScale = series.xScale(),
            yScale = series.yScale(),
            xValue = series.xValue(),
            yValue = series.yValue();
        return fc.utilities.pointSnap(xScale, yScale, xValue, yValue, data);
    };

    fc.utilities.ohlcSeriesPointSnap = function(series, data) {
        var xScale = series.xScale(),
            yScale = series.yScale(),
            xValue = series.xValue(),
            yValue = series.yCloseValue();
        return fc.utilities.pointSnap(xScale, yScale, xValue, yValue, data);
    };

}(d3, fc));
