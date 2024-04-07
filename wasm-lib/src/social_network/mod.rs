mod edge;
mod group;
mod input_net;
mod layout;
mod node;
mod output_net;
mod output_node;

use crate::social_network::input_net::InputNet;
use crate::social_network::node::Node;
use crate::social_network::output_net::OutputNet;
use crate::social_network::output_node::OutputNode;
use crate::social_network::{edge::Edge, group::Group};
use crate::utils::set_panic_hook;
use petgraph::data::Build;
use petgraph::visit::IntoNeighbors;
use petgraph::{
    graph::{DiGraph, NodeIndex},
    Incoming,
};
use std::collections::HashMap;
use std::hash::Hash;
use wasm_bindgen::prelude::*;

const MAIN_GROUP: u8 = 1;
const SECONDARY_GROUP: u8 = 2;

#[wasm_bindgen]
pub struct SocialNetwork {
    graph: DiGraph<Node, ()>,
}

#[wasm_bindgen]
impl SocialNetwork {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        set_panic_hook();
        Self {
            graph: DiGraph::<Node, ()>::new(),
        }
    }

    pub fn set_net(&mut self, net_json: &str) {
        set_panic_hook();
        let net: InputNet =
            serde_json::from_str(net_json).expect("SET_NET: Failed to parse input net");

        let mut node_indexes = HashMap::<String, NodeIndex>::new();
        for node in net.nodes.iter() {
            let graph_node = if node == &net.main_node {
                Node::new(node.clone(), Group::Main)
            } else {
                Node::new(node.clone(), Group::Secondary)
            };
            let index = self.graph.add_node(graph_node);
            node_indexes.insert(node.clone(), index);
        }

        for edge in net.edges.iter() {
            let from = node_indexes.get(&edge.0).expect("SET_NET: Node not foud");
            let to = node_indexes.get(&edge.1).expect("SET_NET: Node not foud");
            self.graph.add_edge(*from, *to, ());
        }
    }

    pub fn get_net(&mut self) -> String {
        set_panic_hook();
        let mut net: OutputNet = OutputNet::new();

        self.graph.node_indices().for_each(|i| {
            let output_node =
                OutputNode::from_node(&self.graph[i], self.graph.neighbors(i).count());
            net.nodes.push(output_node);
        });

        serde_json::to_string(&net).expect("GET_NET: Failed converting net to string")
    }
}

#[cfg(test)]
mod tests {
    use crate::social_network::SocialNetwork;

    #[test]
    fn given_a_json_graph_it_returns_non_empty_string() {
        let data = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["2", "3"]],
            "main_node": "1"
        }"#;

        let mut sn = SocialNetwork::new();
        sn.set_net(data);
        assert!(!sn.get_net().is_empty());
    }
}
