'use client'
import Box from '@mui/material/Box';
import { useCallback, useRef, useEffect, useState } from 'react';
import init, { SocialNetwork } from "wasm-lib";
import { ForceGraph3D } from 'react-force-graph';
import { useSelector } from "react-redux";
import { selectName, selectPhotos } from "@/store/FlickrUserSlice"
import axios from 'axios';
import { drawerWidth } from '../../components/SideBar';
import { useWindowSize } from '@react-hook/window-size';

const noGraphTitle = 'No encontramos una red'
const noGraphMessage = 'Para ver la red de un usuario de Flickr, necesitas ingresar ala sección de “Fotos” y buscar un usuario.'
const topMenuHeight = 50
const padding = 60

export default function Graph() {
  const fgRef = useRef();
  const [net, setNet] = useState({ nodes:[], links:[]})
  const username = useSelector(selectName)
  const photos = useSelector(selectPhotos)
  const [width, height] = useWindowSize();

  const getFavorites = async () => {
    if (photos.length === 0) return
    const photoIds = JSON.stringify(photos.map((photo) => photo.id))
    const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/favorites', {
      params: {
        username,
        photo_ids: photoIds,
      }
    })
    return response.data
  }

  useEffect(() => {
    init()
      .then(async () => {
        const inputNet = await getFavorites()
        const parsed_input = JSON.stringify(inputNet)
        const socialNetwork = new SocialNetwork()
        socialNetwork.set_net(parsed_input)
        const net = JSON.parse(socialNetwork.get_net())
        setNet(net)
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

  const graph = () => {
    return <ForceGraph3D
      ref={fgRef}
      graphData={net}
      nodeLabel="id"
      nodeAutoColorBy="group"
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1}
      onNodeClick={handleClick}
      width={width - drawerWidth - padding}
      height={height- topMenuHeight - padding}
    />
  }

  const noGraph = () => {
    return <div
      style={{
        position: 'absolute',
        left: `${(width - drawerWidth)/2 + drawerWidth}px`,
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <img
        src="imgs/lens.png"
        width={100}
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
      <h1 style={{ fontSize:30, textAlign: "center" }}>{noGraphTitle}</h1>
      <p style={{ textAlign: "center" }}>{noGraphMessage}</p>
    </div>
  }

  return (
    <div>
      { username ? graph() : noGraph() }
    </div>
  )
}
