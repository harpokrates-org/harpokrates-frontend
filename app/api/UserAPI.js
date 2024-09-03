import axios from "axios";

export const getUserPhotoSizes = async (userID, count, minDate, maxDate) => {
  const user_photo_sizes_url = process.env.NEXT_PUBLIC_BACKEND_URL + `/user/${userID}/photos`;
  return axios.get(user_photo_sizes_url, {
    params: {
      count,
      min_date: minDate,
      max_date: maxDate,
    },
  })
};

export const getUserPhotos = async (userID, count) => {
  try {
    return await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL +
        `/photos?user_id=${userID}&per_page=${count}`
    );
  } catch (error) {
    throw error;
  }
};

export const getUserName = async (flickrUserName) => {
  const user_url = process.env.NEXT_PUBLIC_BACKEND_URL + "/user";
  return axios.get(user_url, {
    params: {
      username: flickrUserName,
    },
  });
};

export const getUserFavorites = async (username, photoIDs, photosPerFavorite, depth) => {
  try {
    const photoIDsString = JSON.stringify(photoIDs)
    return await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/favorites', {
      params: {
        username,
        photo_ids: photoIDsString,
        photos_per_favorite: photosPerFavorite,
        depth,
      }
    })
  } catch (error) {
    throw error;
  }
};

export const postLogin = async (email) => {
  try {
    return axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/login", {
      email: email,
    });
  } catch (error) {
    throw error;
  }
};
