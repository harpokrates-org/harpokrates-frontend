use serde::{Deserialize, Serialize};

use super::node::Node;

#[derive(Serialize, Deserialize, Clone, Default, Debug)]
pub struct OutputNode {
    pub id: String,
    name: String,
    pub val: usize,
    pub group: u8,
}

impl OutputNode {
    pub fn from_node(node: &Node, size: usize) -> Self {
        Self {
            id: node.id.clone(),
            name: node.name.clone(),
            val: size,
            group: node.group.clone() as u8,
        }
    }
}
