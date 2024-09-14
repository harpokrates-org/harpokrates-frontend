import axios from "axios";

export const getUserPhotoSizes = async (userID, count, minDate, maxDate) => {
  const user_photo_sizes_url = process.env.NEXT_PUBLIC_BACKEND_URL + `/user/${userID}/photos`;
  try {
    return await axios.get(user_photo_sizes_url, {
      params: {
        count,
        min_date: minDate,
        max_date: maxDate,
      },
    })
  } catch (err) {
    console.log(err)
  }

};

export const getUserPhotos = async (userID, count) => {
  try {
    return await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL +
        `/photos?user_id=${userID}&per_page=${count}`
    );
  } catch (error) {
    console.log(error);
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
    console.log(err)
  }

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
    console.log(error)
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
