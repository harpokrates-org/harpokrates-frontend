use serde::{Deserialize, Serialize};

use super::{group::Group, node::Node};

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct OutputNode {
    pub id: String,
    name: String,
    size: usize,
    group: Group,
}

impl OutputNode {
    pub fn from_node(node: &Node, size: usize) -> Self {
        Self {
            id: node.id.clone(),
            name: node.name.clone(),
            size,
            group: node.group.clone(),
        }
    }
}
