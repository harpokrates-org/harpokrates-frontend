use serde::{Deserialize, Serialize};

#[repr(u8)]
#[derive(Debug, Serialize, Deserialize, Clone, Default, PartialEq)]
pub enum Group {
    Main = 0,
    #[default]
    Secondary,
}
