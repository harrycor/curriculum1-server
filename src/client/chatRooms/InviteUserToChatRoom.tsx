import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import ResponseErrorHandlingAndParsing from "../../server/utils/responseErrorHandling";
import NavigationBar from "../NavigationBar";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import SelectDropDownForAllWrestlersOnTennant from "../reusableComponents/selectDropDownForAllWrestlersOnTennant";

function InviteUserToChatRoom() {
  const token = localStorage.getItem("token");

  const history = useHistory();

  const { id } = useParams<{ id: string }>();
  const [invites, setInvites] = useState<Array<UserInterface>>([]);

  function addUserToInvitesArray(user: UserInterface) {
    setInvites((prev) => [...prev, user]);
  }

  function deleteUserById(userId: number) {
    const filteredArray = invites.filter((user: UserInterface) => {
      return user.user_id != userId;
    });

    setInvites(filteredArray);
  }

  async function inviteUsers() {
    const arrayOfIds = invites.map((user) => user.user_id);

    const body = ResponseErrorHandlingAndParsing.returnStringifiedObject({
      chatRoomId: Number(id),
      userIdsToInvite: arrayOfIds,
    });

    // const requestOptions = {
    //   method: "POST",
    //   headers: new Headers({
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   }),
    //   body,
    // };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    };
    // I had to do this because the fetch in this project is weird and it sucks a lot.
    // If you are messing around with this component make sure you switch the url to
    // https://dynamic-curriculum-on-heroku.herokuapp.com/api/chats/chatroom
    // Before you push to production

    // const req = new Request(
    //   "http://localhost:3000/api/chats/chatroom/inviteUsers",
    //   requestOptions
    // );

    try {
      await fetch("/api/chats/chatroom/inviteUsers", requestOptions).then(
        (res) => {
          const response = new ResponseErrorHandlingAndParsing(res);
          const ifError = response.ifErrorStatusReturnError();

          if (ifError instanceof Error) {
            alert(response.returnMessage());
            throw ifError;
          } else if (response.returnMessage() == "content not modified") {
            history.push("/chat");
          } else {
            alert(response.returnMessage());
            history.push(`/chatroom/${id}`);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <NavigationBar />
      <h3 className="text-center my-3">
        {" "}
        You can add multiple wrestlers at once and come back to this page at any
        time
      </h3>
      <div className="mx-2">
        <SelectDropDownForAllWrestlersOnTennant
          className=""
          callBackFunction={addUserToInvitesArray}
        />
        <div className="row">
          <Button
            onClick={inviteUsers}
            variant="success"
            className="w-75 mx-auto mt-3"
          >
            Send Invites
          </Button>
        </div>
      </div>
      <div className="d-flex">
        {invites.map((user: UserInterface) => {
          return (
            <div
              className="m-2 p-2"
              key={`WrestlerInviteKey:${user.id}`}
              style={{ backgroundColor: "ghostwhite" }}
            >
              <div>
                <small>
                  {user.first_name} {user.last_name}
                </small>
                <button
                  style={{ all: "unset", cursor: "pointer", padding: "5px" }}
                  name={`${user.user_id}`}
                  onClick={() => {
                    deleteUserById(Number(user.user_id));
                  }}
                >
                  <AiOutlineClose color="red" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default InviteUserToChatRoom;

interface UserInterface {
  id: number;
  email: string;
  password: string;
  role: string;
  real_email: any;
  phone_number: any;
  war_zone_id: any;
  tenant: number;
  created_at: string;
  is_active: number;
  on_do_not_text_list: number;
  first_name: string;
  last_name: string;
  notes: string;
  user_id: number;
  current_item_id: number;
}
