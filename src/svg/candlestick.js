import { path as svgPath } from 'd3-path';
import { candlestick as candlestickPath } from 'd3fc-path';

// Renders an OHLC as an SVG path based on the given array of datapoints. Each
// OHLC has a fixed width, whilst the x, open, high, low and close positions are
// obtained from each point via the supplied accessor functions.
export default function() {
    return candlestickPath(svgPath);
}
