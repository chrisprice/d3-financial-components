import d3 from 'd3';
import dateTime from '../scale/dateTime';
import multiSeries from '../series/multi';
import lineSeries from '../series/line';
import pointSeries from '../series/point';
import innerDimensions from '../utilities/innerDimensions';
import rebind from '../utilities/rebind';
import property from '../utilities/property';

export default function() {
    // creates an array with four elements, representing the high, low, open and close
    // values of the given array
    function highLowOpenClose(data) {
        var xValueAccessor = sparkline.xValue(),
            yValueAccessor = sparkline.yValue();

        var high = d3.max(data, yValueAccessor);
        var low = d3.min(data, yValueAccessor);

        function elementWithYValue(value) {
            return data.filter(function(d) {
                return yValueAccessor(d) === value;
            })[0];
        }

        return [{
                x: xValueAccessor(data[0]),
                y: yValueAccessor(data[0])
            }, {
                x: xValueAccessor(elementWithYValue(high)),
                y: high
            }, {
                x: xValueAccessor(elementWithYValue(low)),
                y: low
            }, {
                x: xValueAccessor(data[data.length - 1]),
                y: yValueAccessor(data[data.length - 1])
            }];
    }

    var xScale = dateTime();
    var yScale = d3.scale.linear();
    var line = lineSeries();

    // configure the point series to render the data from the
    // highLowOpenClose function
    var point = pointSeries()
        .xValue(function(d) { return d.x; })
        .yValue(function(d) { return d.y; })
        .decorate(function(sel) {
            sel.attr('class', function(d, i) {
                switch (i) {
                    case 0: return 'open';
                    case 1: return 'high';
                    case 2: return 'low';
                    case 3: return 'close';
                }
            });
        });

    var multi = multiSeries()
        .series([line, point])
        .mapping(function(data, series) {
            switch (series) {
                case point:
                    return highLowOpenClose(data);
                default:
                    return data;
            }
        });

    var sparkline = function(selection) {

        point.radius(sparkline.radius.value);

        selection.each(function(data) {

            var container = d3.select(this);
            var dimensions = innerDimensions(this);
            var margin = sparkline.radius.value;

            xScale.range([margin, dimensions.width - margin]);
            yScale.range([dimensions.height - margin, margin]);

            multi.xScale(xScale)
                .yScale(yScale);

            container.call(multi);

        });
    };

    rebind(sparkline, xScale, {
        xDiscontinuityProvider: 'discontinuityProvider',
        xDomain: 'domain'
    });

    rebind(sparkline, yScale, {
        yDomain: 'domain'
    });

    rebind(sparkline, line, 'xValue', 'yValue');

    sparkline.xScale = function() { return xScale; };
    sparkline.yScale = function() { return yScale; };

    sparkline.radius = property(2);

    return sparkline;
}
