import React from "react";

export default function Home({ isLoggedIn, user, logoutHandler }) {
  return (
    <div>
      {isLoggedIn ? (
        <div className="flex flex-col items-center">
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="flex justify-center items-center mb-[10px]">
              <img
                className="w-[50px] h-[50px] rounded-[50%] mr-[5px]"
                src={user.photoURL}
                alt="profileImage"
              />
              <strong className="text-[35px]">{user.displayName}</strong>
            </div>
            <div className="text-[24px] mb-[20px] text-center">
              12승 5패 3무
            </div>

            <a
              className="bg-[#C3B894] rounded-[12px] text-center p-[30px] text-[40px] whitespace-nowrap"
              href="/">
              방만들기
            </a>
          </div>

          <button
            className="absolute bottom-[30px] text-[20px]"
            type="button"
            onClick={logoutHandler}>
            로그아웃
          </button>
        </div>
      ) : (
        <>
          <a
            className="bg-[#FAE100] text-[30px] absolute bottom-[20px] left-[50%] translate-x-[-50%] px-[15px] py-[15px] rounded-[8px]"
            href={`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`}>
            카카오 로그인
          </a>
          <div className="text-[70px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] whitespace-nowrap text-center">
            <div>✊✌🖐</div>
            <div>가위바위보</div>
          </div>
        </>
      )}
    </div>
  );
}
