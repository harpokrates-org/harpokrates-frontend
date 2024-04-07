use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Node {
    pub id: String,
    name: String,
    val: usize,
    pub group: u8,
}

impl Node {
    pub fn new(id: String, neighbors: usize, group: u8) -> Self {
        Self {
            id: id.clone(),
            name: id,
            val: neighbors,
            group: group,
        }
    }
}
