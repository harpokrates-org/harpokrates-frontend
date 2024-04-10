use std::collections::HashMap;

use crate::social_network::edge::Edge;

use petgraph::{graph::DiGraph, visit::EdgeRef};
use serde::{Deserialize, Serialize};

use super::{node::Node, output_node::OutputNode};

#[derive(Serialize, Deserialize, Debug)]
pub struct OutputNet {
    pub nodes: Vec<OutputNode>,
    pub links: Vec<Edge>,
}

impl OutputNet {
    pub fn new() -> Self {
        Self {
            nodes: Vec::new(),
            links: Vec::new(),
        }
    }

    pub fn from_graph(graph: &DiGraph<Node, ()>) -> Self {
        let mut net = Self::new();
        graph.node_indices().for_each(|i| {
            let output_node = OutputNode::from_node(&graph[i]);
            net.nodes.push(output_node);
        });

        graph.edge_references().for_each(|edge_ref| {
            let from = edge_ref.source();
            let to = edge_ref.target();
            let edge = Edge::from_nodes(&graph[from], &graph[to]);
            net.links.push(edge);
        });
        net
    }

    pub fn get_node_mut_references(&mut self) -> HashMap<String, &mut OutputNode> {
        let mut hashmap = HashMap::new();
        for node in &mut self.nodes {
            hashmap.insert(node.id.clone(), node);
        }
        hashmap
    }
}
