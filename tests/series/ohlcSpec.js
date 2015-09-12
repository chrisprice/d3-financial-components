import d3 from 'd3';
import fc from '../..';

describe('ohlc', function() {

    it('should invoke data accessors with datum and index', function() {

        var xValueSpy = jasmine.createSpy('xValue').and.callFake(fc.util.fn.identity),
            yOpenValueSpy = jasmine.createSpy('yOpenValue').and.callFake(fc.util.fn.identity),
            yHighValueSpy = jasmine.createSpy('yHighValue').and.callFake(fc.util.fn.identity),
            yLowValueSpy = jasmine.createSpy('yLowValue').and.callFake(fc.util.fn.identity),
            yCloseValueSpy = jasmine.createSpy('yCloseValue').and.callFake(fc.util.fn.identity);

        var ohlc = fc.series.ohlc()
            .xValue(xValueSpy)
            .yOpenValue(yOpenValueSpy)
            .yHighValue(yHighValueSpy)
            .yLowValue(yLowValueSpy)
            .yCloseValue(yCloseValueSpy);

        var element = document.createElement('svg'),
            container = d3.select(element),
            data = [0.2, 2.4, 4.3, 8.2, 16.3];

        container.datum(data)
            .call(ohlc);

        // the data join and the bar width calculations also invoke
        // the x value accessor, therefore it is invoked multiple times
        // for each data point

        expect(xValueSpy.calls.count()).toEqual(data.length * 2);
        this.utils.verifyAccessorCalls(xValueSpy, data);

        expect(yOpenValueSpy.calls.count()).toEqual(data.length);
        this.utils.verifyAccessorCalls(yOpenValueSpy, data);

        expect(yHighValueSpy.calls.count()).toEqual(data.length);
        this.utils.verifyAccessorCalls(yHighValueSpy, data);

        expect(yLowValueSpy.calls.count()).toEqual(data.length);
        this.utils.verifyAccessorCalls(yLowValueSpy, data);

        expect(yCloseValueSpy.calls.count()).toEqual(data.length);
        this.utils.verifyAccessorCalls(yCloseValueSpy, data);
    });
});
