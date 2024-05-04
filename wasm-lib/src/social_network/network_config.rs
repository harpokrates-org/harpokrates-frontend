use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct NetworkConfig {
    pub color: String,
    pub size: String,
}
