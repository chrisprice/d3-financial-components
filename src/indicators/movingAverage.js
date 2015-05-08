import d3 from 'd3';
import line from '../series/line';
import property from '../utilities/property';
import slidingWindow from './algorithms/slidingWindow';

export default function() {

    var algorithm = slidingWindow()
        .accumulator(d3.mean);

    var averageLine = line();

    var movingAverage = function(selection) {

        algorithm.inputValue(movingAverage.yValue.value)
            .outputValue(movingAverage.writeCalculatedValue.value);

        averageLine.xScale(movingAverage.xScale.value)
            .yScale(movingAverage.yScale.value)
            .xValue(movingAverage.xValue.value)
            .yValue(movingAverage.readCalculatedValue.value);

        selection.each(function(data) {
            algorithm(data);

            d3.select(this)
                .call(averageLine);
        });
    };

    movingAverage.xScale = property(d3.time.scale());
    movingAverage.yScale = property(d3.scale.linear());
    movingAverage.yValue = property(function(d) { return d.close; });
    movingAverage.xValue = property(function(d) { return d.date; });
    movingAverage.writeCalculatedValue = property(function(d, value) { d.movingAverage = value; });
    movingAverage.readCalculatedValue = property(function(d) { return d.movingAverage; });

    d3.rebind(movingAverage, algorithm, 'windowSize');

    return movingAverage;
}
