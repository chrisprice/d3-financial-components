(function(d3, fc) {
    'use strict';

    describe('fc.layout.dot', function() {

        function createNodesFrom(tuples) {
            var nodes = {};
            tuples.forEach(function(tuple) {
                var tailId = tuple[0];
                var tail = nodes[tailId];
                if (!tail) {
                    tail = nodes[tailId] = {
                        id: tailId,
                        in: [],
                        out: []
                    };
                }
                var headId = tuple[1];
                var head = nodes[headId];
                if (!head) {
                    head = nodes[headId] = {
                        id: headId,
                        in: [],
                        out: []
                    };
                }
                var edge = {
                    tail: tail,
                    head: head,
                    weight: 1
                };
                tail.out.push(edge);
                head.in.push(edge);
            });
            return Object.keys(nodes)
                .map(function(id) {
                    return nodes[id];
                });
        }

        describe('rank', function() {

            describe('feasibleTree', function() {

                var dot, nodes;

                beforeEach(function() {
                    dot = fc.layout.dot();
                    // Figure 2-3
                    nodes = createNodesFrom([
                        ['a', 'b'],
                        ['b', 'c'],
                        ['c', 'd'],
                        ['d', 'h'],
                        ['a', 'e'],
                        ['a', 'f'],
                        ['e', 'g'],
                        ['f', 'g'],
                        ['g', 'h']
                    ]);
                    function toHave(projection) {
                        return function(util, customEqualityTesters) {
                            return {
                                compare: function(actual, expected) {
                                    var projectedActual = actual.reduce(function(o, n) {
                                        o[n.id] = projection(n);
                                        return o;
                                    }, {});
                                    var result = {
                                        pass: util.equals(projectedActual, expected, customEqualityTesters)
                                    };
                                    if (!result.pass) {
                                        result.message = 'Expected ' + JSON.stringify(projectedActual) +
                                            ' to equal ' + JSON.stringify(expected);
                                    }
                                    return result;
                                }
                            };
                        };
                    }

                    jasmine.addMatchers({
                        toHaveRanks: toHave(function(n) { return n.rank; }),
                        toHaveLims: toHave(function(n) { return n.lim; }),
                        toHaveLows: toHave(function(n) { return n.low; }),
                        toHaveParents: toHave(function(n) {
                            switch (true) {
                                case n.parent == null:
                                    return null;
                                case n.parent.tail === n:
                                    return n.parent.head.id;
                                case n.parent.head === n:
                                    return n.parent.tail.id;
                                default:
                                    throw new Error('Node references unconnected edge');
                            }
                        })
                    });
                });

                describe('initRank', function() {

                    it('should work with the graph in the paper (figure 2-3)', function() {
                        dot.rank.feasibleTree.initRank(nodes[0]);
                        expect(nodes).toHaveRanks({a: 0, b: 1, c: 2, d: 3, h: 4, e: 1, f: 1, g: 2});
                    });

                });

                it('should work with the graph in the paper (figure 2-3)', function() {
                    dot.rank.feasibleTree(nodes);
                    expect(nodes).toHaveRanks({a: 0, b: 1, c: 2, d: 3, h: 4, e: 1, f: 1, g: 2});
                });

                it('should tighten any slack introduced by initRank', function() {
                    // I don't see how initRank could have introduced any slack though...
                    // This test forces it by manually specifying the ranks
                    dot.rank.feasibleTree.initRank(nodes[0]);
                    nodes[4].rank += 1; // set 'h' to be +1

                    dot.rank.feasibleTree(nodes);
                    expect(nodes).toHaveRanks({a: 1, b: 2, c: 3, d: 4, h: 5, e: 2, f: 2, g: 3});
                });

                describe('postorder', function() {

                    it('should work with the graph in the paper (figure 2-3)', function() {
                        // The nodes need to have valid ranks first
                        dot.rank.feasibleTree.initRank(nodes[0]);
                        dot.rank.feasibleTree.postorder(nodes[0]);
                        expect(nodes).toHaveLows({a: 1, b: 1, c: 1, d: 1, e: 5, f: 5, g: 5, h: 1});
                        expect(nodes).toHaveLims({a: 8, b: 4, c: 3, d: 2, e: 7, f: 5, g: 6, h: 1});
                        expect(nodes).toHaveParents({a: null, b: 'a', c: 'b', d: 'c', e: 'a', f: 'g', g: 'e', h: 'd'});
                    });

                });

                describe('initCutvalues', function() {
                    it('should work with the graph in the paper (figure 2-3)', function() {
                        dot.rank.feasibleTree(nodes);

                        var edgeCutvalues = {};
                        nodes.forEach(function(node) {
                            node.in.concat(node.out)
                                .forEach(function(edge) {
                                    edgeCutvalues[edge.tail.id + '->' + edge.head.id] = edge.cutvalue;
                                });
                        });
                        expect(edgeCutvalues).toEqual({
                            'a->b': 2,
                            'b->c': 2,
                            'c->d': 2,
                            'd->h': 2,
                            'a->e': 1,
                            'a->f': undefined,
                            'e->g': 1,
                            'f->g': 0,
                            'g->h': undefined
                        });
                    });
                });

            });

        });

    });
}(d3, fc));
