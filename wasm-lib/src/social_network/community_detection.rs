use petgraph::{algo::tarjan_scc, graph::DiGraph};

use crate::social_network::{group::Group, node::Node, output_net::OutputNet};
pub fn strongly_connected_components(graph: &DiGraph<Node, ()>, mut net: OutputNet) -> OutputNet {
    let mut references = net.get_node_mut_references();

    let components = tarjan_scc(graph);

    for (i, component) in components.iter().enumerate() {
        for node_idx in component {
            let id = &graph[*node_idx].id;
            if let Some(node) = references.get_mut(id) {
                if node.group != Group::Main as u8 {
                    node.group = (i + 1) as u8;
                }
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
    fn if_two_nodes_are_in_two_separetes_strongly_connectec_components_then_it_should_return_they_are_in_different_groups() {
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

        let group_2 = output_net
            .nodes
            .iter()
            .filter(|&node| node.id == "2")
            .collect::<Vec<&OutputNode>>()[0]
            .group;

        let group_5 = output_net
            .nodes
            .iter()
            .filter(|&node| node.id == "5")
            .collect::<Vec<&OutputNode>>()[0]
            .group;

        assert_ne!(group_2, group_5);
    }

    #[test]
    fn main_node_should_always_be_on_group_1() {
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

        let group_1 = output_net
            .nodes
            .iter()
            .filter(|&node| node.id == "1")
            .collect::<Vec<&OutputNode>>()[0]
            .group;

        assert_eq!(group_1, 1);
    }
}
