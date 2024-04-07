use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Edge {
    source: String,
    target: String,
}

impl Edge {
    pub fn new(source: String, target: String) -> Self {
        Self { source, target }
    }
}
