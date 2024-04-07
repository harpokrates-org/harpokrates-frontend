mod edge;
mod group;
mod input_net;
mod layout;
mod node;
mod output_net;
mod output_node;

use crate::social_network::edge::Edge;
use crate::social_network::group::Group;
use crate::social_network::input_net::InputNet;
use crate::social_network::node::Node;
use crate::social_network::output_net::OutputNet;
use crate::social_network::output_node::OutputNode;
use crate::utils::set_panic_hook;
use petgraph::graph::{DiGraph, NodeIndex};
use petgraph::visit::EdgeRef;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

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

        self.graph.edge_references().for_each(|edge_ref| {
            let from = edge_ref.source();
            let to = edge_ref.target();
            let edge = Edge::from_nodes(&self.graph[from], &self.graph[to]);
            net.links.push(edge);
        });

        serde_json::to_string(&net).expect("GET_NET: Failed converting net to string")
    }
}

impl Default for SocialNetwork {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use crate::social_network::{group::Group, output_node::OutputNode, SocialNetwork};

    use super::output_net::OutputNet;

    #[test]
    fn given_a_json_graph_it_returns_a_net_with_nodes_and_links() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["2", "3"]],
            "main_node": "1"
        }"#;

        let mut sn = SocialNetwork::new();
        sn.set_net(input);
        let output: OutputNet = serde_json::from_str(&sn.get_net()).unwrap();

        assert_eq!(output.nodes.len(), 3);
        assert_eq!(output.links.len(), 2);
    }

    #[test]
    fn given_a_json_graph_it_returns_a_net_nodes_and_its_val_sizes() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["2", "3"]],
            "main_node": "1"
        }"#;

        let mut sn = SocialNetwork::new();
        sn.set_net(input);
        let output: OutputNet = serde_json::from_str(&sn.get_net()).unwrap();

        assert_eq!(
            output
                .nodes
                .iter()
                .filter(|&node| node.id == "1")
                .collect::<Vec<&OutputNode>>()[0]
                .val,
            1
        );
    }

    #[test]
    fn main_node_should_be_part_of_the_main_group() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["2", "3"]],
            "main_node": "1"
        }"#;

        let mut sn = SocialNetwork::new();
        sn.set_net(input);
        let output: OutputNet = serde_json::from_str(&sn.get_net()).unwrap();

        assert_eq!(
            output
                .nodes
                .iter()
                .filter(|&node| node.id == "1")
                .collect::<Vec<&OutputNode>>()[0]
                .group
                .clone(),
            1
        );
        println!("{:?}", output);
    }
}
