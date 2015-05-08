import d3 from 'd3';
import property from '../../utilities/property';
import slidingWindowAlgorithm from './slidingWindow';

export default function() {

    var slidingWindow = slidingWindowAlgorithm()
        .accumulator(function(values) {
            var avg = d3.mean(values);
            var stdDev = d3.deviation(values);
            var multiplier = bollingerBands.multiplier.value.apply(this, arguments);
            return {
                upper: avg + multiplier * stdDev,
                average: avg,
                lower: avg - multiplier * stdDev
            };
        });

    var bollingerBands = function(data) {
        return slidingWindow(data);
    };

    bollingerBands.multiplier = property.functor(2);

    d3.rebind(bollingerBands, slidingWindow, 'windowSize', 'inputValue', 'outputValue');

    return bollingerBands;
}
