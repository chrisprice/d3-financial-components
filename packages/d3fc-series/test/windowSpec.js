import { scaleLinear } from 'd3-scale';
import * as fc from '../index';

describe('Window adapter', () => {
    let xScale;
    let yScale;
    let series;
    let window;

    beforeEach(() => {
        xScale = scaleLinear()
            .domain([-1, 1]);
        yScale = scaleLinear()
            .domain([-1, 1]);
        series = jasmine.createSpy('series', fc.seriesCanvasMulti());
        window = fc.seriesCanvasWindow()
            .xScale(xScale)
            .yScale(yScale)
            .xAccessors([d => d[0]])
            .yAccessors([d => d[1]])
            .series(series);
    });

    describe('using unsorted data', () => {
        let data;
        beforeEach(() => {
            data = [
                [0, 0],
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0],
                [0, 2],
                [2, 0],
                [0, -2],
                [-2, 0],
                [0, 3],
                [3, 0],
                [0, -3],
                [-3, 0]
            ];
        });
        it('should filter values with no padding', () => {
            window(data);
            expect(series)
                .toHaveBeenCalledWith([
                    [0, 0],
                    [0, 1],
                    [1, 0],
                    [0, -1],
                    [-1, 0]
                ]);
        });

        it('should filter values with padding', () => {
            window.xPadding(0.5)
                .yPadding(-0.5);
            window(data);
            expect(series)
                .toHaveBeenCalledWith([
                    [0, 0],
                    [1, 0],
                    [-1, 0],
                    [2, 0],
                    [-2, 0]
                ]);
        });
    });

    describe('using horizontally ascending data', () => {
        let data;
        beforeEach(() => {
            window.bisect('horizontal');
            data = [
                [-3, 0],
                [-2, 0],
                [-1, 0],
                [0, -1],
                [0, 0],
                [0, 2],
                [0, 1],
                [0, -2],
                [0, -3],
                [0, 3],
                [1, 0],
                [2, 0],
                [3, 0]
            ];
        });

        it('should filter values with no padding', () => {
            window(data);
            expect(series)
                .toHaveBeenCalledWith([
                    [-2, 0],
                    [-1, 0],
                    [0, -1],
                    [0, 0],
                    [0, 1],
                    [1, 0],
                    [2, 0]
                ]);
        });

        it('should filter values with padding', () => {
            window.xPadding(0.5)
                .yPadding(-0.5);
            window(data);
            expect(series)
                .toHaveBeenCalledWith([
                    [-3, 0],
                    [-2, 0],
                    [-1, 0],
                    [0, 0],
                    [1, 0],
                    [2, 0],
                    [3, 0]
                ]);
        });
    });

    describe('using vertically ascending data', () => {
        let data;
        beforeEach(() => {
            window.bisect('vertical');
            data = [
                [0, -3],
                [0, -2],
                [0, -1],
                [2, 0],
                [-1, 0],
                [1, 0],
                [3, 0],
                [0, 0],
                [-2, 0],
                [-3, 0],
                [0, 1],
                [0, 2],
                [0, 3]
            ];
        });

        it('should filter values with no padding', () => {
            window(data);
            expect(series)
                .toHaveBeenCalledWith([
                    [0, -2],
                    [0, -1],
                    [-1, 0],
                    [1, 0],
                    [0, 0],
                    [0, 1],
                    [0, 2]
                ]);
        });

        it('should filter values with padding', () => {
            window.xPadding(0.5)
                .yPadding(-0.5);
            window(data);
            expect(series)
                .toHaveBeenCalledWith([
                    [0, -1],
                    [2, 0],
                    [-1, 0]
                ]);
        });
    });
});
