import React, { useState } from "react";
import ResponseErrorHandlingAndParsing from "../../server/utils/responseErrorHandling";
import NavigationBar from "../NavigationBar";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import async from "react-select/dist/declarations/src/async";

function CreateChatRoomForm() {
  const token = localStorage.getItem("token");
  const history = useHistory();

  const [name, setName] = useState<string>("");
  const [allowShare, setAllowShare] = useState<boolean>(false);

  let something = fetch("/api/users/").then((res) => console.log(res));

  console.log("hits");

  // async function createChatRoom() {
  //   const requestOptions = {
  //     method: "POST",
  //     headers: new Headers({
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     }),
  //     body: ResponseErrorHandlingAndParsing.returnStringifiedObject({
  //       name_of_chat_room: name,
  //       chat_room_is_shareable: allowShare == true ? 1 : 0,
  //     }),
  //   };

  // I had to do this because the fetch in this project is weird and it sucks a lot.
  // If you are messing around with this component make sure you switch the url to
  // https://dynamic-curriculum-on-heroku.herokuapp.com/api/chats/chatroom
  // Before you push to production

  async function createChatRoom() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: ResponseErrorHandlingAndParsing.returnStringifiedObject({
        name_of_chat_room: name,
        chat_room_is_shareable: allowShare == true ? 1 : 0,
      }),
    };

    // const req = new Request(
    //   "http://localhost:3000/api/chats/chatroom",
    //   requestOptions
    // );

    await fetch("/api/chats/chatroom", requestOptions).then(async (res) => {
      const response = new ResponseErrorHandlingAndParsing(res);
      const ifError = response.ifErrorStatusReturnError();
      const json = await response.json;

      if (ifError instanceof Error) {
        alert(response.returnMessage());
        console.log(ifError);
      } else {
        alert(response.returnMessage());
        alert("Now its time to add wrestlers!");
        history.push(`/invite/usertochatroom/${json.createdChatroomId}`);
      }
    });
  }

  return (
    <>
      <NavigationBar />
      <div>
        <h1 className="text-center">Create your chat room</h1>
        <div className="mx-2">
          <h3>1. name your chat room:</h3>
          <input
            type="text"
            className="ml-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <hr />
          <h3>
            2. Check the box if you would like to allow members to invite other
            users to the chatroom
          </h3>
          <input
            type="checkbox"
            className="ml-2"
            checked={allowShare}
            onChange={() => setAllowShare(!allowShare)}
          />
        </div>
        <div className="row">
          <Button
            onClick={createChatRoom}
            variant="success"
            className="w-75 mx-auto mt-3"
          >
            Confirm Creation
          </Button>
        </div>
      </div>
    </>
  );
}

export default CreateChatRoomForm;
