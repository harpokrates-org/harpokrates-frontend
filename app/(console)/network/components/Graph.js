"use client";
import {
  getUserFavorites,
  getUserName,
  getUserPhotos,
} from "@/app/api/UserAPI";
import {
  selectId,
  selectName,
  selectNetwork,
  selectNetworkIsUpdated,
  selectPhotos,
  setNetwork,
} from "@/store/FlickrUserSlice";
import {
  selectColor,
  selectDepth,
  selectModelName,
  selectSize,
} from "@/store/NetworkSlice";
import { useWindowSize } from "@react-hook/window-size";
import { useCallback, useEffect, useRef, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import { useDispatch, useSelector } from "react-redux";
import init, { SocialNetwork } from "wasm-lib";
import { drawerWidth } from "../../components/SideBar";
import { buildNet, loadUserWeights } from "../utils/net";
import { fetchModel, fetchUserPhotoSizes } from "@/app/libs/utils";

const photosPerFavorite = 1;
const mainPhotosCount = 12;
const topMenuHeight = 50;
const padding = 60;
const mainNodeColor = "blue";

export default function Graph() {
  const fgRef = useRef();
  const [net, setNet] = useState({ nodes: [], links: [] });
  const [wasmInitPromise, setWasmInitPromise] = useState(init());
  const username = useSelector(selectName);
  const userID = useSelector(selectId);

  const [photos, setPhotos] = useState(useSelector(selectPhotos));
  const network = useSelector(selectNetwork);
  const networkIsUpdated = useSelector(selectNetworkIsUpdated);

  const [width, height] = useWindowSize();
  const dispatch = useDispatch();

  const [socialNetwork, setSocialNetwork] = useState(null);
  const depth = useSelector(selectDepth);
  const size = useSelector(selectSize);
  const color = useSelector(selectColor);

  const [model, setModel] = useState();
  const modelName = useSelector(selectModelName);
  const [networkPhotos, setNetworkPhotos] = useState();

  useEffect(() => {
    const getPhotos = async (userID) => {
      if (photos.length > 0) return photos;
      const response = await getUserPhotos(userID, mainPhotosCount);
      const photoIDs = response.data.photos;
      setPhotos(photoIDs);
      return photoIDs;
    };

    const getFavorites = async (photos) => {
      const photoIDs = photos.map((photo) => photo.id);
      const response = await getUserFavorites(
        username,
        photoIDs,
        photosPerFavorite,
        depth
      );
      dispatch(setNetwork(response.data));
      return response.data;
    };

    const getSocialNetwork = async () => {
      wasmInitPromise
        .then(async () => {
          const photos = await getPhotos(userID);
          let inputNet = networkIsUpdated
            ? { ...network }
            : { ...(await getFavorites(photos)) };
          console.log("inputNet:", inputNet);
          inputNet.main_node = username;
          const parsed_input = JSON.stringify(inputNet);
          const socialNetwork = new SocialNetwork(parsed_input);
          setSocialNetwork(socialNetwork);
        })
        .catch((e) => {
          console.log(`Error al crear grafo en WASM: ${e}`);
        });
    };

    getSocialNetwork();
  }, [
    userID,
    photos,
    username,
    dispatch,
    wasmInitPromise,
    depth,
    network,
    networkIsUpdated,
  ]);

  useEffect(() => {
    const getNetworkPhotos = async (socialNetwork) => {
      if (!socialNetwork) return;
      const topUsers = JSON.parse(socialNetwork.get_top_users("degree", 20));
      const _networkPhotos = await Promise.all(
        topUsers.map(async (flickrUserName) => {
          try {
            const resUserName = await getUserName(flickrUserName);
            const userID = resUserName.data.id;
            const today = new Date().toJSON();
            const photoSizes = await fetchUserPhotoSizes(
              userID,
              "1970-01-01",
              today,
              "Medium"
            );
            const res = {
              userID: userID,
              flickrUserName: flickrUserName,
              photoSizes: photoSizes,
            };
            return res;
          } catch (err) {
            return {
              userID: userID,
              flickrUserName: userID,
              photoSizes: [],
            };
          }
        })
      );
      setNetworkPhotos(_networkPhotos);
    };
    getNetworkPhotos(socialNetwork)
  }, [socialNetwork]);

  useEffect(() => {
    const buildAndSetNet = async () => {
      if (!socialNetwork || !networkPhotos) return;
      const model = await fetchModel(modelName);
      const net = await buildNet(
        socialNetwork,
        size,
        color,
        model,
        networkPhotos
      );
      setNet(net);
    };
    buildAndSetNet().catch(console.error);
  }, [socialNetwork, networkPhotos, size, color, modelName]);

  const nodeColorHandler = (node) => {
    switch (node.group) {
      case 0:
        return mainNodeColor;
      default:
        return "#" + node.group.toString(16).padStart(6, "0");
    }
  };

  const handleClick = useCallback(
    (node) => {
      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        3000
      );
    },
    [fgRef]
  );

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
      height={height - topMenuHeight - padding}
    />
  );
}
