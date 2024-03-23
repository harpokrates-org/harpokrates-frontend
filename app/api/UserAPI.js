import axios from "axios";

export const getUserPhotoSizes = async (username, count) => {
  try {
    return await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL +
        `/user/${username}/photos?count=${count}`
    );
  } catch (error) {
    throw error;
  }
};

export const getUserName = async (flickrUserName) => {
  try {
    const user_url = process.env.NEXT_PUBLIC_BACKEND_URL + "/user";
    return await axios.get(user_url, {
      params: {
        username: flickrUserName,
      },
    });
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
