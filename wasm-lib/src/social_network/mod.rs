mod community_detection;
mod edge;
mod group;
mod input_net;
mod network_config;
mod node;
mod output_net;
mod output_node;
mod ranking;

use std::cmp::min;

use crate::social_network::input_net::InputNet;
use crate::social_network::node::Node;
use crate::social_network::output_net::OutputNet;

use crate::utils::set_panic_hook;
use petgraph::graph::DiGraph;

use wasm_bindgen::prelude::*;

use self::network_config::NetworkConfig;

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

    pub fn get_net(&mut self, config_json: &str) -> String {
        set_panic_hook();
        let config: NetworkConfig =
            serde_json::from_str(config_json).expect("SET_CONFIG: Failed to parse input config");
        let net = OutputNet::from_graph(&self.graph);

        let net = match config.color.as_str() {
            "community" => community_detection::strongly_connected_components(&self.graph, net),
            "spanning_tree" => {
                community_detection::k_spanning_tree(&self.graph, net, config.spanning_tree_k)
            }
            &_ => net,
        };

        let net = ranking::match_ranking(&self.graph, config.size.as_str(), net);

        serde_json::to_string(&net).expect("GET_NET: Failed converting net to string")
    }

    pub fn get_top_users(&self, ranking_type: &str, count: usize) -> String {
        set_panic_hook();
        let net = OutputNet::from_graph(&self.graph);
        let mut net = ranking::match_ranking(&self.graph, ranking_type, net);
        net.nodes.sort_by(|a, b| b.val.cmp(&a.val));
        let count = min(count, net.nodes.len());
        let top = net
            .nodes
            .iter()
            .take(count)
            .map(|node| &node.id)
            .collect::<Vec<&String>>();

        serde_json::to_string(&top).expect("GET_NET: Failed converting rank to string")
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
        let config = r#"{
            "color": "no-community",
            "size": "no-size",
            "spanning_tree_k": 0
        }"#;

        let mut sn = SocialNetwork::from_net(input);
        let output: OutputNet = serde_json::from_str(&sn.get_net(config)).unwrap();

        assert_eq!(output.nodes.len(), 3);
        assert_eq!(output.links.len(), 2);
    }

    #[test]
    fn given_a_json_graph_it_returns_a_net_with_nodes_and_its_val_sizes_when_dregree_is_marked() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["2", "3"]],
            "main_node": "1"
        }"#;
        let config = r#"{
            "color": "no-community",
            "size": "degree",
            "spanning_tree_k": 0
        }"#;

        let mut sn = SocialNetwork::from_net(input);
        let output: OutputNet = serde_json::from_str(&sn.get_net(config)).unwrap();

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
    fn main_node_should_be_part_of_the_main_group_when_config_has_colored_community() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["2", "3"]],
            "main_node": "1"
        }"#;
        let mut sn = SocialNetwork::from_net(input);

        let config = r#"{
            "color": "community",
            "size": "no-size",
            "spanning_tree_k": 0
        }"#;
        let output: OutputNet = serde_json::from_str(&sn.get_net(config)).unwrap();

        assert_eq!(
            output
                .nodes
                .iter()
                .filter(|&node| node.id == "1")
                .collect::<Vec<&OutputNode>>()[0]
                .group
                .clone(),
            0
        );
    }

    #[test]
    fn should_get_top_users_based_on_degree() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["2", "1"], ["1", "3"]],
            "main_node": "1"
        }"#;
        let ranking_type = "degree";
        let count = 2;

        let sn = SocialNetwork::from_net(input);
        let out = sn.get_top_users(ranking_type, count);
        let top_users: Vec<String> = serde_json::from_str(&out).unwrap();

        assert_eq!(top_users, vec!["1", "2"]);
    }

    #[test]
    fn should_get_top_users_based_on_followers() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["2", "1"], ["1", "3"], ["2", "3"]],
            "main_node": "1"
        }"#;
        let ranking_type = "follower";
        let count = 3;

        let sn = SocialNetwork::from_net(input);
        let out = sn.get_top_users(ranking_type, count);
        let top_users: Vec<String> = serde_json::from_str(&out).unwrap();

        assert_eq!(top_users, vec!["2", "1", "3"]);
    }

    #[test]
    fn should_get_top_users_based_on_popularity() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["2", "1"], ["1", "3"], ["2", "3"]],
            "main_node": "1"
        }"#;
        let ranking_type = "popularity";
        let count = 3;

        let sn = SocialNetwork::from_net(input);
        let out = sn.get_top_users(ranking_type, count);
        let top_users: Vec<String> = serde_json::from_str(&out).unwrap();

        assert_eq!(top_users, vec!["3", "1", "2"]);
    }
}
