import React from "react";

export default function Home({ isLoggedIn, user, logoutHandler }) {
  return (
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
  );
}
