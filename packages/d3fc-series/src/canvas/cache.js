// /*
// scale cache strategy -
//   default to caching on selection (context.canvas)
//   inspired by same problem faced by axes
// windowing orientation -
//   controls which scale is compared
//   inspired by series
// accessors -
//   array of value accessors
//   inspired by extent
// padding -
//   negative values extend into the range
//   units of pixels? Most d3 stuff defaults to percent
//   inspired by extent's pad & d3 band scale
// proxy -
//   could accept nested series in contructor and generate proxy methods
//   would allow accessors to be auto-generated for simple cases but not exhaustively (e.g. highValue)
// */
// let scaleStore = (...args) => {
//     if (!args.length) {
//         return context.canvas.__scales__;
//     }
//     context.canvas.__scales__ = args;
// };
// const previousScales = scaleStore();
// if (previousScales == null) {
//     series(data);
//     return;
// }
// const [previousXScale, previousYScale] = previousScales;
// window.scaleStore = (...args) => {
//     if (!args.length) {
//         return scaleStore;
//     }
//     scaleStore = args[0];
//     return window;
// };
// import { scaleIdentity } from 'd3-scale';
// import seriesMulti from './multi';
// const calculateBBox = (domain, scale) => {
//     const [start, end] = domain.map(scale);
//     const invert = start > end;
//     return {
//         start: invert ? end : start,
//         end: invert ? start : end,
//         length: invert ? start - end : end - start,
//         invert
//     };
// };
// const inRange = (range, value, padding = 0) => {
//     const min = Math.min(range[0], range[1]);
//     const max = Math.max(range[0], range[1]);
//     const size = max - min;
//     return value >= min - size * padding &&
//         value <= max + size * padding;
// };
// export default () => {
//     let xScale = scaleIdentity();
//     let yScale = scaleIdentity();
//     let previousXScale = null;
//     let previousYScale = null;
//     let series = seriesMulti();
//     let context = null;
//     let tempCanvas = null;
//     let xAccessors = [];
//     let yAccessors = [];
//     const cache = (data) => {
//         series.context(context)
//             .xScale(xScale)
//             .yScale(yScale);
//         if (previousXScale == null || previousYScale == null) {
//             series(data);
//             return;
//         }
//         const sx = calculateBBox(previousXScale.domain(), previousXScale);
//         const dx = calculateBBox(previousXScale.domain(), xScale);
//         const sy = calculateBBox(previousYScale.domain(), previousYScale);
//         const dy = calculateBBox(previousYScale.domain(), yScale);
//         if (tempCanvas == null) {
//             tempCanvas = context.canvas.ownerDocument.createElement('canvas');
//             document.body.appendChild(tempCanvas);
//         }
//         tempCanvas.width = sx.length;
//         tempCanvas.height = sy.length;
//         const tempContext = tempCanvas.getContext('2d');
//         tempContext.drawImage(
//             context.canvas,
//             -sx.start,
//             -sy.start,
//             sx.length,
//             sy.length,
//             0,
//             0,
//             sx.length,
//             sy.length
//         );
//         context.clearRect(sx.start, sy.start, sx.length, sy.length);
//         context.drawImage(tempCanvas, dx.start, dy.start, dx.length, dy.length);
//         const filteredData = data.map((d, i) => {
//             for (let i = 0; i < xAccessors.length; i++) {
//                 const accessor = xAccessors[i];
//                 const value = accessor(d, i);
//                 if (inRange(previousXScale.range(), previousXScale(value), -0.1)) {
//                     continue;
//                 }
//                 if (!inRange(xScale.range(), xScale(value)), 0) {
//                     continue;
//                 }
//                 return d;
//             }
//             for (let i = 0; i < yAccessors.length; i++) {
//                 const accessor = yAccessors[i];
//                 const value = accessor(d, i);
//                 if (inRange(previousYScale.range(), previousYScale(value), -0.2)) {
//                     continue;
//                 }
//                 if (!inRange(yScale.range(), yScale(value)), 0) {
//                     continue;
//                 }
//                 return d;
//             }
//             return null;
//         });
//         series(filteredData);
//     };
//     cache.series = (...args) => {
//         if (!args.length) {
//             return series;
//         }
//         series = args[0];
//         return cache;
//     };
//     cache.context = (...args) => {
//         if (!args.length) {
//             return context;
//         }
//         context = args[0];
//         return cache;
//     };
//     cache.xScale = (...args) => {
//         if (!args.length) {
//             return xScale;
//         }
//         xScale = args[0];
//         return cache;
//     };
//     cache.yScale = (...args) => {
//         if (!args.length) {
//             return yScale;
//         }
//         yScale = args[0];
//         return cache;
//     };
//     cache.xAccessors = (...args) => {
//         if (!args.length) {
//             return xAccessors;
//         }
//         xAccessors = args[0];
//         return cache;
//     };
//     cache.yAccessors = (...args) => {
//         if (!args.length) {
//             return yAccessors;
//         }
//         yAccessors = args[0];
//         return cache;
//     };
//     cache.previousXScale = (...args) => {
//         if (!args.length) {
//             return previousXScale;
//         }
//         previousXScale = args[0];
//         return cache;
//     };
//     cache.previousYScale = (...args) => {
//         if (!args.length) {
//             return previousYScale;
//         }
//         previousYScale = args[0];
//         return cache;
//     };
//     return cache;
// };
