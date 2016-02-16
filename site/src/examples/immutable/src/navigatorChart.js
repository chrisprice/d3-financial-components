function navigatorChart(options) {
    options = options || Immutable.Map({
    // dateDomain: [new Date()-1, new Date()]
    });

    var xScale = fc.scale.dateTime()
        .range([0, 500]);

    var xExtent = fc.util.extent()
        .fields(['date']);

    var yScale = d3.scale.linear()
        .range([50, 0]);

    var yExtent = fc.util.extent()
        .fields(['close']);

    var dataJoin = fc.util.dataJoin()
        .children(true);

    var area = fc.series.area()
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.close; })
        .xScale(xScale)
        .yScale(yScale);

    function component(selection) {

        selection.each(function(data) {

            console.log('navigatorChart', Date.now());

            data = data.toArray(); // <- Convert back from Immutable structure for compatability

            xScale.domain(xExtent(data));

            yScale.domain(yExtent(data));

            dataJoin(this, [data])
                .call(area);
        });
    }

  // component.dateDomain = function(x) {
  //   if (!arguments.length) {
  //     return options.get('dateDomain');
  //   }
  //   var updatedOptions = options.set('dateDomain', x);
  //   return options === updatedOptions ?
  //     component : mainChart(updatedOptions);
  // };

    return component;
}
