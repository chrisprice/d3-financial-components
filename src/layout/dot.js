// preprocess

  // merge nodes within sets

  // merge identical edges (multi-edges)

  // remove loops (a, a) (self-edges)

  // remove leaf nodes NOT DOING THIS AS NOT SURE HOW TO RE-INTRODUCE

  // mark tree/non-tree and reverse back (i.e. circular) edges

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
