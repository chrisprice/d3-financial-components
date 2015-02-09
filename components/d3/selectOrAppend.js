(function(d3, fc) {
    'use strict';

    d3.selection.prototype.selectOrAppend = function(elementName, className) {
        // TODO: How does this work if this contains 1 item,
        // then on subsequent invocations this contains 2 items
        var selector = className == null ? elementName : elementName + '.' + className;
        var selection = this.select(selector);
        if (selection.empty()) {
            selection = this.append(elementName);
            if (className != null) {
                selection.attr('class', className);
            }
        }
        return selection;
    };

}(d3, fc));