(function(d3, fc) {
    'use strict';

    fc.tool.brush = function() {

        var event = d3.dispatch('brushstart', 'brushmove', 'brushend'),
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            decorate = fc.util.fn.noop;

        var dataJoin = fc.util.dataJoin()
            .children(true)
            .selector('g.brush')
            .element('g')
            .attrs({'class': 'brush'});

        var brush = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var g = dataJoin(container, data);

                g.each(function(datum) {

                    var d3Brush = d3.svg.brush()
                        .x(xScale) // allow customisation
                        .y(yScale)
                        // .on('brushstart', function() {
                        //     data.push(d3Brush.extent());
                        //     container.call(brush);
                        //     event.brushstart.apply(this.parentNode, arguments);
                        // })
                        .on('brush', function() {
                            data[data.length - 1] = d3Brush.extent();
                            container.call(brush);
                            event.brushmove.apply(this.parentNode, arguments);
                        })
                        // .on('brushend', function() {
                        //     data.pop();
                        //     container.call(brush);
                        //     event.brushend.apply(this.parentNode, arguments);
                        // })
                        .extent(datum);

                    d3.select(this)
                        .call(d3Brush);
                });

                decorate(g);
            });
        };

        brush.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return brush;
        };
        brush.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return brush;
        };
        brush.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return brush;
        };

        d3.rebind(brush, event, 'on');

        return brush;
    };

}(d3, fc));
