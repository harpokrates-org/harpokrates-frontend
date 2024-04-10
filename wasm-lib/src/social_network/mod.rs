mod community_detection;
mod edge;
mod group;
mod input_net;
mod node;
mod output_net;
mod output_node;
mod ranking;

use crate::social_network::input_net::InputNet;
use crate::social_network::node::Node;
use crate::social_network::output_net::OutputNet;

use crate::utils::set_panic_hook;
use petgraph::graph::{DiGraph};

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct SocialNetwork {
    graph: DiGraph<Node, ()>,
}

#[wasm_bindgen]
impl SocialNetwork {
    #[wasm_bindgen(constructor)]
    pub fn from_net(net_json: &str) -> Self {
        set_panic_hook();
        let net: InputNet =
            serde_json::from_str(net_json).expect("SET_NET: Failed to parse input net");
        Self {
            graph: net.into_graph(),
        }
    }

    pub fn get_net(&mut self) -> String {
        set_panic_hook();
        let net = OutputNet::from_graph(&self.graph);
        let net = ranking::degree(&self.graph, net);
        let net = community_detection::strongly_connected_components(&self.graph, net);
        serde_json::to_string(&net).expect("GET_NET: Failed converting net to string")
    }
}

#[cfg(test)]
mod tests {
    use crate::social_network::{output_net::OutputNet, output_node::OutputNode, SocialNetwork};

    #[test]
    fn given_a_json_graph_it_returns_a_net_with_nodes_and_links() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["2", "3"]],
            "main_node": "1"
        }"#;

        let mut sn = SocialNetwork::from_net(input);
        let output: OutputNet = serde_json::from_str(&sn.get_net()).unwrap();

        assert_eq!(output.nodes.len(), 3);
        assert_eq!(output.links.len(), 2);
    }

    #[test]
    fn given_a_json_graph_it_returns_a_net_with_nodes_and_its_val_sizes() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["2", "3"]],
            "main_node": "1"
        }"#;

        let mut sn = SocialNetwork::from_net(input);
        let output: OutputNet = serde_json::from_str(&sn.get_net()).unwrap();

        assert_eq!(
            output
                .nodes
                .iter()
                .filter(|&node| node.id == "1")
                .collect::<Vec<&OutputNode>>()[0]
                .val,
            1
        );
    }

    #[test]
    fn main_node_should_be_part_of_the_main_group() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["2", "3"]],
            "main_node": "1"
        }"#;

        let mut sn = SocialNetwork::from_net(input);
        let output: OutputNet = serde_json::from_str(&sn.get_net()).unwrap();

        assert_eq!(
            output
                .nodes
                .iter()
                .filter(|&node| node.id == "1")
                .collect::<Vec<&OutputNode>>()[0]
                .group
                .clone(),
            1
        );
    }
}
