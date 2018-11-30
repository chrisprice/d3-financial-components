var width = 500;
var height = 250;
var container = d3.select('#window-svg');

var dataGenerator = fc.randomFinancial();
var data = dataGenerator(1e4);

var xScale = d3.scaleTime()
    .domain(fc.extentDate().accessors([d => d.date])(data.slice(0, 200)))
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear().accessors([d => d.high, d => d.low])(data.slice(100, 200)))
    .range([height, 0]);

var svgCandlestick = fc.seriesSvgCandlestick()
    .xScale(xScale)
    .yScale(yScale);

var svgWindow = svgCandlestick;
// var svgWindow = fc.seriesWindow()
//     .series(svgCandlestick)
//     .xScale(xScale)
//     .yScale(yScale)
//     .xAccessors([d => d.date])
//     .yAccessors([d => d.high, d => d.low]);

container.append('g')
    .datum(data);
    // .call(svgWindow);

var canvas = d3.select('#window-canvas');
var ctx = canvas.node().getContext('2d');

var canvasCandlestick = fc.seriesCanvasCandlestick()
    .defined(d => d != null);

var canvasWindow = fc.seriesCanvasWindow()
    .series(canvasCandlestick)
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx)
    .xAccessors([d => d.date])
    .yAccessors([d => d.high, d => d.low])
    .bisect('horizontal');

canvasWindow(data);

var xExtent = fc.extentDate().accessors([d => d.date])(data);
var yExtent = fc.extentDate().accessors([d => d.high, d => d.low])(data);

var zoom = d3.zoom()
    .scaleExtent([0.01, 100])
    .translateExtent([
        [xScale(xExtent[0]), yScale(yExtent[1])],
        [xScale(xExtent[1]), yScale(yExtent[0])]
    ])
    .on('zoom', () => {
        var rescaledX = d3.event.transform.rescaleX(xScale);
        var rescaledY = d3.event.transform.rescaleY(yScale);

        svgWindow.xScale(rescaledX)
            .yScale(rescaledY);

        container.select('g')
            .datum(data);
            // .call(svgWindow);

        canvasWindow.xScale(rescaledX)
            .yScale(rescaledY);

        ctx.clearRect(0, 0, width, height);
        canvasWindow(data);
    });

canvas.call(zoom);
