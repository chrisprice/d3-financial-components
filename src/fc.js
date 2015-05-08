import * as dateTime from './scale/dateTime';
import * as fn from './utilities/fn';

dateTime.default.tickTransformer = dateTime.tickTransformer;

module.exports = {
    version: '0.0.0',
    charts: {
        linearTimeSeries: require('./charts/linearTimeSeries'),
        sparkline: require('./charts/sparkline')
    },
    dataGenerator: require('./dataGenerator/dataGenerator'),
    indicators: {
        algorithms: {
            bollingerBands: require('./indicators/algorithms/bollingerBands'),
            percentageChange: require('./indicators/algorithms/percentageChange'),
            relativeStrengthIndicator: require('./indicators/algorithms/relativeStrengthIndicator'),
            slidingWindow: require('./indicators/algorithms/slidingWindow')
        },
        bollingerBands: require('./indicators/bollingerBands'),
        movingAverage: require('./indicators/movingAverage'),
        relativeStrengthIndicator: require('./indicators/relativeStrengthIndex')
    },
    layout: require('./layout/layout'),
    scale: {
        discontinuity: {
            identity: require('./scale/discontinuity/identity'),
            skipWeekends: require('./scale/discontinuity/skipWeekends')
        },
        dateTime: dateTime.default,
        gridlines: require('./scale/gridlines')
    },
    series: {
        area: require('./series/area'),
        bar: require('./series/bar'),
        candlestick: require('./series/candlestick'),
        line: require('./series/line'),
        multi: require('./series/multi'),
        ohlc: require('./series/ohlc'),
        point: require('./series/point'),
        stackedBar: require('./series/stackedBar')
    },
    tools: {
        annotation: require('./tools/annotation'),
        crosshairs: require('./tools/crosshairs'),
        fibonacciFan: require('./tools/fibonacciFan'),
        measure: require('./tools/measure')
    },
    utilities: {
        extent: require('./utilities/extent'),
        fn: fn,
        fractionalBarWidth: require('./utilities/fractionalBarWidth'),
        functorProperty: require('./utilities/property').functor,
        pointSnap: require('./utilities/pointSnap'),
        seriesPointSnap: require('./utilities/pointSnap').series,
        simpleDataJoin: require('./utilities/simpleDataJoin'),
        property: require('./utilities/property'),
        rebind: require('./utilities/rebind')
    }
};