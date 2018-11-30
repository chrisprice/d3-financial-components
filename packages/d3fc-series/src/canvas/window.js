/*

scale cache strategy -
  default to caching on selection (context.canvas)
  inspired by same problem faced by axes
windowing orientation -
  controls which scale is compared
  inspired by series
accessors -
  array of value accessors
  inspired by extent
padding -
  negative values extend into the range
  units of pixels? Most d3 stuff defaults to percent
  inspired by extent's pad & d3 band scale
proxy -
  could accept nested series in contructor and generate proxy methods
  would allow accessors to be auto-generated for simple cases but not exhaustively (e.g. highValue)

sorted in x (asc/desc)
sorted in y (asc/desc)
un-sorted
line - so padding isn't going to work for connecting to offscreen points
bar - so need to consider partial/full overlap

bisect(['horizontal', 'vertical', 'none']) implicitly includes one out of bounds value for horizontal/vertical.
xPadding
yPadding

maintain index if case of 'none', otherwise unmaintained
bisection is performed in domain co-ordinates

assumes ascending orer
test for empty/single point
*/

import { scaleIdentity } from 'd3-scale';
import { bisector } from 'd3-array';
import seriesMulti from './multi';

const calculatePaddedRange = (scale, padding) => {
    const range = scale.range();
    const min = Math.min(range[0], range[1]);
    const max = Math.max(range[0], range[1]);
    const rangePadding = (max - min) * padding;
    return [
        min - rangePadding,
        max + rangePadding
    ];
};

const unsortedFilter = (scale, padding, accessors) => {
    const [min, max] = calculatePaddedRange(scale, padding);
    return data => data.filter((d, i) => {
        let smallerThanMin = false;
        let largerThanMax = false;
        for (let j = 0; j < accessors.length; j++) {
            const value = scale(accessors[j](d, i));
            if (value < min) {
                if (largerThanMax) {
                    return true;
                }
                smallerThanMin = true;
                continue;
            }
            if (value > max) {
                if (smallerThanMin) {
                    return true;
                }
                largerThanMax = true;
                continue;
            }
            return true;
        }
        return false;
    });
};

const sortedFilter = (scale, padding, accessors) => {
    const [min, max] = calculatePaddedRange(scale, padding);
    if (accessors.length !== 1) {
        throw new Error('A single accessor must be specified for the bisect dimension');
    }
    const accessor = accessors[0];
    const indexBisector = bisector(d => scale(accessor(d)));
    return data => {
        const minIndex = indexBisector.left(data, min) - 1;
        const maxIndex = indexBisector.left(data, max) + 2;
        return data.slice(
            Math.max(minIndex, 0),
            Math.min(maxIndex, data.length)
        );
    };
};

const getFilter = (bisect, padding, scale, accessors) => {
    if (padding === Number.POSITIVE_INFINITY) {
        return data => data;
    }
    if (bisect) {
        return sortedFilter(scale, padding, accessors);
    }
    return unsortedFilter(scale, padding, accessors);
};

export default () => {
    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let series = seriesMulti();
    let context = null;
    let xAccessors = [d => d.x];
    let yAccessors = [d => d.y];
    let xPadding = 0;
    let yPadding = 0;
    let bisect = 'none';

    const window = (data) => {
        const xFilter = getFilter(bisect === 'horizontal', xPadding, xScale, xAccessors);
        const yFilter = getFilter(bisect === 'vertical', yPadding, yScale, yAccessors);

        const filteredData = xFilter(yFilter(data));

        series.context(context)
            .xScale(xScale)
            .yScale(yScale);

        series(filteredData);
    };

    window.series = (...args) => {
        if (!args.length) {
            return series;
        }
        series = args[0];
        return window;
    };
    window.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
        return window;
    };
    window.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return window;
    };
    window.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return window;
    };
    window.xAccessors = (...args) => {
        if (!args.length) {
            return xAccessors;
        }
        xAccessors = args[0];
        return window;
    };
    window.yAccessors = (...args) => {
        if (!args.length) {
            return yAccessors;
        }
        yAccessors = args[0];
        return window;
    };
    window.xPadding = (...args) => {
        if (!args.length) {
            return xPadding;
        }
        xPadding = args[0];
        return window;
    };
    window.yPadding = (...args) => {
        if (!args.length) {
            return yPadding;
        }
        yPadding = args[0];
        return window;
    };
    window.bisect = (...args) => {
        if (!args.length) {
            return bisect;
        }
        bisect = args[0];
        return window;
    };

    return window;
};
