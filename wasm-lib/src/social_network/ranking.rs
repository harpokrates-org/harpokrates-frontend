use petgraph::{
    graph::{DiGraph, Graph},
    Directed, Direction, EdgeType, Undirected,
};

use crate::social_network::{node::Node, output_net::OutputNet};

pub fn degree(graph: &DiGraph<Node, ()>, net: OutputNet) -> OutputNet {
    let undirected_graph =
        <DiGraph<Node, ()> as Clone>::clone(graph).into_edge_type::<Undirected>();
    get_net_with_neighbors_as_val::<Undirected>(&undirected_graph, net, Direction::Incoming)
}

pub fn popularity(graph: &DiGraph<Node, ()>, net: OutputNet) -> OutputNet {
    get_net_with_neighbors_as_val::<Directed>(graph, net, Direction::Incoming)
}

pub fn follower(graph: &DiGraph<Node, ()>, net: OutputNet) -> OutputNet {
    get_net_with_neighbors_as_val::<Directed>(graph, net, Direction::Outgoing)
}

pub fn get_net_with_neighbors_as_val<T>(
    graph: &Graph<Node, (), T>,
    mut net: OutputNet,
    direction: Direction,
) -> OutputNet
where
    T: EdgeType,
{
    let mut references = net.get_node_mut_references();

    graph.node_indices().for_each(|i| {
        let id = &graph[i].id;
        if let Some(node) = references.get_mut(id) {
            node.val = graph.neighbors_directed(i, direction).count()
        }
    });
    net
}

pub fn match_ranking(graph: &DiGraph<Node, ()>, ranking_type: &str, net: OutputNet) -> OutputNet {
    match ranking_type {
        "degree" => degree(graph, net),
        "popularity" => popularity(graph, net),
        "follower" => follower(graph, net),
        &_ => net,
    }
}

#[cfg(test)]
mod tests {
    use crate::social_network::{
        input_net::InputNet,
        output_net::OutputNet,
        output_node::OutputNode,
        ranking::{follower, popularity},
    };

    use super::{degree, popularity, follower};

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
        assert_eq!(
            output_net
                .nodes
                .iter()
                .filter(|&node| node.id == "2" || node.id == "3")
                .collect::<Vec<&OutputNode>>()[0]
                .val,
            1
        );
    }

    #[test]
    fn should_count_node_popularity() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["1", "3"]],
            "main_node": "1"
        }"#;
        let input_net: InputNet = serde_json::from_str(input).unwrap();
        let graph = input_net.into_graph();
        let output_net = OutputNet::from_graph(&graph);

        let output_net = popularity(&graph, output_net);
        assert_eq!(
            output_net
                .nodes
                .iter()
                .filter(|&node| node.id == "1")
                .collect::<Vec<&OutputNode>>()[0]
                .val,
            0
        );
        assert_eq!(
            output_net
                .nodes
                .iter()
                .filter(|&node| node.id == "2" || node.id == "3")
                .collect::<Vec<&OutputNode>>()[0]
                .val,
            1
        );
    }

    #[test]
    fn should_count_node_follower() {
        let input = r#"{
            "nodes": ["1", "2", "3"],
            "edges": [["1", "2"], ["1", "3"]],
            "main_node": "1"
        }"#;
        let input_net: InputNet = serde_json::from_str(input).unwrap();
        let graph = input_net.into_graph();
        let output_net = OutputNet::from_graph(&graph);

        let output_net = follower(&graph, output_net);
        assert_eq!(
            output_net
                .nodes
                .iter()
                .filter(|&node| node.id == "1")
                .collect::<Vec<&OutputNode>>()[0]
                .val,
            2
        );
        assert_eq!(
            output_net
                .nodes
                .iter()
                .filter(|&node| node.id == "2" || node.id == "3")
                .collect::<Vec<&OutputNode>>()[0]
                .val,
            0
        );
    }
}
