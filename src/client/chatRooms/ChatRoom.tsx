import React, { useEffect, useState } from "react";
import GetAllUsersInChat from "./GetAllUsersInChat";
import * as moment from "moment";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { AiOutlineUserAdd } from "react-icons/ai";
import ChatInterfaces from "./typesForChatroom";
import ResponseErrorHandlingAndParsing from "../../server/utils/responseErrorHandling";
import { FaUsers } from "react-icons/fa";
import "./chatRoomStyles.scss";
import arraysAreEqual from "../utils/arraysEqual";
import arraysEqual from "../utils/arraysEqual";

function ChatRoom() {
  const token = localStorage.getItem("token");
  let { chatRoomId } = useParams<{ chatRoomId: string }>();
  const UID = localStorage.getItem("UID");

  // States
  const [chatRoomInfo, setChatRoomInfo] = useState<
    Record<string, any> | ChatRoomInfoInterface
  >({});
  const [windowScrolled, setWindowScrolled] = useState<boolean>(false);
  const [chats, setChats] = useState<Array<ChatFetchReturn>>([]);
  const [usersName, setUsersName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [rerenderAfterMessageSend, setRerenderAfterMessageSendMessageSend] =
    useState(0);
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const [usersInChatRoom, setUsersInChatRoom] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRerenderAfterMessageSendMessageSend((prev) => prev + 1);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  async function makeChat(message: string, chatRoomId: number) {
    let body = ResponseErrorHandlingAndParsing.returnStringifiedObject({
      chatRoomId: chatRoomId,
      chatMessage: message,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    };
    await fetch(`/api/chats/chatroom/newChat`, requestOptions).then((res) => {
      let response = new ResponseErrorHandlingAndParsing(res);
      let ifError = response.ifErrorStatusReturnError();
      let message = response.returnMessage();

      if (ifError instanceof Error) {
        console.log(ifError);
        alert(response.returnMessage());
      } else {
        // this causes a refetch of the chats
        setWindowScrolled(false);
        setRerenderAfterMessageSendMessageSend(rerenderAfterMessageSend + 1);
        setMessage("");

        // toast("Message Sent");
      }
    });
  }

  useEffect(() => {
    if (!chatRoomId) return;

    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(`/api/chats/chatroom/${chatRoomId}`, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          if (Array.isArray(res) && res.length) {
            for (let index = 0; index < res.length; index++) {
              const element: ChatFetchReturn = res[index];
              if (element.from_user_id == Number(UID)) {
                setUsersName(`${element.first_name} ${element.last_name}`);
                break;
              } else {
                continue;
              }
            }
          }

          const arraysAreEqual = Array.isArray(res)
            ? arraysEqual(res, chats)
            : true;

          // this is so we only move the view to the bottom if there is a new chat or if the chats havent been loaded yet
          if (!arraysAreEqual) {
            setChats(res);
            setWindowScrolled(false);
          } else {
            return;
          }
        });
    } catch (err) {
      alert("error fetching messages");
      console.log(err);
    }
  }, [chatRoomId, rerenderAfterMessageSend]);

  useEffect(() => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(`/api/chats/chatroominfo/${chatRoomId}`, requestOptions)
        .then((res) => {
          const response = new ResponseErrorHandlingAndParsing(res);
          const ifError = response.ifErrorStatusReturnError();

          if (ifError instanceof Error) {
            throw ifError;
          } else {
            return response.json;
          }
        })
        .then((res) => {
          setChatRoomInfo(res);
        });
    } catch (err) {
      alert("error fetching messages");
      console.log(err);
    }

    return () => {
      setChatRoomInfo({});
    };
  }, []);

  // Get all users in this chat room
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(`/api/chats/chatroom/users/${chatRoomId}`, requestOptions)
      .then((res) => {
        let response = new ResponseErrorHandlingAndParsing(res);
        return response.json;
      })
      .then((json) => {
        setUsersInChatRoom(json);
      });

    return () => {
      setUsersInChatRoom([]);
    };
  }, [chatRoomId]);

  const booleanForAllowShare = (object: typeof chatRoomInfo) => {
    if (Number(UID) != Number(object.chat_creator_user_id)) {
      return Object.keys(object).length && object.chat_room_is_shareable;
    } else {
      return true;
    }
  };

  return (
    <>
      <div className="jumbotron m-0 p-0 bg-transparent">
        <div className="row m-0 p-0 position-relative">
          <div
            className="col-12 p-0 m-0 position-absolute"
            style={{ right: "0px" }}
          >
            <div
              className="card border-0 rounded"
              style={{
                boxShadow:
                  "0 2px 4px 0 rgba(0, 0, 0, 0.10), 0 6px 10px 0 rgba(0, 0, 0, 0.01)",
                overflow: "hidden",
                height: "100vh",
              }}
            >
              <div
                className="card-header p-1 bg-light border border-top-0 border-left-0 border-right-0"
                style={{ color: "rgba(96, 125, 139,1.0)" }}
              >
                {/*<img
                className="rounded float-left"
                style={{ width: "50px", height: "50px" }}
                src="https://i.pinimg.com/736x/5c/24/69/5c24695df36eee73abfbdd8274085ecd--cute-anime-guys-anime-boys.jpg"
              />*/}
                <h6
                  className="float-left"
                  style={{ margin: "0px", marginLeft: "10px" }}
                >
                  {" "}
                  {usersName} <br />
                  <small>Team Dynamic</small>
                </h6>

                <h6
                  className="float-left"
                  style={{
                    margin: "0px",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowUsers(!showUsers)}
                >
                  <small>
                    {" "}
                    <FaUsers />
                  </small>{" "}
                  {showUsers ? "^" : `${usersInChatRoom.length}+`}
                  {showUsers ? (
                    <GetAllUsersInChat
                      users={usersInChatRoom}
                      show={showUsers}
                    />
                  ) : null}
                </h6>
                {booleanForAllowShare(chatRoomInfo) ? (
                  <Link
                    to={`/invite/usertochatroom/${chatRoomId}`}
                    className=" float-right mx-1"
                    style={{ cursor: "pointer" }}
                  >
                    <AiOutlineUserAdd />
                  </Link>
                ) : null}

                <Link
                  to="/chat"
                  className=" float-right mr-2"
                  style={{ cursor: "pointer" }}
                >
                  &lt; Go back
                </Link>
              </div>
              {/* start of messages */}
              {/* You will need to make conditionals for the balan and the float-left or float-right class names*/}
              <div
                className="card bg-sohbet border-0 m-0 p-0"
                style={{ height: "80vh" }}
              >
                <div
                  id="sohbet"
                  className="card border-0 m-0 p-0 position-relative bg-transparent text-container"
                  onScroll={() => setWindowScrolled(true)}
                  style={{
                    overflowY: "auto",
                    height: "100vh",
                    overscrollBehaviorY: "contain",
                    scrollSnapType: `${windowScrolled ? "" : "y mandatory"}`,
                  }}
                >
                  {chats.map((chat, index: number, array) => {
                    let d = moment(chat.created_at_in_utc).format(
                      "M/DD h:mm a"
                    );

                    if (chat?.from_user_id == Number(UID)) {
                      return (
                        <div
                          key={`user message ${chat.id}`}
                          className="balon1 p-2 m-0 position-relative"
                          data-is={`${chat.first_name} ${chat.last_name} - ${d}`}
                        >
                          <a className="float-right sohbet1">
                            {chat.message_body}
                          </a>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={`user message ${chat.id}`}
                          className="balon2 p-2 m-0 position-relative"
                          data-is={`${chat.first_name} ${chat.last_name} - ${d}`}
                        >
                          <a className="float-left sohbet2">
                            {chat.message_body}
                          </a>
                        </div>
                      );
                    }
                  })}
                  <div
                    className="p-2 m-0 position-relative"
                    data-is=""
                    style={{ scrollSnapAlign: "end" }}
                  >
                    <a className="float-left"></a>
                  </div>
                </div>
              </div>

              {/* End of Messages */}

              <div className="w-100 card-footer p-0 bg-light border border-bottom-0 border-left-0 border-right-0">
                <div className="m-0 p-0">
                  <div className="d-flex align-items-center m-0 p-0">
                    <div className="col-9 m-0 p-1">
                      <textarea
                        onChange={(e) => {
                          setMessage(e.target.value);
                        }}
                        style={{ resize: "none" }}
                        key={"pleaseAutoFocusMessageBox"}
                        autoFocus
                        value={message}
                        id="text"
                        className="mw-100 border rounded form-control"
                        name="text"
                        title="Type a message..."
                        placeholder="Please be respectful in all chat rooms, we expect you all to set a good example as a leader"
                        required
                      />
                    </div>
                    <div className="col-3 m-0 p-1">
                      <button
                        className="btn btn-outline-secondary rounded border w-100"
                        title="Gönder!"
                        style={{ paddingRight: "16px" }}
                        onClick={() => {
                          makeChat(message, Number(chatRoomId));
                        }}
                      >
                        Send
                        <i className="fa fa-paper-plane" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatRoom;

export interface ChatFetchReturn {
  id: number;
  chat_room_id: number;
  from_user_id: number;
  message_body: string;
  message_is_active: number;
  created_at_in_utc: string;
  first_name: string;
  last_name: string;
  name_of_chat_room: string;
  time_of_most_recent_message: Date;
  chat_room_is_active: number;
}

interface ChatRoomInfoInterface {
  id: number;
  name_of_chat_room: string;
  chat_creator_user_id: number;
  chat_room_is_shareable: number;
  time_of_most_recent_message: string;
  created_at_in_utc: string;
  chat_room_is_active: number;
}
