import React, { useEffect, useState } from "react";
import ResponseErrorHandlingAndParsing from "../../server/utils/responseErrorHandling";

function GetAllUsersInChat({
  show,
  users,
}: {
  show: boolean;
  users: UsersInChatInterface[];
}) {
  return (
    <>
      {Array.isArray(users) && users.length ? (
        users.map((user) => {
          return (
            <div key={`showAllUsersInChat${user.user_id}`}>
              {user.first_name ? user.first_name : ""}{" "}
              {user.last_name ? user.last_name : ""}
            </div>
          );
        })
      ) : (
        <small>Users not showing</small>
      )}
    </>
  );
}

export default GetAllUsersInChat;

interface UsersInChatInterface {
  user_id: number;
  first_name: string;
  last_name: string;
}
