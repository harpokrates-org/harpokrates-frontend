'use client'
import Box from '@mui/material/Box';
import { useCallback, useRef, useEffect, useState } from 'react';
import init, { SocialNetwork } from "wasm-lib";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';

const exampleNet = {
  nodes: [
      'ana',
      'brian',
      'carolina',
      'daniel',
      'emilia'
  ],
  edges: [
      ['ana', 'brian'],
      ['ana', 'carolina'],
      ['carolina', 'daniel'],
      ['carolina', 'brian'],
      ['brian', 'emilia'],
  ]
}

export default function Graph() {
  const fgRef = useRef();
  const [net, setNet] = useState()

  useEffect(() => {
    init()
      .then(() => {
        const parsed_input = JSON.stringify(exampleNet)
        const socialNetwork = new SocialNetwork()
        socialNetwork.set_net(parsed_input)
        const net = JSON.parse(socialNetwork.get_net())
        setNet(net)
        console.log(net)
      })
      .catch((e) => {
        console.log(`Error al crear grafo en WASM: ${e}`)
      });
  }, [])

  const handleClick = useCallback(node => {
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    fgRef.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
      node,
      3000
    );
  }, [fgRef]);

  return (
    <Box>
      <ForceGraph3D
        ref={fgRef}
        graphData={net}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        onNodeClick={handleClick}
      />
    </Box>
  )
}
