import qs from "qs";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { authService } from "./fbase";
import {
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
} from "firebase/auth";

const Redirect = ({ setInit }) => {
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
  return <>Redirect</>;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false);
  const [user, setUser] = useState();

  const logoutHandler = () => {
    signOut(authService)
      .then(() => {
        alert("로그아웃하였습니다.");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    onAuthStateChanged(authService, (u) => {
      if (u) {
        setIsLoggedIn(true);
        setUser({
          id: u.uid,
          displayName: u.displayName,
          photoURL: u.photoURL,
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  {isLoggedIn ? (
                    <>
                      <img src={user.photoURL} />
                      <strong>{user.displayName}</strong>
                      <button type="button" onClick={logoutHandler}>
                        로그아웃
                      </button>
                    </>
                  ) : (
                    <a
                      href={`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`}>
                      카카오 로그인
                    </a>
                  )}
                </div>
              }
            />
            <Route path="/redirect" element={<Redirect setInit={setInit} />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <div>로딩중...</div>
      )}
    </>
  );
};

export default App;
