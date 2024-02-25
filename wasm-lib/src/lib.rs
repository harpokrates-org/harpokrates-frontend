mod utils;

use wasm_bindgen::prelude::*;
use petgraph::graph::{DiGraph, NodeIndex};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use utils::set_panic_hook;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-lib!");
}

#[derive(Serialize, Deserialize)]
struct Net {
    nodes: Vec<String>,
    edges: Vec<(String, String)>,
}

impl Net {
    pub fn new() -> Self {
        Self {
            nodes: Vec::new(),
            edges: Vec::new(),
        }
    }
}

#[wasm_bindgen]
pub struct SocialNetwork {
    graph: DiGraph<String, u32>,
}

#[wasm_bindgen]
impl SocialNetwork {
    pub fn new() -> Self {
        set_panic_hook();
        Self {
            graph: DiGraph::<String, u32>::new()
        }
    }

    pub fn set_net(&mut self, net_json: &str) {
        set_panic_hook();
        let net: Net = serde_json::from_str(net_json).expect("SET_NET: Failed to parse input net");
        let mut indexes: HashMap<String, NodeIndex> = HashMap::new();
        
        for node in net.nodes.iter() {
            let index: NodeIndex = self.graph.add_node(node.clone());
            indexes.insert(node.clone(), index);
        }
        
        for edge in net.edges.iter() {
            let from: &NodeIndex = indexes.get(&edge.0).expect("SET_NET: Node not foud");
            let to: &NodeIndex = indexes.get(&edge.1).expect("SET_NET: Node not foud");
            self.graph.add_edge(*from, *to, 1);
        }
    }
    
    pub fn get_net(&mut self) -> String {
        set_panic_hook();
        let mut net: Net = Net::new();
        let graph_clone_nodes: DiGraph<String, u32> = self.graph.clone();
        let graph_clone_edges: DiGraph<String, u32> = self.graph.clone();
        graph_clone_nodes.into_nodes_edges().0.iter()
            .for_each(|node| {
                net.nodes.push(node.weight.clone())
            });
        graph_clone_edges.into_nodes_edges().1.iter()
            .for_each(|edge| {
                let from = edge.source();
                let to = edge.target();
                net.edges.push((
                    (*self.graph.node_weight(from).expect("GET_NET: Source node not found")).clone(),
                    (*self.graph.node_weight(to).expect("GET_NET: Target node not found")).clone()
                ))
            });
        serde_json::to_string(&net).expect("GET_NET: Failed converting net to string")
    }
}