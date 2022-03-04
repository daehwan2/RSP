import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { authService } from "../fbase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Home from "../routes/Home";
import RedirectAuth from "../routes/RedirectAuth";
import Game from "../routes/Game";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false);
  const [user, setUser] = useState();

  const logoutHandler = () => {
    signOut(authService)
      .then(() => {})
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
          pick: "",
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <div className="relative h-[100vh] bg-[#FCF0CA] main-font">
      <div className="flex justify-between py-[5px] px-[15px] text-[20px]">
        <a href="/">RSP</a>
        <div>madeBy Daehwan2</div>
      </div>
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
            {isLoggedIn ? (
              <Route path="/games/:game_id" element={<Game user={user} />} />
            ) : (
              <Route
                path="/games/:game_id"
                element={<Home isGaming={true} />}
              />
            )}
            <Route
              path="/redirect"
              element={<RedirectAuth setInit={setInit} />}
            />
          </Routes>
        </BrowserRouter>
      ) : (
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-[30px]">
          로딩중...
        </div>
      )}
    </div>
  );
};

export default App;
