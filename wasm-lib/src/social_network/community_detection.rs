use core::cmp::{max, min};
use petgraph::{
    algo::{connected_components, min_spanning_tree, tarjan_scc},
    data::FromElements,
    graph::{DiGraph, NodeIndex, UnGraph},
    prelude::Dfs,
    visit::{EdgeRef, NodeRef},
};
use std::collections::HashMap;

use crate::social_network::{
    group::Group, node::Node, output_net::OutputNet, output_node::OutputNode,
};

use super::group::GREY_COLOR_IN_DECIMAL;

const MIN_COMPONENT_LEN: usize = 2;

fn component_to_color(index: f64, max_components: f64) -> u32 {
    let max_colors = 16777215.0 - 100000.0; // total colores en 3 bytes = 2^24
    (((max_colors / max_components) * index).floor()) as u32
}

pub fn strongly_connected_components(graph: &DiGraph<Node, ()>, mut net: OutputNet) -> OutputNet {
    // TODO!: Refactor
    let mut references = net.get_node_mut_references();

    let components = tarjan_scc(graph);

    let colored_components = components
        .iter()
        .filter(|&component| component.len() >= MIN_COMPONENT_LEN)
        .collect::<Vec<_>>();

    for (i, component) in colored_components.iter().enumerate() {
        for node_idx in *component {
            let id = &graph[*node_idx].id;
            if let Some(node) = references.get_mut(id) {
                if node.group == Group::Main as u32 {
                    continue;
                }
                node.group =
                    component_to_color((i + 1) as f64, colored_components.len() as f64) as u32;
            }
        }
    }

    let neutral_components = components
        .iter()
        .filter(|&component| component.len() < MIN_COMPONENT_LEN)
        .collect::<Vec<_>>();

    for component in neutral_components {
        for node_idx in component {
            let id = &graph[*node_idx].id;
            if let Some(node) = references.get_mut(id) {
                if node.group == Group::Main as u32 {
                    continue;
                }
                node.group = GREY_COLOR_IN_DECIMAL;
            }
        }
    }

    net
}

fn get_graph_edge_weights(
    graph: &DiGraph<Node, ()>,
    graph_size: usize,
) -> HashMap<(usize, usize), usize> {
    let mut edge_weights = HashMap::new();

    for edge in graph.edge_references() {
        let from = edge.source().index();
        let to = edge.target().index();
        let x_index = min(from, to);
        let y_index = max(from, to);

        // weight = |E|-<las aristas from-to/to-from>
        edge_weights
            .entry((x_index, y_index))
            .and_modify(|weight| *weight -= 1)
            .or_insert(graph_size);
    }

    edge_weights
}

fn get_graph_inverse_weights(graph: &DiGraph<Node, ()>) -> UnGraph<Node, usize> {
    let mut weighted_graph = UnGraph::<Node, usize>::new_undirected();
    let graph_size = graph.edge_count(); // |E|

    let edge_weights = get_graph_edge_weights(graph, graph_size);

    for node in graph.node_indices() {
        weighted_graph.add_node(graph[node].clone());
    }

    for ((from, to), weight) in edge_weights {
        weighted_graph.add_edge(NodeIndex::new(from), NodeIndex::new(to), weight);
    }

    weighted_graph
}

fn set_spanning_tree_communities(
    spanning_tree: &UnGraph<Node, usize>,
    references: &mut HashMap<String, &mut OutputNode>,
) -> HashMap<NodeIndex, f64> {
    let mut visited = vec![false; spanning_tree.node_count()];
    let mut communities = HashMap::new();
    let mut community_index = 0;
    let communities_number = connected_components(spanning_tree);

    for node in spanning_tree.node_indices() {
        if visited[node.index()] {
            continue;
        }

        let mut dfs = Dfs::new(&spanning_tree, node);

        while let Some(next_node) = dfs.next(&spanning_tree) {
            if visited[next_node.index()] {
                continue;
            }
            visited[next_node.index()] = true;

            let id = &spanning_tree[next_node].id;
            if let Some(node) = references.get_mut(id) {
                if node.group == Group::Main as u32 {
                    continue;
                }
                node.group =
                    component_to_color((community_index + 1) as f64, communities_number as f64)
                        as u32;
            }

            communities.insert(next_node.id(), community_index as f64);
        }
        community_index += 1;
    }

    communities
}

fn graph_ascending_edge_indices(graph: &UnGraph<Node, usize>) -> Vec<petgraph::prelude::EdgeIndex> {
    let mut edge_refs: Vec<_> = graph.edge_references().collect();
    edge_refs.sort_by(|a, b| a.weight().cmp(b.weight()));
    edge_refs.iter().map(|edge| edge.id()).collect()
}

pub fn k_spanning_tree(graph: &DiGraph<Node, ()>, mut net: OutputNet, k: usize) -> OutputNet {
    // cambiamos los pesos de las aristas para valer |E|-peso (ya que usamos MIN_spanning_tree)
    let weighted_graph = get_graph_inverse_weights(graph);
    let spanning_tree_iter = min_spanning_tree(&weighted_graph);
    let mut spanning_tree = UnGraph::<Node, usize>::from_elements(spanning_tree_iter);
    let edge_indecies: Vec<_> = graph_ascending_edge_indices(&spanning_tree);

    if edge_indecies.len() > k {
        for &edge_index in edge_indecies.iter().take(k - 1) {
            spanning_tree.remove_edge(edge_index).unwrap();
        }
    }

    let mut references = net.get_node_mut_references();
    set_spanning_tree_communities(&spanning_tree, &mut references);

    net
}

#[cfg(test)]
mod tests {
    use crate::social_network::{
        community_detection::{k_spanning_tree, strongly_connected_components},
        input_net::InputNet,
        output_net::OutputNet,
        output_node::OutputNode,
    };

    #[test]
    fn if_two_nodes_are_in_two_separetes_strongly_connectec_components_then_it_should_return_they_are_in_different_groups(
    ) {
        // ejemplo: https://media.geeksforgeeks.org/wp-content/uploads/20230801122248/scc_fianldrawio.png
        // Node 2: Component A
        // Node 5: Component B

        let input = r#"{
            "nodes": ["1", "2", "3", "4", "5", "6", "7"],
            "edges": [
                ["1", "2"], 
                ["2", "3"], 
                ["2", "4"], 
                ["3", "4"], 
                ["3", "6"],
                ["4", "1"], 
                ["4", "5"], 
                ["5", "6"], 
                ["6", "7"],
                ["7", "5"]    
            ],
            "main_node": "1"
        }"#;
        let input_net: InputNet = serde_json::from_str(input).unwrap();
        let graph = input_net.into_graph();
        let output_net = OutputNet::from_graph(&graph);

        let output_net = strongly_connected_components(&graph, output_net);

        let group_node_2 = output_net
            .nodes
            .iter()
            .filter(|&node| node.id == "2")
            .collect::<Vec<&OutputNode>>()[0]
            .group;

        let group_node_5 = output_net
            .nodes
            .iter()
            .filter(|&node| node.id == "5")
            .collect::<Vec<&OutputNode>>()[0]
            .group;

        assert_ne!(group_node_2, group_node_5);
    }

    #[test]
    fn main_node_should_always_be_on_group_zero() {
        // ejemplo: https://media.geeksforgeeks.org/wp-content/uploads/20230801122248/scc_fianldrawio.png
        let input = r#"{
            "nodes": ["1", "2", "3", "4", "5", "6", "7"],
            "edges": [
                ["1", "2"], 
                ["2", "3"], 
                ["2", "4"], 
                ["3", "4"], 
                ["3", "6"],
                ["4", "1"], 
                ["4", "5"], 
                ["5", "6"], 
                ["6", "7"],
                ["7", "5"]    
            ],
            "main_node": "1"
        }"#;
        let input_net: InputNet = serde_json::from_str(input).unwrap();
        let graph = input_net.into_graph();
        let output_net = OutputNet::from_graph(&graph);

        let output_net = strongly_connected_components(&graph, output_net);

        let group_node_1 = output_net
            .nodes
            .iter()
            .filter(|&node| node.id == "1")
            .collect::<Vec<&OutputNode>>()[0]
            .group;

        assert_eq!(group_node_1, 0);
    }

    #[test]
    fn the_node_with_the_highest_weight_edge_should_not_be_in_the_same_group_as_main_node() {
        let input = r#"{
            "nodes": ["1", "2", "3", "4", "5", "6"],
            "edges": [
                ["2", "1"],
                ["2", "1"],
                ["2", "1"],
                ["2", "1"],
                ["2", "4"],
                ["2", "4"],
                ["4", "1"],
                ["3", "1"],
                ["3", "1"],
                ["3", "1"],
                ["5", "3"],
                ["6", "3"],
                ["6", "3"]
            ],
            "main_node": "1"
        }"#;
        let input_net: InputNet = serde_json::from_str(input).unwrap();
        let graph = input_net.into_graph();
        let output_net = OutputNet::from_graph(&graph);
        let k = 2;

        let output_net = k_spanning_tree(&graph, output_net, k);

        let group_node_2 = output_net
            .nodes
            .iter()
            .filter(|&node| node.id == "2")
            .collect::<Vec<&OutputNode>>()[0]
            .group;

        let group_node_1 = output_net
            .nodes
            .iter()
            .filter(|&node| node.id == "1")
            .collect::<Vec<&OutputNode>>()[0]
            .group;

        assert_ne!(group_node_2, group_node_1);
    }
}
