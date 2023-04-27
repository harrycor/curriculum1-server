import React, { useEffect } from "react";
import ChatInterfaces from "./typesForChatroom";
import UserChatRooms from "./UserChatRooms";
import NavigationBar from "../NavigationBar";
import "./chatStyles.scss";

interface propInterface {}

function ChatComponent(props: propInterface) {
  return (
    <>
      <NavigationBar />
      <div>
        <UserChatRooms />
      </div>
    </>
  );
}

export default ChatComponent;
