import d3 from 'd3';
import property from '../utilities/property';
import simpleDataJoin from '../utilities/simpleDataJoin';

export default function() {

    var gridlines = function(selection) {

        selection.each(function() {

            var container = d3.select(this);

            var xLines = simpleDataJoin(container, 'x',
                gridlines.xScale.value.ticks(gridlines.xTicks.value));

            xLines.enter()
                .append('line')
                .attr('class', 'gridline');

            xLines.select('line')
                .attr({
                    'x1': gridlines.xScale.value,
                    'x2': gridlines.xScale.value,
                    'y1': gridlines.yScale.value.range()[0],
                    'y2': gridlines.yScale.value.range()[1]
                });

            var yLines = simpleDataJoin(container, 'y',
                gridlines.yScale.value.ticks(gridlines.yTicks.value));

            yLines.enter()
                .append('line')
                .attr('class', 'gridline');

            yLines.select('line')
                .attr({
                    'x1': gridlines.xScale.value.range()[0],
                    'x2': gridlines.xScale.value.range()[1],
                    'y1': gridlines.yScale.value,
                    'y2': gridlines.yScale.value
                });


        });
    };

    gridlines.xScale = property(d3.time.scale());
    gridlines.yScale = property(d3.scale.linear());
    gridlines.xTicks = property(10);
    gridlines.yTicks = property(10);


    return gridlines;
}
