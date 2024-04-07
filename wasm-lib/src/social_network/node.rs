use serde::{Deserialize, Serialize};

use super::group::Group;

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct Node {
    pub id: String,
    pub name: String,
    pub group: Group,
}

impl Node {
    pub fn new(id: String, group: Group) -> Self {
        Self {
            id: id.clone(),
            name: id,
            group,
        }
    }
}
