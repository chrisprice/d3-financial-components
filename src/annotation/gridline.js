(function(d3, fc) {
    'use strict';

    fc.annotation.gridline = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xTicks = 10, // SHOULD HOLD ARGUMENTS FOR TICKS
            xTickValues = null,
            yTicks = 10, // SHOULD HOLD ARGUMENTS FOR TICKS
            yTickValues = null;

        var xDataJoin = fc.util.dataJoin()
            .selector('line.x')
            .element('line')
            .attrs({'class': 'x gridline'})
            .key(fc.util.fn.identity);

        var yDataJoin = fc.util.dataJoin()
            .selector('line.y')
            .element('line')
            .attrs({'class': 'y gridline'})
            .key(fc.util.fn.identity);

        var gridlines = function(selection) {

            selection.each(function() {

                var xLines = xDataJoin(this, xTickValues || xScale.ticks(xTicks));

                xLines.attr({
                    'x1': xScale,
                    'x2': xScale,
                    'y1': yScale.range()[0],
                    'y2': yScale.range()[1]
                });

                var yLines = yDataJoin(this, yTickValues || yScale.ticks(yTicks));

                yLines.attr({
                    'x1': xScale.range()[0],
                    'x2': xScale.range()[1],
                    'y1': yScale,
                    'y2': yScale
                });
            });
        };

        gridlines.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return gridlines;
        };
        gridlines.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return gridlines;
        };
        gridlines.xTicks = function(x) {
            if (!arguments.length) {
                return xTicks;
            }
            xTicks = x;
            return gridlines;
        };
        gridlines.xTickValues = function(x) {
            if (!arguments.length) {
                return xTickValues;
            }
            xTickValues = x;
            return gridlines;
        };
        gridlines.yTicks = function(x) {
            if (!arguments.length) {
                return yTicks;
            }
            yTicks = x;
            return gridlines;
        };
        gridlines.yTickValues = function(x) {
            if (!arguments.length) {
                return yTickValues;
            }
            yTickValues = x;
            return gridlines;
        };


        return gridlines;
    };
}(d3, fc));
