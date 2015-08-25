(function(d3, fc) {
    'use strict';

    fc.layout.dot = function() {

      var children = function(d) { return d.children; },
        rank = function(d) { return d.rank; };

      function rankIdentifier(d, i) {
        return rank(d) != null ? ('RANK:' + rank(d)) : ('INDEX:' + i);
      }

      function first(array, predicate) {
        return array.filter(predicate)[0];
      }

      // graph { nodes, edges }
      function groupNodes(graph, key) {
        var output = {
          nodes: [],
          edges: []
        };
        var keyIndicies = {};
        graph.nodes.forEach(function(node, i) {
          var nodeKey = key(node);
          var groupNodeIndex = keyIndicies[nodeKey];
          if (groupNodeIndex == null) {
            groupNodeIndex = keyIndicies[nodeKey] = output.nodes.length;
            output.nodes.push({
              key: nodeKey,
              source: []
            });
          }
          var groupNode = output.nodes[groupNodeIndex];


          //output.nodes[keyIndicies[nodeKey]]
          if (keyIndicies[nodeKey] == null) {
            keyIndicies[nodeKey] = output.nodes.length;

            output.nodes.push(groupNode);
          } else {
            groupNode = output.nodes[groupNodeIndex];
          }
        });
      }

      function depthFirst(node, action) {

      }

      function dot() {

      }

      dot.preprocess = function(nodes, edges) {
        // node { rank } edge { tail, head, weight } (tail/head)

        // node { edges, source } edge { tail, head, source }

        // merged - mapping from node index to merged node index

        // merge nodes within sets
        var merged = group(nodes, rankIdentifier);

        // remove loops (a, a) (self-edges)
        var selfEdges = edges.map(function(edge) {
          return merged[edge.source] === merged[edge.target];
        });

        // mark tree/non-tree and reverse back (i.e. circular) edges
        var visitedNodes = {};
        var reversedEdges = unique(merged)
          .forEach(function())

        var rankingNodes = [];
        nodes.forEach(function(node, i) {
          var nodeRankIdentifier = rankIdentifier(rank(node), i);
          var rankingNode = rankingNodes[nodeRankIdentifier];
          if (!rankingNode) {
            rankingNode = {
              sourceNodeIndicies: [],
              edges: [],
              rank: null
            };
            rankingNodes.push(rankingNode);
          }
          sourceNodeIndicies.push(i);
        });
        Object.keys(rankingNodes)
          .forEach(function(rankingNodeIdentifier) {
            var rankingNode = rankingNodes[rankingNodeIdentifier];
            rankingNode.sourceNodeIndicies.forEach(function(sourceNodeIndex) {
              children(nodes[sourceNodeIndex])
                .forEach(function(childNode) {
                  var childNodeIndex = nodes.indexOf(childNode);
                  var childNodeRankIdentifier = rankIdentifier(rank(childNode), childNodeIndex);
                  var childRankingNode = rankingNodes[childNodeRankIdentifier];
                  var edge = {
                    tail: rankingNode,
                    head: childRankingNode,
                    weight: 1,
                    type: null,
                    cutValue: null
                  };
                  rankingNode.edges.push(edge);
                });
            });
          });


          children(node).forEach(function(child, i) {

          });

        var dotNodes = {};
        for (var i = 0, n = nodes.length; i < n; i++) {
          var node = nodes[i];
          var nodeRank = rank(node);
          var dotNode = first(dotNodes, function(n) { return n.rank === nodeRank; });
          if (!dotNode) {
            dotNode = {
              outEdges: [],
              inEdges: [],
              depth: -1,
              rank: -1
            };
            dotNodes.push(dotNode);
          }
        }

        nodes.map(function(node) {
          return {
            head:
          };
        });
      };

      return dot;
    };



// preprocess

  // merge nodes within sets

  // remove loops (a, a) (self-edges)

  // remove leaf nodes NOT DOING THIS AS NOT SURE HOW TO RE-INTRODUCE

  // mark tree/non-tree and reverse back (i.e. circular) edges

  // merge identical edges (multi-edges) MUST DO THIS AFTER REVERSING EDGES

  // pick sMax (assume first node)

  // reverse sMax in edges

  // add temporary edges from sMax to nodes with no in edges

  // pick sMin (assume most deeply nested node)

  // reverse sMin out edges

  // add temporary edges from sMin to nodes with no out edges

// function rank() {
//   feasibleTree();
//   let e = leaveEdge();
//   while (e) {
//     f = enterEdge(e);
//     exchange(e, f);
//     e = leaveEdge();
//   }
//   normalize();
//   balance();
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

}(d3, fc));
