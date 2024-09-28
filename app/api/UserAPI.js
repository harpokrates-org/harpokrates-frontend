import axios from "axios";

export const getUserPhotoSizes = async (userID, count, minDate, maxDate) => {
  const user_photo_sizes_url =
    process.env.NEXT_PUBLIC_BACKEND_URL + `/user/${userID}/photos`;
  try {
    return await axios
      .get(user_photo_sizes_url, {
        params: {
          count,
          min_date: minDate,
          max_date: maxDate,
        },
      })
      .then((res) => res.data);
  } catch (err) {
    console.log(err);
    return { photos: [] };
  }
};

export const getUserPhotos = async (userID, count) => {
  try {
    return await axios
      .get(
        process.env.NEXT_PUBLIC_BACKEND_URL +
          `/photos?user_id=${userID}&per_page=${count}`
      )
      .then((res) => res.data);
  } catch (error) {
    console.log(error);
    return { photos: [] };
  }
};

export const getUserName = async (flickrUserName) => {
  const user_url = process.env.NEXT_PUBLIC_BACKEND_URL + "/user";
  try {
    return await axios.get(user_url, {
      params: {
        username: flickrUserName,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const getUserFavorites = async (
  username,
  photoIDs,
  photosPerFavorite,
  depth
) => {
  try {
    const photoIDsString = JSON.stringify(photoIDs);
    return await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + "/favorites", {
      params: {
        username,
        photo_ids: photoIDsString,
        photos_per_favorite: photosPerFavorite,
        depth,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const postLogin = async (email) => {
  try {
    return await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/login", {
      email: email,
    });
  } catch (error) {
    console.log(error);
  }
};

export const putPreferencies = async (email, model) => {
  try {
    return await axios
      .put(process.env.NEXT_PUBLIC_BACKEND_URL + "/preferencies", {
        email: email,
        preferencies: {
          model: model,
        },
      })
      .then((res) => res.data);
  } catch (error) {
    console.log(error);
    return { preferencies: {} };
  }
};

export const postModel = async (
  email,
  modelName,
  modelURL,
  modelImageSize,
  modelThreshold
) => {
  try {
    return await axios
      .post(process.env.NEXT_PUBLIC_BACKEND_URL + "/models", {
        email,
        modelName,
        modelURL,
        modelImageSize,
        modelThreshold,
      })
      .then((res) => res.data);
  } catch (error) {
    throw error;
  }
};

export const getUserModels = async (email) => {
  try {
    return await axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/models", {
        params: { email: email },
      })
      .then((res) => res.data);
  } catch (error) {
    throw error;
  }
};

export const deleteModel = async (email, modelID) => {
  try {
    return await axios
      .delete(process.env.NEXT_PUBLIC_BACKEND_URL + "/models", {
        params: { email, modelID },
      })
      .then((res) => res.data);
  } catch (err) {
    throw err;
  }
};
