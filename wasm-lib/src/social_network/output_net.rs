use crate::social_network::edge::Edge;
use crate::social_network::node::Node;
use serde::{Deserialize, Serialize};

use super::output_node::OutputNode;

#[derive(Serialize, Deserialize)]
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
}
