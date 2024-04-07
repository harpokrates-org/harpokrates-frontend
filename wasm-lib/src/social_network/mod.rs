mod edge;
mod input_net;
mod node;
mod output_net;

use crate::social_network::edge::Edge;
use crate::social_network::input_net::InputNet;
use crate::social_network::node::Node;
use crate::social_network::output_net::OutputNet;
use crate::utils::set_panic_hook;
use petgraph::{
    graph::{DiGraph, NodeIndex},
    Incoming,
};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

const MAIN_GROUP: u8 = 1;
const SECONDARY_GROUP: u8 = 2;
const DEFAULT_NEIGHTBORS: usize = 1;

#[wasm_bindgen]
pub struct SocialNetwork {
    graph: DiGraph<Node, u32>,
    node_indexes: HashMap<String, NodeIndex>,
}

#[wasm_bindgen]
impl SocialNetwork {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        set_panic_hook();
        Self {
            graph: DiGraph::<Node, u32>::new(),
            node_indexes: HashMap::<String, NodeIndex>::new(),
        }
    }

    pub fn set_net(&mut self, net_json: &str) {
        set_panic_hook();
        let net: InputNet =
            serde_json::from_str(net_json).expect("SET_NET: Failed to parse input net");

        for node in net.nodes.iter() {
            let graph_node: Node;
            if node == &net.main_node {
                graph_node = Node::new(node.clone(), DEFAULT_NEIGHTBORS, MAIN_GROUP)
            } else {
                graph_node = Node::new(node.clone(), DEFAULT_NEIGHTBORS, SECONDARY_GROUP)
            }
            let index: NodeIndex = self.graph.add_node(graph_node);
            self.node_indexes.insert(node.clone(), index);
        }

        for edge in net.edges.iter() {
            let from: &NodeIndex = self
                .node_indexes
                .get(&edge.0)
                .expect("SET_NET: Node not foud");
            let to: &NodeIndex = self
                .node_indexes
                .get(&edge.1)
                .expect("SET_NET: Node not foud");
            self.graph.add_edge(*from, *to, 1);
        }
    }

    pub fn get_net(&mut self) -> String {
        set_panic_hook();
        let mut net: OutputNet = OutputNet::new();
        let graph_clone_nodes: DiGraph<Node, u32> = self.graph.clone();
        let graph_clone_edges: DiGraph<Node, u32> = self.graph.clone();
        graph_clone_nodes
            .into_nodes_edges()
            .0
            .iter()
            .for_each(|node| {
                let node_index: &NodeIndex = self
                    .node_indexes
                    .get(&node.weight.id)
                    .expect("GET_NET: Node index not found");
                net.nodes.push(Node::new(
                    node.weight.id.clone(),
                    self.graph.neighbors_directed(*node_index, Incoming).count(),
                    node.weight.group.clone(),
                ))
            });
        graph_clone_edges
            .into_nodes_edges()
            .1
            .iter()
            .for_each(|edge| {
                let from = edge.source();
                let to = edge.target();
                net.links.push(Edge::new(
                    (*self
                        .graph
                        .node_weight(from)
                        .expect("GET_NET: Source node not found"))
                    .id
                    .clone(),
                    (*self
                        .graph
                        .node_weight(to)
                        .expect("GET_NET: Target node not found"))
                    .id
                    .clone(),
                ))
            });
        serde_json::to_string(&net).expect("GET_NET: Failed converting net to string")
    }
}

#[cfg(test)]
mod tests {
    use crate::social_network::SocialNetwork;

    #[test]
    fn given_a_json_graph_it_returns_non_empty_string() {        
        let data = r#"
        {
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["2", "3"]],
            "main_node": "1"
        }"#;
        
        let mut sn = SocialNetwork::new();
        sn.set_net(data);
        assert!(!sn.get_net().is_empty());
    }
}
