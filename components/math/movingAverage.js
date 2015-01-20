(function(d3, fc) {
    'use strict';

    var movingAverageData = fc.math.movingAverage()
        .input(data)
        .xValue(fc.utilities.valueAccessor('date'))
        .yValue(fc.utilities.valueAccessor('close'))
        .output();

    fc.math.movingAverage = function() {

        var movingAverage = function(selection) {
            var line = d3.svg.line();
            line.defined(function(d, i) { return i >= averagePoints; });
            line.x(function(d) { return xScale(d.date); });

            var css = 'moving-average';
            selection.each(function(data) {

                if (averagePoints === 0) {
                    line.y(function(d) { return yScale(yValue(d)); });
                } else {
                    line.y(function(d, i) {
                        var first = i + 1 - averagePoints;
                        var sum = 0;
                        for (var index = first; index <= i; ++index) {
                            sum += yValue(data[index]);
                        }
                        var mean = sum / averagePoints;

                        return yScale(mean);
                    });
                }

                // add a 'root' g element on the first enter selection. This ensures
                // that it is just added once
                var container = d3.select(this).selectAll('g.' + css).data([data]);
                container.enter().append('g')
                    .attr('class', css);
                container.exit().remove();

                // create a data-join for the path
                var path = container.selectAll('path.' +  css).data([data]);

                // enter
                path.enter().append('path')
                    .attr('class', css);

                // update
                path.attr('d', line);

                // exit
                path.exit().remove();
            });
        };

        /**
        * Specifies the X scale which the tracker uses to locate its SVG elements. If not specified, returns
        * the current X scale, which defaults to an unmodified d3.time.scale
        *
        * @memberof fc.indicators.movingAverage
        * @method xScale
        * @param {scale} scale a D3 scale
        */
        movingAverage.xScale = function(scale) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = scale;
            return movingAverage;
        };

        /**
        * Specifies the Y scale which the tracker uses to locate its SVG elements. If not specified, returns
        * the current Y scale, which defaults to an unmodified d3.scale.linear.
        *
        * @memberof fc.indicators.movingAverage
        * @method yScale
        * @param {scale} scale a D3 scale
        */
        movingAverage.yScale = function(scale) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = scale;
            return movingAverage;
        };

        /**
        * Specifies the name of the data field which the component will follow. If not specified,
        * returns the 'close' property of each datapoint.
        *
        * @memberof fc.indicators.movingAverage
        * @method yValue
        * @param {accessor} value a D3 accessor function which returns the Y value for a given point
        */
        movingAverage.yValue = function(value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return movingAverage;
        };

        /**
        * Specifies the number of data points the tracker will use when calculating its moving average value.
        * If not specified, returns the current value, which defaults to 5.
        *
        * @memberof fc.indicators.movingAverage
        * @method averagePoints
        * @param {integer} value the number of points to average
        */
        movingAverage.averagePoints = function(value) {
            if (!arguments.length) {
                return averagePoints;
            }
            if (value >= 0) {
                averagePoints = value;
            }
            return movingAverage;
        };

        return movingAverage;
    };
}(d3, fc));
