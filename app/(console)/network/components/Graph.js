'use client'
import Box from '@mui/material/Box';
import { useCallback, useRef } from 'react';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';

const data = {
  "nodes": [ 
      { 
        "id": "id1",
        "name": "name1",
        "val": 1,
        "group": 1,
      },
      { 
        "id": "id2",
        "name": "name2",
        "val": 10,
        "group": 1,
      },
      { 
        "id": "id3",
        "name": "name3",
        "val": 1,
        "group": 1,
      },
      { 
        "id": "id4",
        "name": "name3",
        "val": 1,
        "group": 2,
      },
      { 
        "id": "id5",
        "name": "name3",
        "val": 1,
        "group": 2,
      },
      { 
        "id": "id6",
        "name": "name3",
        "val": 1,
        "group": 1,
      },
  ],
  "links": [
      {
          "source": "id1",
          "target": "id2"
      },
      {
          "source": "id1",
          "target": "id3"
      },
      {
          "source": "id1",
          "target": "id4"
      },
      {
          "source": "id2",
          "target": "id5"
      },
      {
          "source": "id2",
          "target": "id6"
      },
      {
          "source": "id2",
          "target": "id3"
      },
      {
          "source": "id4",
          "target": "id6"
      },
  ]
}

export default function Graph() {
  const fgRef = useRef();

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
        graphData={data}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        onNodeClick={handleClick}
      />
    </Box>
  )
}
