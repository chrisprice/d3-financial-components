(function(d3, fc) {
    'use strict';

    fc.indicators.bollingerBands = function() {

        var algorithm = fc.indicators.algorithms.bollingerBands(),
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = function(d) { return d.close; },
            xValue = function(d) { return d.date; },
            writeCalculatedValue = function(d, value) { d.bollingerBands = value; },
            readCalculatedValue = function(d) { return d.bollingerBands || {}; };

        var area = fc.series.area()
            .y0Value(function(d) {
                return readCalculatedValue(d).upper;
            })
            .y1Value(function(d) {
                return readCalculatedValue(d).lower;
            });

        var upperLine = fc.series.line()
            .yValue(function(d) {
                return readCalculatedValue(d).upper;
            });

        var averageLine = fc.series.line()
            .yValue(function(d) {
                return readCalculatedValue(d).average;
            });

        var lowerLine = fc.series.line()
            .yValue(function(d) {
                return readCalculatedValue(d).lower;
            });

        var bollingerBands = function(selection) {

            algorithm.inputValue(yValue)
                .outputValue(writeCalculatedValue);

            area.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue);

            upperLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue);

            averageLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue);

            lowerLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue);

            selection.each(function(data) {
                algorithm(data);

                var container = d3.select(this);

                var areaContianer = container.selectAll('g.area')
                    .data([data]);

                areaContianer.enter()
                    .append('g')
                    .attr('class', 'area');

                areaContianer.call(area);

                var upperLineContainer = container.selectAll('g.upper')
                    .data([data]);

                upperLineContainer.enter()
                    .append('g')
                    .attr('class', 'upper');

                upperLineContainer.call(upperLine);

                var averageLineContainer = container.selectAll('g.average')
                    .data([data]);

                averageLineContainer.enter()
                    .append('g')
                    .attr('class', 'average');

                averageLineContainer.call(averageLine);

                var lowerLineContainer = container.selectAll('g.lower')
                    .data([data]);

                lowerLineContainer.enter()
                    .append('g')
                    .attr('class', 'lower');

                lowerLineContainer.call(lowerLine);
            });
        };

        bollingerBands.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return bollingerBands;
        };
        bollingerBands.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return bollingerBands;
        };
        bollingerBands.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return bollingerBands;
        };
        bollingerBands.yValue = function(x) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = x;
            return bollingerBands;
        };
        bollingerBands.writeCalculatedValue = function(x) {
            if (!arguments.length) {
                return writeCalculatedValue;
            }
            writeCalculatedValue = x;
            return bollingerBands;
        };
        bollingerBands.readCalculatedValue = function(x) {
            if (!arguments.length) {
                return readCalculatedValue;
            }
            readCalculatedValue = x;
            return bollingerBands;
        };

        d3.rebind(bollingerBands, algorithm, 'multiplier', 'windowSize');

        return bollingerBands;
    };
}(d3, fc));