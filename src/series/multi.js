import d3 from 'd3';
import * as fn from '../utilities/fn';
import property from '../utilities/property';

export default function() {

    var multi = function(selection) {

        selection.each(function(data) {

            var container = d3.select(this);

            var g = container.selectAll('g.multi-outer')
                .data(multi.series.value);

            g.enter()
                .append('g')
                .attr('class', 'multi-outer')
                .append('g')
                .attr('class', 'multi-inner');

            g.exit()
                .remove();

            g.select('g.multi-inner')
                .each(function() {

                    var series = d3.select(this.parentNode)
                        .datum();

                    (series.xScale || series.x).call(series, multi.xScale.value);
                    (series.yScale || series.y).call(series, multi.yScale.value);

                    d3.select(this)
                        .datum(multi.mapping.value(data, series))
                        .call(series);
                });
        });
    };

    multi.xScale = property(d3.time.scale());
    multi.yScale = property(d3.scale.linear());
    multi.series = property([]);
    multi.mapping = property(fn.identity);

    return multi;
}
