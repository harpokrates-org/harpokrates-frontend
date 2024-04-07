use fdg_sim::{ForceGraph, ForceGraphHelper, Simulation, SimulationParameters};
use petgraph::graph::DiGraph;

use super::{node::Node, SocialNetwork};

struct Layout {
    graph: ForceGraph<(), ()>,
}

impl Layout {
    pub fn from_graph(graph: &DiGraph<Node, u32>) -> Self {
        let mut graph: ForceGraph<(), ()> = ForceGraph::default();

        Self { graph }
    }
}

#[cfg(test)]
mod tests {
    use petgraph::graph::DiGraph;

    use crate::social_network::{layout::Layout, node::Node, SocialNetwork};

    #[test]
    fn given_graph_it_should_return_a_layout() {}
}
