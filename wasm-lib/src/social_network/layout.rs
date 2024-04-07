use std::collections::HashMap;

use fdg_sim::{ForceGraph, ForceGraphHelper, Simulation, SimulationParameters};
use petgraph::{graph::DiGraph, visit::EdgeRef};

use super::node::Node;

struct Layout {
    simulation: Simulation<(), ()>,
}

impl Layout {
    pub fn from_graph(graph: &DiGraph<Node, ()>) -> Self {
        let mut forcegraph: ForceGraph<(), ()> = ForceGraph::default();
        let mut node_indexes = HashMap::new();

        graph.node_indices().for_each(|i| {
            let id = &graph[i].id;
            let index_fg = forcegraph.add_force_node(id.clone(), ());
            node_indexes.insert(id.clone(), index_fg);
        });

        graph.edge_references().for_each(|edge_ref| {
            let from = &graph[edge_ref.source()].id;
            let to = &graph[edge_ref.target()].id;
            forcegraph.add_edge(
                *node_indexes.get(from).unwrap(),
                *node_indexes.get(to).unwrap(),
                (),
            );
        });

        let simulation = Simulation::from_graph(forcegraph, SimulationParameters::default());
        Self { simulation }
    }

    pub fn run_simulation(&mut self, times: usize) -> HashMap<String, (f32, f32)> {
        for frame in 0..times {
            // update the nodes positions based on force algorithm
            self.simulation.update(0.035);
        }

        let mut coordinates = HashMap::new();
        for node in self.simulation.get_graph().node_weights() {
            coordinates.insert(node.name.clone(), (node.location.x, node.location.y));
        }
        coordinates
    }

    pub fn get_layout_from_graph(
        graph: &DiGraph<Node, ()>,
        times: usize,
    ) -> HashMap<String, (f32, f32)> {
        let mut layout = Self::from_graph(graph);
        layout.run_simulation(times)
    }
}

#[cfg(test)]
mod tests {
    use petgraph::graph::DiGraph;

    use crate::social_network::{group::Group, node::Node};

    use super::Layout;

    fn build_test_graph() -> DiGraph<Node, ()> {
        let mut graph = DiGraph::<Node, ()>::new();
        let idx_1 = graph.add_node(Node::new("1".to_string(), Group::Main));
        let idx_2 = graph.add_node(Node::new("2".to_string(), Group::Secondary));
        let idx_3 = graph.add_node(Node::new("3".to_string(), Group::Secondary));

        graph.add_edge(idx_1, idx_2, ());
        graph.add_edge(idx_2, idx_3, ());
        graph
    }

    #[test]
    fn given_graph_it_should_return_a_layout() {
        let graph = build_test_graph();
        let times = 10;

        let coordinates = Layout::get_layout_from_graph(&graph, times);

        assert_eq!(coordinates.keys().count(), 3);
        assert!(coordinates.get("1").is_some());

        print!("{:?}", coordinates);
    }
}
