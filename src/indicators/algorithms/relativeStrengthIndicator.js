import d3 from 'd3';
import property from '../../utilities/property';
import slidingWindowAlgorithm from './slidingWindow';

export default function() {

    var slidingWindow = slidingWindowAlgorithm()
        .windowSize(14)
        .accumulator(function(values) {
            var downCloses = [];
            var upCloses = [];

            for (var i = 0, l = values.length; i < l; i++) {
                var value = values[i];

                var openValue = rsi.openValue.value(value);
                var closeValue = rsi.closeValue.value(value);

                downCloses.push(openValue > closeValue ? openValue - closeValue : 0);
                upCloses.push(openValue < closeValue ? closeValue - openValue : 0);
            }

            var downClosesAvg = rsi.averageAccumulator.value(downCloses);
            if (downClosesAvg === 0) {
                return 100;
            }

            var rs = rsi.averageAccumulator.value(upCloses) / downClosesAvg;
            return 100 - (100 / (1 + rs));
        });

    var rsi = function(data) {
        return slidingWindow(data);
    };

    rsi.openValue = property(function(d) { return d.open; });
    rsi.closeValue = property(function(d) { return d.close; });
    rsi.averageAccumulator = property(function(values) {
        var alpha = 1 / values.length;
        var result = values[0];
        for (var i = 1, l = values.length; i < l; i++) {
            result = alpha * values[i] + (1 - alpha) * result;
        }
        return result;
    });

    d3.rebind(rsi, slidingWindow, 'windowSize', 'outputValue');

    return rsi;
}
