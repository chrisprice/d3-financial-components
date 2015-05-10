import d3 from 'd3';

// the barWidth property of the various series takes a function which, when given an
// array of x values, returns a suitable width. This function creates a width which is
// equal to the smallest distance between neighbouring datapoints multiplied
// by the given factor
export default function(fraction) {

    return function(pixelValues) {
        // return some default value if there are not enough datapoints to compute the width
        if (pixelValues.length <= 1) {
            return 10;
        }

        pixelValues.sort();

        // creates a new array as a result of applying the 'fn' function to
        // the consecutive pairs of items in the source array
        function pair(arr, fn) {
            var res = [];
            for (var i = 1; i < arr.length; i++) {
                res.push(fn(arr[i], arr[i - 1]));
            }
            return res;
        }

        // compute the distance between neighbouring items
        var neighbourDistances = pair(pixelValues, function(first, second) {
            return Math.abs(first - second);
        });

        var minDistance = d3.min(neighbourDistances);
        return fraction * minDistance;
    };
}
