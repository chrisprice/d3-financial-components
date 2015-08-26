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
                    jasmine.addMatchers({
                        toHaveRanks: function(util, customEqualityTesters) {
                            return {
                                compare: function(actual, expected) {
                                    var ranks = actual.reduce(function(o, n) {
                                        o[n.id] = n.rank;
                                        return o;
                                    }, {});
                                    return {
                                        pass: util.equals(ranks, expected, customEqualityTesters)
                                    };
                                }
                            };
                        }
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


            });

        });

    });
}(d3, fc));
