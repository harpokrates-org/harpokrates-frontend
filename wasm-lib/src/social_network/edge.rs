use serde::{Deserialize, Serialize};

use super::node::Node;

#[derive(Serialize, Deserialize)]
pub struct Edge {
    source: String,
    target: String,
}

impl Edge {
    pub fn new(source: String, target: String) -> Self {
        Self { source, target }
    }

    pub fn from_nodes(source: &Node, target: &Node) -> Self {
        Self::new(source.id.clone(), target.id.clone())
    }
}
