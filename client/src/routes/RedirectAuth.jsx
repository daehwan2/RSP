import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../fbase";
import qs from "qs";
export default function RedirectAuth({ setInit }) {
  const code = new URL(window.location.href).searchParams.get("code");
  const navigate = useNavigate();

  const getTokenAndSignIn = async () => {
    const payload = qs.stringify({
      grant_type: "authorization_code",
      client_id: process.env.REACT_APP_REST_API_KEY,
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      code: code,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
    });
    try {
      // access token 가져오기
      const res = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        payload
      );
      console.log("res", res.data.access_token);
      const _res = await axios.post("/verifyToken", {
        token: res.data.access_token,
      });
      signInWithCustomToken(authService, _res.data.firebase_token)
        .then((userCredential) => {
          console.log(userCredential);
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
        });
      setInit(false);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    console.log(code);
    getTokenAndSignIn();
  }, []);
  return <>로그인중..</>;
}
