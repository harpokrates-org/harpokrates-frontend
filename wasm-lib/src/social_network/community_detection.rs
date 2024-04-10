use petgraph::{algo::tarjan_scc, graph::DiGraph};

use crate::social_network::{group::Group, node::Node, output_net::OutputNet};
pub fn strongly_connected_components(graph: &DiGraph<Node, ()>, mut net: OutputNet) -> OutputNet {
    let mut references = net.get_node_mut_references();

    let components = tarjan_scc(graph);

    for (i, component) in components.iter().enumerate() {
        for node_idx in component {
            let id = &graph[*node_idx].id;
            if let Some(node) = references.get_mut(id) {
                if node.group != Group::Main as u8 {
                    node.group = (i + 1) as u8;
                }
            }
        }
    }
    net
}
