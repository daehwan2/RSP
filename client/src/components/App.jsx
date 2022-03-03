import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { authService } from "../fbase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Home from "../routes/Home";
import RedirectAuth from "../routes/RedirectAuth";
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
                <Home
                  isLoggedIn={isLoggedIn}
                  user={user}
                  logoutHandler={logoutHandler}
                />
              }
            />
            <Route
              path="/redirect"
              element={<RedirectAuth setInit={setInit} />}
            />
          </Routes>
        </BrowserRouter>
      ) : (
        <div>로딩중...</div>
      )}
    </>
  );
};

export default App;
