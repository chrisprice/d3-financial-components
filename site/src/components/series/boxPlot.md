---
layout: component
title: Box Plot Series
component: series/boxPlot.js
tags:
  - playground
namespace: series

example-code: |
  //Generating the boxPlot information for the data
  data.forEach(function(d) {
      d.median = 10 + Math.random();
      d.upperQuartile = d.median + Math.random();
      d.lowerQuartile = d.median - Math.random();
      d.high = d.upperQuartile + Math.random();
      d.low = d.lowerQuartile - Math.random();
  });

  yScale.domain(fc.util.extent().pad(0.2).fields(['low', 'high'])(data))

  var boxPlot = fc.series.boxPlot()
      .xScale(xScale)
      .yScale(yScale)
      .value(function(d) { return d.date; })
      .median(function(d) { return d.median; })
      .upperQuartile(function(d) { return d.upperQuartile; })
      .lowerQuartile(function(d) { return d.lowerQuartile; })
      .high(function(d) { return d.high; })
      .low(function(d) { return d.low; });

  container.append('g')
      .datum(data)
      .call(boxPlot);

---

A [box plot series](https://en.wikipedia.org/wiki/Box_plot) is a convenient way of graphically depicting groups of
numerical data through their quartiles. Boxes can be renderer vertically or horizontally based on the value of the `orient` property.

The upper and lower end of each box are defined by the `upperQuartile` and `lowerQuartile` properties.
The upper and lower whisker of each box are defined by the `high` and `low` properties.
The line in the box is defined by the `median` property.
The `barWidth` property specifies the width of the box and `cap` defines the width of the whisker end caps as a fraction of the `barWidth`.

The following example generates a random box plot around each datapoint:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}
