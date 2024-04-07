use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct InputNet {
    pub nodes: Vec<String>,
    pub edges: Vec<(String, String)>,
    pub main_node: String,
}
