use std::collections::HashMap;

use petgraph::graph::{DiGraph, NodeIndex};
use serde::{Deserialize, Serialize};

use super::{group::Group, node::Node};

#[derive(Serialize, Deserialize)]
pub struct InputNet {
    pub nodes: Vec<String>,
    pub edges: Vec<(String, String)>,
    pub main_node: String,
}

impl InputNet {
    pub fn into_graph(self) -> DiGraph<Node, ()> {
        let mut graph = DiGraph::<Node, ()>::new();
        let mut node_indexes = HashMap::<String, NodeIndex>::new();

        for node in self.nodes.iter() {
            let graph_node = if node == &self.main_node {
                Node::new(node.clone(), Group::Main)
            } else {
                Node::new(node.clone(), Group::Secondary)
            };
            let index = graph.add_node(graph_node);
            node_indexes.insert(node.clone(), index);
        }

        for edge in self.edges.iter() {
            let from = node_indexes.get(&edge.0).expect("SET_NET: Node not foud");
            let to = node_indexes.get(&edge.1).expect("SET_NET: Node not foud");
            graph.add_edge(*from, *to, ());
        }

        graph
    }
}
