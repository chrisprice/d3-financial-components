import d3 from 'd3';
import cssLayout from 'css-layout/src/Layout';
import innerDimensions from '../utilities/innerDimensions';
import property from '../utilities/property';

function factory() {
    // parses the style attribute, converting it into a JavaScript object
    function parseStyle(style) {
        if (!style) {
            return {};
        }
        var properties = style.split(';');
        var json = {};
        properties.forEach(function(property) {
            var components = property.split(':');
            if (components.length === 2) {
                var name = components[0].trim();
                var value = components[1].trim();
                json[name] = isNaN(value) ? value : Number(value);
            }
        });
        return json;
    }

    // creates the structure required by the layout engine
    function createNodes(el) {
        function getChildNodes() {
            var children = [];
            for (var i = 0; i < el.childNodes.length; i++) {
                var child = el.childNodes[i];
                if (child.nodeType === 1) {
                    if (child.getAttribute('layout-css')) {
                        children.push(createNodes(child));
                    }
                }
            }
            return children;
        }
        return {
            style: parseStyle(el.getAttribute('layout-css')),
            children: getChildNodes(el),
            element: el,
            layout: {
                width: undefined,
                height: undefined,
                top: 0,
                left: 0
            }
        };
    }

    // takes the result of layout and applied it to the SVG elements
    function applyLayout(node) {
        node.element.setAttribute('layout-width', node.layout.width);
        node.element.setAttribute('layout-height', node.layout.height);
        if (node.element.nodeName.match(/(?:svg|rect)/i)) {
            node.element.setAttribute('width', node.layout.width);
            node.element.setAttribute('height', node.layout.height);
            node.element.setAttribute('x', node.layout.left);
            node.element.setAttribute('y', node.layout.top);
        } else {
            node.element.setAttribute('transform',
                'translate(' + node.layout.left + ', ' + node.layout.top + ')');
        }
        node.children.forEach(applyLayout);
    }

    var layout = function(selection) {
        selection.each(function(data) {
            var dimensions = innerDimensions(this);
            var width = layout.width.value !== -1 ? layout.width.value : dimensions.width;
            var height = layout.height.value !== -1 ? layout.height.value : dimensions.height;

            // create the layout nodes
            var layoutNodes = createNodes(this);
            // set the width / height of the root
            layoutNodes.style.width = width;
            layoutNodes.style.height = height;

            // use the Facebook CSS goodness
            cssLayout.computeLayout(layoutNodes);

            // apply the resultant layout
            applyLayout(layoutNodes);
        });
    };

    layout.width = property(-1);
    layout.height = property(-1);

    return layout;
}

d3.selection.prototype.layout = function(name, value) {
    var layout = factory();
    var n = arguments.length;
    if (n === 2) {
        if (typeof name !== 'string') {
            // layout(number, number) - sets the width and height and performs layout
            layout.width(name).height(value);
            this.call(layout);
        } else {
            // layout(name, value) - sets a layout- attribute
            this.attr('layout-css', name + ':' + value);
        }
    } else if (n === 1) {
        if (typeof name !== 'string') {
            // layout(object) - sets the layout-css property to the given object
            var styleObject = name;
            var layoutCss = Object.keys(styleObject)
                .map(function(property) {
                    return property + ':' + styleObject[property];
                })
                .join(';');
            this.attr('layout-css', layoutCss);
        } else {
            // layout(name) - returns the value of the layout-name attribute
            return Number(this.attr('layout-' + name));
        }
    } else if (n === 0) {
        // layout() - executes layout
        this.call(layout);
    }
    return this;
};

module.exports = factory;
