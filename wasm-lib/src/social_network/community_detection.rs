use petgraph::{
    algo::tarjan_scc,
    graph::DiGraph,
};

use crate::social_network::{group::Group, node::Node, output_net::OutputNet};

const MIN_COMPONENT_LEN: usize = 2;
const GREY_COLOR_IN_DECIMAL: u32 = 10526880;

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

#[cfg(test)]
mod tests {
    use crate::social_network::{
        community_detection::strongly_connected_components, input_net::InputNet,
        output_net::OutputNet, output_node::OutputNode,
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
}
