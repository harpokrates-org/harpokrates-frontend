use serde::{Deserialize, Serialize};

pub const GREY_COLOR_IN_DECIMAL: u32 = 10526880;

#[repr(u32)]
#[derive(Debug, Serialize, Deserialize, Clone, Default, PartialEq)]
pub enum Group {
    Main = 0,
    #[default]
    Secondary = GREY_COLOR_IN_DECIMAL,
}
