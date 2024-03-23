mod utils;

use wasm_bindgen::prelude::*;
use petgraph::graph::{DiGraph, NodeIndex};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use utils::set_panic_hook;

const MAIN_GROUP: u8 = 1;
const SECONDARY_GROUP: u8 = 2;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-lib!");
}

#[derive(Serialize, Deserialize, Clone)]
struct Node {
    id: String,
    name: String,
    val: u8,
    group: u8,
}

impl Node {
    pub fn new(id: String, group: u8) -> Self {
        Self {
            id: id.clone(),
            name: id,
            val: 1,
            group: group.clone(),
        }
    }
}

#[derive(Serialize, Deserialize)]
struct Edge {
    source: String,
    target: String,
}

impl Edge {
    pub fn new(source: String, target: String) -> Self {
        Self {
            source,
            target,
        }
    }
}

#[derive(Serialize, Deserialize)]
struct InputNet {
    nodes: Vec<String>,
    edges: Vec<(String, String)>,
    main_node: String,
}

#[derive(Serialize, Deserialize)]
struct OutputNet {
    nodes: Vec<Node>,
    links: Vec<Edge>,
}

impl OutputNet {
    pub fn new() -> Self {
        Self {
            nodes: Vec::new(),
            links: Vec::new(),
        }
    }
}

#[wasm_bindgen]
pub struct SocialNetwork {
    graph: DiGraph<Node, u32>,
}

#[wasm_bindgen]
impl SocialNetwork {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        set_panic_hook();
        Self {
            graph: DiGraph::<Node, u32>::new()
        }
    }

    pub fn set_net(&mut self, net_json: &str) {
        set_panic_hook();
        let net: InputNet = serde_json::from_str(net_json).expect("SET_NET: Failed to parse input net");
        let mut indexes: HashMap<String, NodeIndex> = HashMap::new();
        
        for node in net.nodes.iter() {
            let graph_node: Node;
            if node == &net.main_node {
                graph_node = Node::new(node.clone(), MAIN_GROUP)
            } else {
                graph_node = Node::new(node.clone(), SECONDARY_GROUP)
            }
            let index: NodeIndex = self.graph.add_node(graph_node);
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
        let mut net: OutputNet = OutputNet::new();
        let graph_clone_nodes: DiGraph<Node, u32> = self.graph.clone();
        let graph_clone_edges: DiGraph<Node, u32> = self.graph.clone();
        graph_clone_nodes.into_nodes_edges().0.iter()
            .for_each(|node| {
                net.nodes.push(Node::new(node.weight.id.clone(), node.weight.group.clone()))
            });
        graph_clone_edges.into_nodes_edges().1.iter()
            .for_each(|edge| {
                let from = edge.source();
                let to = edge.target();
                net.links.push(Edge::new(
                    (*self.graph.node_weight(from).expect("GET_NET: Source node not found")).id.clone(),
                    (*self.graph.node_weight(to).expect("GET_NET: Target node not found")).id.clone()
                ))
            });
        serde_json::to_string(&net).expect("GET_NET: Failed converting net to string")
    }
}