import React from "react";
import { useEffect, useState } from "react";
import ResponseErrorHandlingAndParsing from "../../server/utils/responseErrorHandling";
import ChatInterfaces from "./typesForChatroom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link, useHistory } from "react-router-dom";
import ChatRoomInvites from "./ChatRoomInvites";
import * as moment from "moment";

function UserChatRooms() {
  const token = localStorage.getItem("token");
  let history = useHistory();

  const [userChatRooms, setUserChatRooms] = useState<
    Array<ChatInterfaces["ChatRoomInterface"]>
  >([]);
  const [invites, setInvites] = useState<Array<InviteInterface>>([]);
  const [stateToRerenderInvites, setStateToRerenderInvites] =
    useState<number>(0);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch("/api/chats/chatrooms", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res) && res.length) {
          let chatRooms: typeof userChatRooms = res;
          chatRooms.sort(function (a, b) {
            const aDate = new Date(a.time_of_most_recent_message);
            const bDate = new Date(b.time_of_most_recent_message);
            // @ts-ignore
            return bDate - aDate;
          });
          setUserChatRooms(chatRooms);
        }
      });
  }, [invites]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(`api/chats/chatrooms/invites`, requestOptions)
      .then((res) => {
        let response = new ResponseErrorHandlingAndParsing(res);
        let ifError = response.ifErrorStatusReturnError();

        if (ifError instanceof Error) {
          alert(ifError);
        } else {
          return response.json;
        }
      })
      .then((res) => {
        if (res) {
          setInvites(res);
        } else {
          alert("there was an error getting your invites");
        }
      });
  }, [stateToRerenderInvites]);

  return (
    <>
      <ChatRoomInvites
        invites={invites}
        setStateToRerenderInvites={setStateToRerenderInvites}
      />
      <div className="row mb-3">
        <Button
          onClick={() => history.push("create/chatroom")}
          variant="success"
          className="w-75 mx-auto"
          style={{ fontSize: "calc(.7rem + .5vw)" }}
        >
          create chat room
        </Button>
      </div>
      {/*
      <div className="chat-rooms-grid">
        {userChatRooms.map((chatRoom: ChatInterfaces["ChatRoomInterface"]) => {
          let d = moment(chatRoom.time_of_most_recent_message).format(
            "M/DD h:mm a"
          );

          return (
            <Card key={`ChatRoomsHomePageMap ${chatRoom.id}`}>
              <Card.Body>
                <Card.Title>{chatRoom.name_of_chat_room}</Card.Title>
                <Card.Subtitle>
                  Last message: <small>{d}</small>
                </Card.Subtitle>
                <hr />
                <Card.Text></Card.Text>
                <Link to={`chatRoom/${chatRoom.id}`}>
                  <Button variant="primary">View</Button>
                </Link>
              </Card.Body>
            </Card>
          );
        })}
      </div>
      */}

      <table className="table table-primary">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Last Message</th>
            <th scope="col">View</th>
          </tr>
        </thead>
        <tbody>
          {userChatRooms.map((chatRoom) => {
            let d = moment(chatRoom.time_of_most_recent_message).format(
              "M/DD h:mm a"
            );
            return (
              <tr key={`table row for chatroom ${chatRoom.id}`}>
                <td>{chatRoom.name_of_chat_room}</td>
                <td>{d}</td>
                <td>
                  <Link to={`chatRoom/${chatRoom.id}`}>
                    <Button variant="primary">View</Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export interface InviteInterface {
  id: number;
  chat_room_id: number;
  user_id: number;
  time_last_viewed: string;
  user_invite_handled: number;
  user_is_active_in_chat: number;
  user_has_left_chat: number;
  created_at_in_utc: string;
  name_of_chat_room: string;
  chat_creator_user_id: number;
  chat_room_is_shareable: number;
  time_of_most_recent_message: string;
  chat_room_is_active: number;
  first_name: string;
  last_name: string;
  notes: string;
  phone_number: string;
  current_item_id: number;
}

export default UserChatRooms;
