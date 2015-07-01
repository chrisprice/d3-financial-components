---
layout: component
title: Line Annotation
component: tool/line.js
tags:
namespace: annotation

example-code: |
  var lineAnnotation = fc.annotation.line()
      .xScale(xScale)
      .yScale(yScale);

  // create an array that contains the highest, lowest and most recent price
  var priceMarkers = [
    data[data.length - 1].close,
    d3.min(data, function(d) { return d.high; }),
    d3.max(data, function(d) { return d.low; })
  ]

  container.append('g')
      .datum(priceMarkers)
      .call(lineAnnotation);
---

This component renders horizontal or vertical line annotations. The following example takes a series, and plots its min, max and latest values as annotations:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}

You can configure the value used to locate the annotation via the `value` property, the text that is rendered via the `label` property and create horizontal annotations by setting `orient('vertical')`. The annotations are also extensible via the `decorate` property, with 'container' elements being placed at either end for the easy addition of extra elements.


