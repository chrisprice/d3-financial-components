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

    fc.utilities.isolate.link = function(selectionTarget, selectionSource) {

        fc.utilities.isolate(selectionSource);
        fc.utilities.isolate(selectionTarget);

        var source = selectionSource.node();
        selectionTarget.each(function() {
            this.__isolated__ = source.__isolated__;
            this.__data__ = this.__isolated__;
        });

    };

})(d3, fc);