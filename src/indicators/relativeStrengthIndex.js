import d3 from 'd3';
import annotation from '../tools/annotation';
import line from '../series/line';
import property from '../utilities/property';
import relativeStrengthIndicatorAlgorithm from './algorithms/relativeStrengthIndicator';

export default function() {

    var algorithm = relativeStrengthIndicatorAlgorithm();
    var annotations = annotation();
    var rsiLine = line();

    var rsi = function(selection) {

        algorithm.outputValue(rsi.writeCalculatedValue.value);

        annotations.xScale(rsi.xScale.value)
            .yScale(rsi.yScale.value);

        rsiLine.xScale(rsi.xScale.value)
            .yScale(rsi.yScale.value)
            .xValue(rsi.xValue.value)
            .yValue(rsi.readCalculatedValue.value);

        selection.each(function(data) {
            algorithm(data);

            var container = d3.select(this);

            var annotationsContainer = container.selectAll('g.annotations')
                .data([[
                    rsi.upperValue.value.apply(this, arguments),
                    50,
                    rsi.lowerValue.value.apply(this, arguments)
                ]]);

            annotationsContainer.enter()
                .append('g')
                .attr('class', 'annotations');

            annotationsContainer.call(annotations);

            var rsiLineContainer = container.selectAll('g.indicator')
                .data([data]);

            rsiLineContainer.enter()
                .append('g')
                .attr('class', 'indicator');

            rsiLineContainer.call(rsiLine);
        });
    };

    rsi.xScale = property(d3.time.scale());
    rsi.yScale = property(d3.scale.linear());
    rsi.xValue = property(function(d) { return d.date; });
    rsi.writeCalculatedValue = property(function(d, value) { d.rsi = value; });
    rsi.readCalculatedValue = property(function(d) { return d.rsi; });
    rsi.upperValue = property.functor(70);
    rsi.lowerValue = property.functor(30);

    d3.rebind(rsi, algorithm, 'openValue', 'closeValue', 'windowSize');

    return rsi;
}
