import { path as svgPath } from 'd3-path';
import { bar as barPath } from 'd3fc-shape';

// Renders an OHLC as an SVG path based on the given array of datapoints. Each
// OHLC has a fixed width, whilst the x, open, high, low and close positions are
// obtained from each point via the supplied accessor functions.
export default function() {
    return barPath(svgPath);
}
