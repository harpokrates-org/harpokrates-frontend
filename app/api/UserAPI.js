import axios from "axios";

export const getUserPhotoSizes = async (username, count) => {
  return await axios.get(
    process.env.NEXT_PUBLIC_BACKEND_URL +
      `/user/${username}/photos?count=${count}`
  );
};

export const getUserName = async (flickrUserName) => {
  const user_url = process.env.NEXT_PUBLIC_BACKEND_URL + "/user";
  axios.get(user_url, {
    params: {
      username: flickrUserName,
    },
  });
};
