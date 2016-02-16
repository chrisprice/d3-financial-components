var chartRecord = Immutable.Record({
    dateDomain: [new Date() - 1, new Date()],
    mainDataJoin: fc.util.dataJoin()
        .selector('.main')
        .children(true)
        .attr('class', 'main'),
    mainChart: mainChart(),
    navigatorDataJoin: fc.util.dataJoin()
        .selector('.navigator')
        .children(true)
        .attr({
            'class': 'navigator',
            'transform': 'translate(0, 200)'
        }),
    navigatorChart: navigatorChart()
});

function chart(options) {
    options = chartRecord(options);

    function component(selection) {

        selection.each(function(data) {

            console.log('chart', Date.now());

            // This could be wrapped up in a rebind-esque method
            options = options.update('mainChart', function(x) {
                return x.dateDomain(options.dateDomain);
            });

            options.mainDataJoin(this, [data]) // <--Not wrapped in Immutable
                .call(options.mainChart);

            options.navigatorDataJoin(this, [data])
                .call(options.navigatorChart);
        });
    }

    component.dateDomain = function(x) {
        if (!arguments.length) {
            return options.get('dateDomain');
        }
        var updatedOptions = options.set('dateDomain', x);
        return options === updatedOptions ?
            component : chart(updatedOptions);
    };

    return component;
}
