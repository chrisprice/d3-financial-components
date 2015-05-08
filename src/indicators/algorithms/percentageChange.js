import property from '../../utilities/property';
import * as fn from '../../utilities/fn';

export default function() {

    var percentageChange = function(data) {

        if (data.length === 0) {
            return [];
        }

        var baseIndex = percentageChange.baseIndex.value(data);
        var baseValue = percentageChange.inputValue.value(data[baseIndex]);

        return data.map(function(d) {
                var result = (percentageChange.inputValue.value(d) - baseValue) / baseValue;
                return percentageChange.outputValue.value(d, result);
            });
    };

    percentageChange.baseIndex = property.functor(0);
    percentageChange.inputValue = property(fn.identity);
    percentageChange.outputValue = property(function(obj, value) { return value; });

    return percentageChange;
}
