use petgraph::graph::DiGraph;

use crate::social_network::{node::Node, output_net::OutputNet};

pub fn degree(graph: &DiGraph<Node, ()>, mut net: OutputNet) -> OutputNet {
    let mut references = net.get_node_mut_references();

    graph.node_indices().for_each(|i| {
        let id = &graph[i].id;
        if let Some(node) = references.get_mut(id) {
            node.val = graph.neighbors(i).count()
        }
    });
    net
}
