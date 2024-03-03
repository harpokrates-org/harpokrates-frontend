'use client'
import Box from '@mui/material/Box';
import { useCallback, useRef, useEffect, useState } from 'react';
import init, { SocialNetwork } from "wasm-lib";
import { ForceGraph3D } from 'react-force-graph';
import { useSelector } from "react-redux";
import { selectName, selectPhotos } from "@/store/FlickrUserSlice"

export default function Graph() {
  const fgRef = useRef();
  const [net, setNet] = useState()

  const getFavorites = async () => {
    const username = useSelector(selectName)
    const photos = useSelector(selectPhotos)
    if (photos.length === 0) return
    const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/favorites', {
      params: {
        username,
        photo_ids: [photos[0].id],
      }
    })
    setNet(response.data)
  }

  useEffect(() => {
    getFavorites().then(() => {
      init()
        .then(() => {
          const parsed_input = JSON.stringify(net)
          const socialNetwork = new SocialNetwork()
          socialNetwork.set_net(parsed_input)
          const net = JSON.parse(socialNetwork.get_net())
          setNet(net)
          console.log(net)
        })
        .catch((e) => {
          console.log(`Error al crear grafo en WASM: ${e}`)
        });
      })
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
