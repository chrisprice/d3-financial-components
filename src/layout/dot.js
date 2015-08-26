(function(d3, fc) {
    'use strict';

    fc.layout.dot = function() {

        // var children = function(d) { return d.children; },
        //     rank = function(d) { return d.rank; };

        // function rankIdentifier(d, i) {
        //     return rank(d) != null ? ('RANK:' + rank(d)) : ('INDEX:' + i);
        // }

        var LENGTH = 1;

        function rank() {

        }

        function slack(edge) {
            return edge.head.rank - edge.tail.rank - LENGTH;
        }

        function initRank(root) {
            var queue = [root];
            var scannedEdges = [];

            function leastRank(node) {
                var least = node.rank != null ? node.rank : 0; // allows injection of ranks
                for (var i = 0; i < node.in.length; i++) {
                    var rank = node.in[i].tail.rank;
                    if (rank >= least) {
                        least = rank + LENGTH;
                    }
                }
                return least;
            }

            function noUnscannedInEdges(node) {
                for (var i = 0; i < node.in.length; i++) {
                    if (scannedEdges.indexOf(node.in[i]) === -1) {
                        return false;
                    }
                }
                return true;
            }

            var node = queue.shift();
            while (node) {
                node.rank = leastRank(node);
                for (var i = 0; i < node.out.length; i++) {
                    var outEdge = node.out[i];
                    scannedEdges.push(outEdge);
                    if (noUnscannedInEdges(outEdge.head)) {
                        queue.push(outEdge.head);
                    }
                }
                node = queue.shift();
            }
        }

        function tightTree(root) {
            var treeNodes = [];

            function recurse(nodeA) {
                treeNodes.push(nodeA);

                var edges = nodeA.out.concat(nodeA.in);
                for (var i = 0; i < edges.length; i++) {
                    var edge = edges[i];
                    if (Math.abs(edge.head.rank - edge.tail.rank) === LENGTH) {
                        var nodeB = (edge.tail === nodeA) ? edge.head : edge.tail;
                        if (treeNodes.indexOf(nodeB) === -1) {
                            recurse(nodeB);
                        }
                    }
                }
            }

            recurse(root);

            return treeNodes;
        }

        function leastSlackAdjacentEdge(nodes) {
            var leastSlack = null;

            for (var i = 0; i < nodes.length; i++) {
                var nodeA = nodes[i];

                var edges = nodeA.out.concat(nodeA.in);
                for (var j = 0; j < edges.length; j++) {
                    var edge = edges[j];
                    var nodeB = (edge.tail === nodeA) ? edge.head : edge.tail;
                    if (nodes.indexOf(nodeB) === -1) {
                        if (leastSlack == null || slack(edge) < slack(leastSlack)) {
                            leastSlack = edge;
                        }
                    }
                }
            }
            return leastSlack;
        }

        function initCutvalues() {

        }

        function feasibleTree(nodes) {
            initRank(nodes[0]);
            var tree = tightTree(nodes[0]);
            while (tree.length < nodes.length) {
                var edge = leastSlackAdjacentEdge(tree);
                var delta = slack(edge);
                if (tree.indexOf(edge.head) > -1) {
                    delta = -delta;
                }
                for (var i = 0; i < tree.length; i++) {
                    tree[i].rank += delta;
                }
                tree = tightTree(nodes[0]);
            }
            initCutvalues();
        }

        function dot() {

        }

        dot.rank = rank;
        dot.rank.feasibleTree = feasibleTree;
        dot.rank.feasibleTree.initRank = initRank;

        return dot;
    };

}(d3, fc));

    //     dot.rank = function(nodes) {
    //         // At this point -
    //         // * Nodes are merged at the set level
    //         // * Self-edges are removed
    //         // * Back-edges are reversed
    //         // * sMax/sMin in/out-edges reversed
    //         // * Multi-edges are merged (weights combined)
    //         // * Temporary edges created from sMin/sMax

    //         // nodes: { rank: number, out: { weight: number, head, tail }[], in: { weight: number, head, tail }[] }

    //         //     feasibleTree();

    //         var unscannedEdges = edges.slice();
    //         var unscannedNodes = nodes.slice();
    //         while (unscannedNodes.length != 0) {
    //             for (var i = 0; i < unscannedNodes.length; i++) {
    //                 for (var j = 0; j < unscannedEdges.length; j++) {
    //                     if (unscannedEdges[j].source)
    //                 }
    //             }
    //         }

    //         //     let e = leaveEdge();
    //         //     while (e) {
    //         //         f = enterEdge(e);
    //         //         exchange(e, f);
    //         //         e = leaveEdge();
    //         //     }
    //         //     normalize();
    //         //     balance();
    //     };

    //     return dot;
    // };



// preprocess

// merge nodes within sets

// remove loops (a, a) (self-edges)

// remove leaf nodes NOT DOING THIS AS NOT SURE HOW TO RE-INTRODUCE

// mark tree/non-tree and reverse back (i.e. circular) edges

// pick sMax (assume first node)

// reverse sMax in edges

// pick sMin (assume most deeply nested node)

// reverse sMin out edges

// merge identical edges (multi-edges) MUST DO THIS AFTER REVERSING EDGES

// add temporary edges from sMax to nodes with no in edges

// add temporary edges from sMin to nodes with no out edges

// function rank() {
//     feasibleTree();
//     let e = leaveEdge();
//     while (e) {
//         f = enterEdge(e);
//         exchange(e, f);
//         e = leaveEdge();
//     }
//     normalize();
//     balance();
// }


// v - Node
// edge - link
// (a, b) - an edge from a (tail/source) to b (head/target)
// rank - grouping of nodes on the y-axis
// Si - sets of nodes which must be assigned the same rank (i.e. vertical position)
// λ(v) - Integer rank (consistent with its edges)
// e = (v, w) - Edge
// l(e) - length (λ(w) − λ(v))
// δ(e) - minimum length constraint (l(e) ≥ δ(e))
// feasible ranking - satisfy all the length constraints
// slack of an edge - the difference of its length and its minimum length
// tight - slack === 0


/*
node
+ edges
+ rank
+ set
*/

/*
edge
+ head
+ tail
+ tree
+ back (implies reversed)
*/

// // Assign an integer rank to each node
// rank(nodes);
// ordering();
// position();
// makeSplines();

