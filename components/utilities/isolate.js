(function(d3, fc) {
    'use strict';

    fc.utilities.isolate = function(selection) {
        selection.each(function() {
            if (!this.__isolated__) {
                this.__isolated__ = [];
            }
            this.__data__ = this.__isolated__;
        });
    };

})(d3, fc);