import React from "react";

export default function Home({ isLoggedIn, user, logoutHandler }) {
  return (
    <div className="h-[100vh] bg-[#FCF0CA]">
      {isLoggedIn ? (
        <div className="h-[100%] flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-[10px]">
              <img
                className="w-[50px] h-[50px] rounded-[50%] mr-[5px]"
                src={user.photoURL}
              />
              <strong className="text-[35px]">{user.displayName}</strong>
            </div>
            <div className="text-[24px] mb-[20px]">12승 5패 3무</div>

            <a
              className="bg-[#C3B894] rounded-[12px] text-center p-[30px] text-[40px]"
              href="">
              방만들기
            </a>

            <button
              className="absolute bottom-[30px] text-[20px]"
              type="button"
              onClick={logoutHandler}>
              로그아웃
            </button>
          </div>
        </div>
      ) : (
        <a
          href={`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`}>
          카카오 로그인
        </a>
      )}
    </div>
  );
}
