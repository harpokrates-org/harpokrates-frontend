'use client'
import { useCallback, useRef, useEffect, useState } from 'react';
import init, { SocialNetwork } from "wasm-lib";
import { ForceGraph2D } from 'react-force-graph';
import { useDispatch, useSelector } from "react-redux";
import { selectId, selectName, selectPhotos, setPhotos } from "@/store/FlickrUserSlice"
import { drawerWidth } from '../../components/SideBar';
import { useWindowSize } from '@react-hook/window-size';
import { getUserFavorites, getUserPhotos } from '@/app/api/UserAPI';
import { selectGraphConfig } from '@/store/HarpokratesUserSlice';

const photosPerFavorite = 1
const mainPhotosCount = 12
const topMenuHeight = 50
const padding = 60
const mainNodeColor = 'red'
const secondaryNodeColor = 'gray'

export default function Graph() {
  const fgRef = useRef();
  const [net, setNet] = useState({ nodes:[], links:[]})
  const [wasmInitPromise, setWasmInitPromise] = useState(init())
  const username = useSelector(selectName)
  const userID = useSelector(selectId)
  const photos = useSelector(selectPhotos)
  const [width, height] = useWindowSize();
  const dispatch = useDispatch()
  const graphConfig = useSelector(selectGraphConfig);
  const depth = graphConfig.depth;


  useEffect(() => {
    const getFavorites = async (photos) => {
      const photoIDs = photos.map((photo) => photo.id)
      const response = await getUserFavorites(username, photoIDs, photosPerFavorite, depth)
      return response.data
    }

    const getPhotos = async (userID) => {
      if (photos.length > 0) return photos
      const response = await getUserPhotos(userID, mainPhotosCount)
      const photoIDs = response.data.photos
      dispatch(setPhotos(photoIDs))
      return photoIDs
    }

    wasmInitPromise
      .then(async () => {
        const photos = await getPhotos(userID)
        const inputNet = await getFavorites(photos)
        inputNet.main_node = username
        const parsed_input = JSON.stringify(inputNet)
        const socialNetwork = new SocialNetwork(parsed_input)
        const net = JSON.parse(socialNetwork.get_net())
        setNet(net)
      })
      .catch((e) => {
        console.log(`Error al crear grafo en WASM: ${e}`)
      });
  }, [photos, username, dispatch, userID, wasmInitPromise, depth])

  const nodeColorHandler = node => {
    switch (node.group) {
      case 0:
        return mainNodeColor;
      default:
        return "#" + node.group.toString(16).padStart(6, '0');
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
      // onNodeClick={handleClick}
      width={width - drawerWidth - padding}
      height={height- topMenuHeight - padding}
    />
  )
}
