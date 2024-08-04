use petgraph::graph::DiGraph;

use crate::social_network::{node::Node, output_net::OutputNet};

pub fn degree(graph: &DiGraph<Node, ()>, mut net: OutputNet) -> OutputNet {
    let mut references = net.get_node_mut_references();

    graph.node_indices().for_each(|i| {
        let id = &graph[i].id;
        if let Some(node) = references.get_mut(id) {
            node.val = graph.neighbors_undirected(i).count()
        }
    });
    net
}

#[cfg(test)]
mod tests {
    use crate::social_network::{
        input_net::InputNet, output_net::OutputNet, output_node::OutputNode,
    };

    use super::degree;

    #[test]
    fn should_count_node_degree() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["1", "3"]],
            "main_node": "1"
        }"#;
        let input_net: InputNet = serde_json::from_str(input).unwrap();
        let graph = input_net.into_graph();
        let output_net = OutputNet::from_graph(&graph);

        let output_net = degree(&graph, output_net);
        assert_eq!(
            output_net
                .nodes
                .iter()
                .filter(|&node| node.id == "1")
                .collect::<Vec<&OutputNode>>()[0]
                .val,
            2
        );
    }
}
