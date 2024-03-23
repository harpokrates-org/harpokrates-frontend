'use client'
import { useCallback, useRef, useEffect, useState } from 'react';
import init, { SocialNetwork } from "wasm-lib";
import { ForceGraph2D, ForceGraph3D } from 'react-force-graph';
import { useSelector } from "react-redux";
import { selectName, selectPhotos } from "@/store/FlickrUserSlice"
import axios from 'axios';
import { drawerWidth } from '../../components/SideBar';
import { useWindowSize } from '@react-hook/window-size';

const photosPerFavorite = 1
const topMenuHeight = 50
const padding = 60
const mainNodeColor = 'red'
const secondaryNodeColor = 'gray'

export default function Graph() {
  const fgRef = useRef();
  const [net, setNet] = useState({ nodes:[], links:[]})
  const username = useSelector(selectName)
  const photos = useSelector(selectPhotos)
  const [width, height] = useWindowSize();

  useEffect(() => {
    const getFavorites = async () => {
      if (photos.length === 0) return
      const photoIds = JSON.stringify(photos.map((photo) => photo.id))
      const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/favorites', {
        params: {
          username,
          photo_ids: photoIds,
          photos_per_favorite: photosPerFavorite,
        }
      })
      return response.data
    }

    init()
      .then(async () => {
        const inputNet = await getFavorites()
        inputNet.main_node = username
        const parsed_input = JSON.stringify(inputNet)
        const socialNetwork = new SocialNetwork()
        socialNetwork.set_net(parsed_input)
        const net = JSON.parse(socialNetwork.get_net())
        setNet(net)
      })
      .catch((e) => {
        console.log(`Error al crear grafo en WASM: ${e}`)
      });
  }, [photos, username])

  const nodeColorHandler = node => {
    switch (node.group) {
      case 1:
        return mainNodeColor;
      default:
        return secondaryNodeColor;
    }
  };

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
    <ForceGraph2D
      ref={fgRef}
      graphData={net}
      nodeLabel="id"
      nodeColor={nodeColorHandler}
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1}
      onNodeClick={handleClick}
      width={width - drawerWidth - padding}
      height={height- topMenuHeight - padding}
    />
  )
}
