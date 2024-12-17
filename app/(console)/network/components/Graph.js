"use client";
import {
  getUserFavorites,
  getUserName,
  getUserPhotos,
} from "@/app/api/UserAPI";
import { collectModels } from "@/app/libs/ModelCollection";
import { fetchModel, fetchUserPhotoSizes } from "@/app/libs/utils";
import {
  selectId,
  selectName,
  selectNetwork,
  selectNetworkIsUpdated,
  selectPhotoPredictions,
  selectPhotos,
  setNetwork,
} from "@/store/FlickrUserSlice";
import { selectModels } from "@/store/HarpokratesUserSlice";
import {
  selectColor,
  selectDepth,
  selectModelName,
  selectSize,
  selectSpanningTreeK,
  selectTopStegoUsersCounter,
} from "@/store/NetworkSlice";
import { Box, LinearProgress } from "@mui/material";
import { useWindowSize } from "@react-hook/window-size";
import { useCallback, useEffect, useRef, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import { useDispatch, useSelector } from "react-redux";
import init, { SocialNetwork } from "wasm-lib";
import { drawerWidth } from "../../components/SideBar";
import { NetBuilder } from "../utils/NetBuilder";
import ModelLoadError from "@/app/libs/ModelError";
import toast from "react-hot-toast";
import { appModelNames } from "@/app/libs/AppModelIndex";
const R = require("ramda");

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
  const spanningTreeK = useSelector(selectSpanningTreeK);
  const topStegoUsersCounter = useSelector(selectTopStegoUsersCounter);

  const modelName = useSelector(selectModelName);
  const photoPredictions = useSelector(selectPhotoPredictions);
  const [networkPhotos, setNetworkPhotos] = useState();

  const userModels = useSelector(selectModels);

  useEffect(() => {
    const getPhotos = async (userID) => {
      if (photos.length > 0) return photos;
      const data = await getUserPhotos(userID, mainPhotosCount);
      const photoIDs = data.photos;
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
            : {
                ...(await toast.promise(getFavorites(photos)),
                {
                  loading: "Construyendo la red en base a los favoritos",
                  success: "Red completa",
                  error: "Error al cargar la red",
                }),
              };
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

      console.log("topStegoUsersCounter", topStegoUsersCounter);

      let topUsers = [];
      if (color == "stego-count" || size == "stego-count") {
        topUsers = JSON.parse(
          socialNetwork.get_top_users("popularity", topStegoUsersCounter)
        );
      }

      const _networkPhotos = await toast.promise(
        Promise.all(
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
        ),
        {
          loading: "Descargando las fotos de los usuarios top",
          success: "Descarga completa",
          error: "Error al descargar las fotos",
        }
      );
      setNetworkPhotos(_networkPhotos);
    };
    getNetworkPhotos(socialNetwork);
  }, [socialNetwork, topStegoUsersCounter]);

  useEffect(() => {
    const getModel = async () => {
      try {
        const modelCollection = collectModels(userModels);
        return await fetchModel(modelCollection, modelName);
      } catch (error) {
        if (error instanceof ModelLoadError) {
          toast.error("No pudimos cargar el modelo");
          return appModelNames.NO_MODEL;
        }
      }
    };

    const buildAndSetNet = async () => {
      if (!socialNetwork || !networkPhotos) return;
      const model = await getModel();
      let pastPredictions =
        modelName in photoPredictions ? photoPredictions[modelName] : [];
      const net = await new NetBuilder().build(
        socialNetwork,
        size,
        color,
        spanningTreeK,
        model,
        networkPhotos,
        pastPredictions
      );
      setNet(net);
    };

    buildAndSetNet().catch(console.error);
  }, [socialNetwork, networkPhotos, size, color, spanningTreeK, modelName]);

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
    <Box>
      {net.nodes.length == 0 ? (
        <LinearProgress />
      ) : (
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
      )}
    </Box>
  );
}
