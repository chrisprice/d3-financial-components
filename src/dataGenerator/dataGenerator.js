import d3 from 'd3';
import property from '../utilities/property';

export default function() {

    var calculateOHLC = function(days, prices, volumes) {
        var ohlcv = [],
            daySteps,
            currentStep = 0,
            currentIntraStep = 0,
            stepsPerDay = gen.stepsPerDay.value;

        while (ohlcv.length < days) {
            daySteps = prices.slice(currentIntraStep, currentIntraStep + stepsPerDay);
            ohlcv.push({
                date: new Date(gen.startDate.value.getTime()),
                open: daySteps[0],
                high: Math.max.apply({}, daySteps),
                low: Math.min.apply({}, daySteps),
                close: daySteps[stepsPerDay - 1],
                volume: volumes[currentStep]
            });
            currentIntraStep += stepsPerDay;
            currentStep += 1;
            gen.startDate.value.setUTCDate(gen.startDate.value.getUTCDate() + 1);
        }
        return ohlcv;
    };

    var gen = function(days) {
        var toDate = new Date(gen.startDate.value.getTime());
        toDate.setUTCDate(gen.startDate.value.getUTCDate() + days);

        var millisecondsPerYear = 3.15569e10,
            years = (toDate.getTime() - gen.startDate.value.getTime()) / millisecondsPerYear;

        var prices = randomWalk(
            years,
            days * gen.stepsPerDay.value,
            gen.mu.value,
            gen.sigma.value,
            gen.startPrice.value
        );
        var volumes = randomWalk(
            years,
            days,
            0,
            gen.sigma.value,
            gen.startVolume.value
        );

        // Add random noise
        volumes = volumes.map(function(vol) {
            var boundedNoiseFactor = Math.min(0, Math.max(gen.volumeNoiseFactor.value, 1));
            var multiplier = 1 + (boundedNoiseFactor * (1 - 2 * Math.random()));
            return Math.floor(vol * multiplier);
        });

        // Save the new start values
        gen.startPrice.value = prices[prices.length - 1];
        gen.startVolume.value = volumes[volumes.length - 1];

        return calculateOHLC(days, prices, volumes).filter(function(d) {
            return !gen.filter.value || gen.filter.value(d.date);
        });
    };

    var randomWalk = function(period, steps, mu, sigma, initial) {
        var randomNormal = d3.random.normal(),
            timeStep = period / steps,
            increments = new Array(steps + 1),
            increment,
            step;

        // Compute step increments for the discretized GBM model.
        for (step = 1; step < increments.length; step += 1) {
            increment = randomNormal();
            increment *= Math.sqrt(timeStep);
            increment *= sigma;
            increment += (mu - ((sigma * sigma) / 2)) * timeStep;
            increments[step] = Math.exp(increment);
        }
        // Return the cumulative product of increments from initial value.
        increments[0] = initial;
        for (step = 1; step < increments.length; step += 1) {
            increments[step] = increments[step - 1] * increments[step];
        }
        return increments;
    };

    gen.mu = property(0.1);
    gen.sigma = property(0.1);
    gen.startPrice = property(100);
    gen.startVolume = property(100000);
    gen.startDate = property(new Date());
    gen.stepsPerDay = property(50);
    gen.volumeNoiseFactor = property(0.3);
    gen.filter = property(function(date) {
        return !(date.getDay() === 0 || date.getDay() === 6);
    });

    return gen;
}
