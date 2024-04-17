use serde::{Deserialize, Serialize};

use super::node::Node;

#[derive(Serialize, Deserialize, Clone, Default, Debug)]
pub struct OutputNode {
    pub id: String,
    pub name: String,
    pub val: usize,
    pub group: u32,
}

impl OutputNode {
    pub fn from_node(node: &Node) -> Self {
        Self {
            id: node.id.clone(),
            name: node.name.clone(),
            val: 0,
            group: node.group.clone() as u32,
        }
    }
}
