(function(d3, fc) {
    'use strict';

    fc.series.multi = function() {

        var multi = function(selection) {

            selection.each(function(data) {

                var g = fc.utilities.simpleDataJoin(d3.select(this), 'multi',
                    multi.series.value, fc.utilities.fn.identity);

                g.selectOrAppend('g')
                    .datum(data)
                    .call(function(selection) {
                        selection.each(function() {

                            var series = d3.select(this.parentNode).datum();

                            if (multi.xScale.value != null) {
                                series.xScale(multi.xScale.value);
                            }
                            if (multi.yScale.value != null) {
                                series.yScale(multi.yScale.value);
                            }
                            if (multi.xValue.value != null) {
                                series.xValue(multi.xValue.value);
                            }
                            if (multi.yValue.value != null) {
                                series.yValue(multi.yValue.value);
                            }

                            d3.select(this)
                                .call(series);
                        });
                    });

                multi.decorate.value(g);
            });
        };

        multi.decorate = fc.utilities.property(fc.utilities.fn.noop);
        multi.xScale = fc.utilities.property(d3.time.scale());
        multi.yScale = fc.utilities.property(d3.scale.linear());
        multi.xValue = fc.utilities.property(function(d) { return d.date; });
        multi.yValue = fc.utilities.property(function(d) { return d.close; });
        multi.series = fc.utilities.property([]);

        return multi;
    };
}(d3, fc));