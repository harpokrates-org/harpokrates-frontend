"use client";

import { selectId } from "@/store/FlickrUserSlice";
import { Avatar, Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PROFILE_PHOTO_SIZE = 48
const DESCRIPTION_LINES = 3

export default function UserProfile() {
  const userID = useSelector(selectId)
  const [userProfile, setUserProfile] = useState({
    username: '',
    realname: '',
    description: '',
    photo: '',
  })

  useEffect(() => {
    if (!userID) return
    axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/profile', {
      params: {
        user_id: userID,
      }
    }).then((response) => {
      setUserProfile(response.data)
    }).catch(() => {})
  }, [setUserProfile, userID])

  return (
    <Box>
      { userProfile.username !== '' ?
        <Box display="flex" marginBottom={2}>
          <Avatar
            alt={userProfile.username}
            src={userProfile.photo}
            sx={{ width: PROFILE_PHOTO_SIZE, height: PROFILE_PHOTO_SIZE }}
          />
          <Box marginLeft={2}>
            <Typography variant="h6" display="inline">
              {userProfile.realname}&nbsp;
            </Typography>
            <Typography variant="h7" color="textSecondary">
              {`@${userProfile.username}`}&nbsp;
            </Typography>
            <Typography variant="body1" style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: DESCRIPTION_LINES,
              WebkitBoxOrient: "vertical",
            }}>
              {userProfile.description}
            </Typography>
          </Box>
        </Box> :
        null
      }
    </Box>
  );
}
