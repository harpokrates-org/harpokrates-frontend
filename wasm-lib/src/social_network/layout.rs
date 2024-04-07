use fdg_sim::ForceGraph;
use petgraph::graph::DiGraph;

use super::node::Node;

struct Layout {
    graph: ForceGraph<(), ()>,
}

impl Layout {
    pub fn from_graph(_graph: &DiGraph<Node, u32>) -> Self {
        let graph: ForceGraph<(), ()> = ForceGraph::default();

        Self { graph }
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn given_graph_it_should_return_a_layout() {}
}
