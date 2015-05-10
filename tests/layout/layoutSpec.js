/* global fc, d3 */
(function(d3, fc) {
    'use strict';

    describe('layout', function() {

        it('should allow attributes to be set as name / value pairs', function() {
            var svg = window.document.createElement('svg');

            d3.select(svg).layout('height', 30);
            expect(svg.getAttribute('layout-css')).toEqual('height:30');

            d3.select(svg).layout('flexDirection', 'row');
            expect(svg.getAttribute('layout-css')).toEqual('flexDirection:row');
        });

        it('should allow attributes to be set as an object', function() {
            var svg = window.document.createElement('svg');
            d3.select(svg).layout({'height': 30, 'flexDirection': 'row'});
            expect(svg.getAttribute('layout-css')).toEqual('height:30;flexDirection:row');
        });

        it('should provide access to layout- prefixed properties', function() {
            var svg = window.document.createElement('svg');
            svg.setAttribute('layout-width', '30');
            expect(d3.select(svg).layout('width')).toEqual(30);
        });

        it('should permit layout with an explicit width / height', function() {
            var div = document.createElement('div');
            var svgElement = document.createElement('svg');
            div.appendChild(svgElement);
            document.body.appendChild(div);

            var svg = d3.select(svgElement)
                .layout('justifyContent', 'flex-end');

            var row1 = svg.append('g')
                .layout('flex', 1);

            var row2 = svg.append('g')
                .layout('flex', 2);

            svg.layout(800, 300);

            expect(row1.layout('height')).toEqual(100);
            expect(row2.layout('height')).toEqual(200);
        });

        it('should set the width and height attributes of the svg element', function() {
            var div = document.createElement('div');
            var svgElement = document.createElement('svg');
            div.appendChild(svgElement);
            document.body.appendChild(div);

            var svg = d3.select(svgElement);

            svg.layout(800, 300);

            expect(svgElement.getAttribute('width')).toEqual('800');
            expect(svgElement.getAttribute('height')).toEqual('300');
        });

        it('should set the width / height of rect elements', function() {
            var div = document.createElement('div');
            var svgElement = document.createElement('svg');
            div.appendChild(svgElement);
            document.body.appendChild(div);

            var svg = d3.select(svgElement)
                .layout('justifyContent', 'flex-end');

            var rect = svg.append('rect')
                .layout('flex', 1);

            svg.layout(800, 300);

            expect(rect.node().getAttribute('width')).toEqual('800');
            expect(rect.node().getAttribute('height')).toEqual('300');
        });


    });
}(d3, fc));