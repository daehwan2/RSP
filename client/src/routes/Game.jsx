import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dbService } from "../fbase";
import { FaRegHandRock, FaRegHandPaper, FaRegHandPeace } from "react-icons/fa";
import { SiKakaotalk } from "react-icons/si";
import { useRef } from "react";

const Game = ({ user }) => {
  const { game_id } = useParams();
  const [init, setInit] = useState(false);
  const [host, setHost] = useState();
  const [guest, setGuest] = useState();
  const userIsHost = useRef();
  const [hostPick, setHostPick] = useState();
  const [guestPick, setGuestPick] = useState();
  const [hostReady, setHostReady] = useState(false);
  const [guestReady, setGuestReady] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [resultHost, setResultHost] = useState("");
  const [resultGuest, setResultGuest] = useState("");
  const navigate = useNavigate();
  const refSubmit = useRef();
  const deleteGame = async () => {
    try {
      await deleteDoc(doc(dbService, "games", game_id));
    } catch (err) {}
    navigate("/");
  };
  const getHostAndSetGuest = async () => {
    const querySnapshot = await getDocs(collection(dbService, "games"));
    querySnapshot.forEach((doc) => {
      if (doc.id === game_id) {
        setHost(doc.data().host);
        setGuest(doc.data().guest);
        setHostPick(doc.data().host.pick);
        if (doc.data().guest) setGuestPick(doc.data().guest.pick);

        if (doc.data().host.id !== user.id && doc.data().guest === null) {
          setDoc(doc.ref, { host: doc.data().host, guest: user });
          userIsHost.current = false;
        } else if (doc.data().host.id === user.id) {
          userIsHost.current = true;
        } else if (
          doc.data().host.id !== user.id &&
          doc.data().guest.id !== user.id
        ) {
          alert("방 인원이 가득 찼습니다");
          navigate("/");
        }
      }
    });
    setInit(true);
  };
  useEffect(() => {
    getHostAndSetGuest();
    onSnapshot(doc(dbService, "games", game_id), (doc) => {
      setHost(doc.data().host);
      setGuest(doc.data().guest);
      if (!doc.data().host) {
        alert("방장이 나갔습니다.");
        deleteGame();
      }
      if (doc.data().guest) {
        if (doc.data().guest.pick !== "") {
          setGuestReady(true);
        }
      }
      if (doc.data().host.pick !== "") {
        setHostReady(true);
        console.log("1");
      }
      if (doc.data().guest) {
        if (doc.data().guest.pick !== "" && doc.data().host.pick !== "") {
          console.log(
            `결과 : Host => ${doc.data().host.pick} Guest => ${
              doc.data().guest.pick
            }`
          );
        }
      }
    });
  }, []);

  useEffect(() => {
    console.log(hostPick);
    if (hostPick !== "" && guestPick !== "") {
      if (hostPick === "rock") {
        if (guestPick === "rock") {
          setResultHost("무승부");
          setResultGuest("무승부");
        } else if (guestPick === "scissors") {
          setResultHost("승리");
          setResultGuest("패배");
        } else if (guestPick === "paper") {
          setResultHost("패배");
          setResultGuest("승리");
        }
      } else if (hostPick === "scissors") {
        if (guestPick === "rock") {
          setResultHost("패배");
          setResultGuest("승리");
        } else if (guestPick === "scissors") {
          setResultHost("무승부");
          setResultGuest("무승부");
        } else if (guestPick === "paper") {
          setResultHost("승리");
          setResultGuest("패배");
        }
      } else if (hostPick === "paper") {
        if (guestPick === "rock") {
          setResultHost("승리");
          setResultGuest("패배");
        } else if (guestPick === "scissors") {
          setResultHost("패배");
          setResultGuest("승리");
        } else if (guestPick === "paper") {
          setResultHost("무승부");
          setResultGuest("부승부");
        }
      }
    }
  }, [hostPick, guestPick]);

  useEffect(() => {
    console.log(guestReady, hostReady);
    if (guestReady && hostReady) {
      if (hostPick === "rock") {
        if (guestPick === "rock") {
          setResultHost("무승부");
          setResultGuest("무승부");
        } else if (guestPick === "scissors") {
          setResultHost("승리");
          setResultGuest("패배");
        } else if (guestPick === "paper") {
          setResultHost("패배");
          setResultGuest("승리");
        }
      } else if (hostPick === "scissors") {
        if (guestPick === "rock") {
          setResultHost("패배");
          setResultGuest("승리");
        } else if (guestPick === "scissors") {
          setResultHost("무승부");
          setResultGuest("무승부");
        } else if (guestPick === "paper") {
          setResultHost("승리");
          setResultGuest("패배");
        }
      } else if (hostPick === "paper") {
        if (guestPick === "rock") {
          setResultHost("승리");
          setResultGuest("패배");
        } else if (guestPick === "scissors") {
          setResultHost("패배");
          setResultGuest("승리");
        } else if (guestPick === "paper") {
          setResultHost("무승부");
          setResultGuest("부승부");
        }
      }
      setResultVisible(true);
    }
  }, [guestReady, hostReady]);

  const refRock_H = useRef();
  const refScissors_H = useRef();
  const refPaper_H = useRef();
  const rockHandler_H = () => {
    if (!hostReady) {
      refRock_H.current.classList.add("text-[#F5934E]");
      refScissors_H.current.classList.remove("text-[#F5934E]");
      refPaper_H.current.classList.remove("text-[#F5934E]");
      setHostPick("rock");
    }
  };
  const scissorsHandler_H = () => {
    if (!hostReady) {
      refRock_H.current.classList.remove("text-[#F5934E]");
      refScissors_H.current.classList.add("text-[#F5934E]");
      refPaper_H.current.classList.remove("text-[#F5934E]");
      setHostPick("scissors");
    }
  };
  const paperHandler_H = () => {
    if (!hostReady) {
      refRock_H.current.classList.remove("text-[#F5934E]");
      refScissors_H.current.classList.remove("text-[#F5934E]");
      refPaper_H.current.classList.add("text-[#F5934E]");
      setHostPick("paper");
    }
  };

  const refRock_G = useRef();
  const refScissors_G = useRef();
  const refPaper_G = useRef();
  const rockHandler_G = () => {
    if (!guestReady) {
      refRock_G.current.classList.add("text-[#F5934E]");
      refScissors_G.current.classList.remove("text-[#F5934E]");
      refPaper_G.current.classList.remove("text-[#F5934E]");
      setGuestPick("rock");
    }
  };
  const scissorsHandler_G = () => {
    if (!guestReady) {
      refRock_G.current.classList.remove("text-[#F5934E]");
      refScissors_G.current.classList.add("text-[#F5934E]");
      refPaper_G.current.classList.remove("text-[#F5934E]");
      setGuestPick("scissors");
    }
  };
  const paperHandler_G = () => {
    if (!guestReady) {
      refRock_G.current.classList.remove("text-[#F5934E]");
      refScissors_G.current.classList.remove("text-[#F5934E]");
      refPaper_G.current.classList.add("text-[#F5934E]");
      setGuestPick("paper");
    }
  };

  const setPickFunc = async () => {
    const querySnapshot = await getDocs(collection(dbService, "games"));
    querySnapshot.forEach((doc) => {
      if (doc.id === game_id && userIsHost.current) {
        const host_obj = {
          ...doc.data().host,
          pick: hostPick,
        };
        setDoc(doc.ref, { host: host_obj, guest: doc.data().guest });
        setHostReady(true);
      } else if (doc.id === game_id && !userIsHost.current) {
        const guest_obj = {
          ...doc.data().guest,
          pick: guestPick,
        };
        setDoc(doc.ref, { host: doc.data().host, guest: guest_obj });
        setGuestReady(true);
      }
    });
  };
  const submitHandler = (e) => {
    setPickFunc();
  };
  const closeHandler = (e) => {
    deleteGame();
  };
  return (
    <div className="py-[40px]">
      {/* <div className="mb-[10px]">{game_id}번 방입니다.</div> */}
      {init && host ? (
        <div className="h-[230px]">
          <div className="flex justify-center items-center mb-[30px]">
            {userIsHost.current ? (
              <strong className="mr-[4px]">⭐Me</strong>
            ) : (
              <></>
            )}

            <img
              className="w-[50px] h-[50px] rounded-[50%] mr-[5px]"
              src={host.photoURL}
              alt="host"
            />
            <div className="text-[35px]">{host.displayName}</div>
          </div>
          {resultVisible ? (
            <div className="text-[50px] flex flex-col justify-center items-center">
              {hostPick === "rock" ? (
                <FaRegHandRock />
              ) : hostPick === "scissors" ? (
                <FaRegHandPeace />
              ) : hostPick === "paper" ? (
                <FaRegHandPaper />
              ) : (
                <></>
              )}
              <div>{resultHost}</div>
            </div>
          ) : userIsHost.current ? (
            <>
              <ul className="flex justify-around align-center">
                <li>
                  <button
                    className={
                      hostReady
                        ? hostPick === "rock"
                          ? "text-[80px] text-[#F5934E]"
                          : "text-[80px]"
                        : "text-[80px] hover:text-[#F5934E]"
                    }
                    ref={refRock_H}
                    onClick={rockHandler_H}
                    type="button">
                    <FaRegHandRock />
                  </button>
                </li>
                <li>
                  <button
                    className={
                      hostReady
                        ? hostPick === "scissors"
                          ? "text-[80px] text-[#F5934E]"
                          : "text-[80px]"
                        : "text-[80px] hover:text-[#F5934E]"
                    }
                    ref={refScissors_H}
                    onClick={scissorsHandler_H}
                    type="button">
                    <FaRegHandPeace />
                  </button>
                </li>
                <li>
                  <button
                    className={
                      hostReady
                        ? hostPick === "paper"
                          ? "text-[80px] text-[#F5934E]"
                          : "text-[80px]"
                        : "text-[80px] hover:text-[#F5934E]"
                    }
                    ref={refPaper_H}
                    onClick={paperHandler_H}
                    type="button">
                    <FaRegHandPaper />
                  </button>
                </li>
              </ul>
              {hostReady ? (
                <div className="flex justify-center items-center text-[30px] text-[#009288]">
                  <div>준비완료</div>
                </div>
              ) : (
                <></>
              )}
            </>
          ) : hostReady ? (
            <div className="flex justify-center items-center text-[30px] text-[#009288]">
              <div>준비완료</div>
            </div>
          ) : (
            <div className="flex justify-center items-center text-[30px] text-[#009288]">
              <div>선택중...</div>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}

      {init && guest ? (
        <>
          <div className="flex justify-center items-center mb-[30px]">
            {userIsHost.current ? (
              <></>
            ) : (
              <strong className="mr-[4px]">⭐Me</strong>
            )}
            <img
              className="w-[50px] h-[50px] rounded-[50%] mr-[5px]"
              src={guest.photoURL}
              alt="guest"
            />
            <div className="text-[35px]">{guest.displayName}</div>
          </div>
          {resultVisible ? (
            <div className="text-[50px] flex flex-col justify-center items-center">
              {guestPick === "rock" ? (
                <FaRegHandRock />
              ) : guestPick === "scissors" ? (
                <FaRegHandPeace />
              ) : guestPick === "paper" ? (
                <FaRegHandPaper />
              ) : (
                <></>
              )}
              <div>{resultGuest}</div>
            </div>
          ) : !userIsHost.current ? (
            <>
              <ul className="flex justify-around align-center">
                <li>
                  <button
                    className={
                      guestReady
                        ? guestPick === "rock"
                          ? "text-[80px] text-[#F5934E]"
                          : "text-[80px]"
                        : "text-[80px] hover:text-[#F5934E]"
                    }
                    ref={refRock_G}
                    onClick={rockHandler_G}
                    type="button">
                    <FaRegHandRock />
                  </button>
                </li>
                <li>
                  <button
                    className={
                      guestReady
                        ? guestPick === "scissors"
                          ? "text-[80px] text-[#F5934E]"
                          : "text-[80px]"
                        : "text-[80px] hover:text-[#F5934E]"
                    }
                    ref={refScissors_G}
                    onClick={scissorsHandler_G}
                    type="button">
                    <FaRegHandPeace />
                  </button>
                </li>
                <li>
                  <button
                    className={
                      guestReady
                        ? guestPick === "paper"
                          ? "text-[80px] text-[#F5934E]"
                          : "text-[80px]"
                        : "text-[80px] hover:text-[#F5934E]"
                    }
                    ref={refPaper_G}
                    onClick={paperHandler_G}
                    type="button">
                    <FaRegHandPaper />
                  </button>
                </li>
              </ul>
              {guestReady ? (
                <div className="flex justify-center items-center text-[30px] text-[#009288]">
                  <div>준비완료</div>
                </div>
              ) : (
                <></>
              )}
            </>
          ) : guestReady ? (
            <div className="flex justify-center items-center text-[30px] text-[#009288]">
              <div>준비완료</div>
            </div>
          ) : (
            <div className="flex justify-center items-center text-[30px] text-[#009288]">
              <div>선택중...</div>
            </div>
          )}
        </>
      ) : (
        <div className="h-[230px] flex flex-col justify-center items-center">
          <div className="text-center text-[30px] mb-[20px]">
            상대방 기다리는 중..
          </div>
          <button type="button">
            <SiKakaotalk className="text-center text-[50px]" />
          </button>
        </div>
      )}

      <button
        className="bg-[#FAE100] text-[30px] absolute bottom-[20px] left-[50%] translate-x-[-50%] px-[80px] py-[15px] rounded-[8px] whitespace-nowrap disabled:opacity-30"
        onClick={submitHandler}
        ref={refSubmit}
        disabled={
          userIsHost.current && hostReady
            ? true
            : !userIsHost.current && guestReady
            ? true
            : false
        }>
        내기
      </button>
      {resultVisible ? (
        <button
          className="absolute bottom-[20px] left-[50%] translate-x-[-50%] bg-[#FAE100] text-[30px] whitespace-nowrap px-[80px] py-[15px] rounded-[8px]"
          type="button"
          onClick={closeHandler}>
          나가기
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Game;
