// var width = 500;
// var height = 250;
// var container = d3.select('#cache-canvas');

// var dataGenerator = fc.randomFinancial();
// var data = dataGenerator(1e4);

// var xScale = d3.scaleTime()
//     .domain(fc.extentDate().accessors([d => d.date])(data.slice(100, 200)))
//     .range([0, width]);

// var yScale = d3.scaleLinear()
//     .domain(fc.extentLinear().accessors([d => d.high, d => d.low])(data.slice(100, 200)))
//     .range([height, 0]);

// var canvas = d3.select('#cache-canvas');
// var ctx = canvas.node().getContext('2d');

// var canvasCandlestick = fc.seriesCanvasCandlestick()
//     .defined(d => d != null);

// var canvasCache = fc.seriesCanvasCache()
//     .series(canvasCandlestick)
//     .xScale(xScale)
//     .yScale(yScale)
//     .context(ctx);

// canvasCache(data);

// var xExtent = fc.extentDate().accessors([d => d.date])(data);
// var yExtent = fc.extentDate().accessors([d => d.high, d => d.low])(data);

// var zoom = d3.zoom()
//     .scaleExtent([0.01, 100])
//     .translateExtent([
//         [xScale(xExtent[0]), yScale(yExtent[1])],
//         [xScale(xExtent[1]), yScale(yExtent[0])]
//     ])
//     .on("zoom", () => {
//         canvasCache.previousXScale(canvasCache.xScale())
//             .previousYScale(canvasCache.yScale())
//             .xScale(d3.event.transform.rescaleX(xScale))
//             .yScale(d3.event.transform.rescaleY(yScale))
//             .xAccessors([d => d.date])
//             .yAccessors([d => d.high, d => d.low]);

//         canvasCache(data);
//     });

// canvas.call(zoom);
