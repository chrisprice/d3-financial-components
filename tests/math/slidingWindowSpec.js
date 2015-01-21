(function(d3, fc) {
    'use strict';

    describe('slidingWindow', function() {

        it('should not call calculate for an empty data array', function() {
            var slidingWindow = fc.math.slidingWindow()
                .calculate(function() { throw new Error('FAIL'); })
                .size(2);
            expect(slidingWindow([])).toEqual([]);
        });

        it('should not call calculate for a data array smaller than the window size', function() {
            var slidingWindow = fc.math.slidingWindow()
                .calculate(function() { throw new Error('FAIL'); })
                .size(2);
            expect(slidingWindow([0])).toEqual([]);
        });

        it('should call calculate once for a data array equal in length to the window size', function() {
            var data = [0, 1];
            var calculatedValue = {};

            var slidingWindow = fc.math.slidingWindow()
                .calculate(function(d) {
                    expect(d).toEqual(data);
                    return calculatedValue;
                })
                .size(2);
            expect(slidingWindow(data)).toEqual([calculatedValue]);
        });

        it('should call calculate multiple times for data arrays longer than window size', function() {
            var data = [0, 1, 2];
            var calculatedValue = {};

            var slidingWindow = fc.math.slidingWindow()
                .calculate(function(d) { // SPY
                    expect(d).toEqual(data);
                    return calculatedValue;
                })
                .size(2);
            expect(slidingWindow(data)).toEqual([calculatedValue, calculatedValue]);
        });
    });

}(d3, fc));