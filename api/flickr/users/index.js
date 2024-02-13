const axios = require('axios');
require('dotenv').config();

export async function getUserID(username) {
  res = await axios.get(`${process.env.BACKEND_URL}/user?username=${username}`)
  console.log(res)
}