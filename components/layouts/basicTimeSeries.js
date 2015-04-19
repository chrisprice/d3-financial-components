(function(d3, fc) {
    'use strict';

    fc.layouts.basicTimeSeries = function() {

        var basicTimeSeries = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                // Should we do this even?
                var mainContainer = container.selectOrAppend('svg')
                    .attr('overflow', 'hidden')
                    .layout('flex', 1);

                mainContainer.selectOrAppend('rect', 'background')
                    .layout({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    });

                var BODGE = container.attr('transform');
                container.layout(container.attr('layout-width'), container.attr('layout-height'))
                container.attr('transform', BODGE);

                basicTimeSeries.xScale.value.range(
                    [0, Number(mainContainer.attr('layout-width'))]);

                basicTimeSeries.yScale.value.range(
                    [Number(mainContainer.attr('layout-height')), 0]);

                var components = basicTimeSeries.components.value(
                    basicTimeSeries.xScale.value, basicTimeSeries.yScale.value);
                var g = fc.utilities.simpleDataJoin(plotArea, 'plot-area-component',
                    components, fc.utilities.fn.identity);

                g.selectOrAppend('g')
                    .datum(data)
                    .call(function(selection) {
                        selection.each(function() {
                            var factory = d3.select(this.parentNode)
                                .datum();
                            var component = factory.call(this, xScale, yScale);
                            d3.select(this)
                                .call(component);
                        });
                    });

            });
        };

        basicTimeSeries.decorate = fc.utilities.property(fc.utilities.layout());
        basicTimeSeries.xScale = fc.utilities.property(d3.time.scale());
        basicTimeSeries.yScale = fc.utilities.property(d3.scale.linear());
        basicTimeSeries.components = fc.utilities.functorProperty([]);

        return basicTimeSeries;
    };

})(d3, fc);