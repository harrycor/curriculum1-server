import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import ResponseErrorHandlingAndParsing from "../../server/utils/responseErrorHandling";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";

function ChatRoomInvites({
  invites,
  setStateToRerenderInvites,
}: {
  invites: InviteInterface[];
  setStateToRerenderInvites: Dispatch<SetStateAction<number>>;
}) {
  const token = localStorage.getItem("token");

  const [showInvites, setShowInvites] = useState<boolean>(false);
  const [showOtherUsersState, setShowOtherUserState] = useState<
    Record<number, { show: boolean; users: Array<UsersInChatInterface> }>
  >({});

  // This makes us an object for toggling if we should show invites
  useEffect(() => {
    let showOtherUsersObject: typeof showOtherUsersState = {};

    invites.forEach((invite) => {
      showOtherUsersObject[Number(invite.id)] = { show: false, users: [] };
    });

    setShowOtherUserState(showOtherUsersObject);

    return () => {
      setShowOtherUserState({});
    };
  }, [invites]);

  function toggleShowOtherUsers(id: number): void {
    setShowOtherUserState((prev) => {
      return { ...prev, [id]: { ...prev[id], show: !prev[id].show } };
    });
  }

  async function acceptOrDeclineInvite(
    id: number,
    accept: boolean
  ): Promise<void> {
    const acceptAsNumber = accept ? 1 : 0;

    let body = ResponseErrorHandlingAndParsing.returnStringifiedObject({
      chatRoomId: id,
      acceptOrDecline: acceptAsNumber,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    };

    if (!accept) {
      if (
        confirm(
          "Once you decline an invite you will not be able to reciev future invites to this chat room are you sure you want to do this?"
        )
      ) {
        await fetch("api/chats/chatroom/acceptinvite", requestOptions).then(
          (res) => {
            let response = new ResponseErrorHandlingAndParsing(res);
            if (response.ifErrorStatusReturnError() instanceof Error) {
              alert("Error handling request");
              console.log({ errorMessage: response.returnMessage() });
            } else {
              toast(response.returnMessage());
              setStateToRerenderInvites((prev) => prev + 1);
            }
          }
        );
      } else {
      }
    } else {
      await fetch("api/chats/chatroom/acceptinvite", requestOptions).then(
        (res) => {
          let response = new ResponseErrorHandlingAndParsing(res);
          if (response.ifErrorStatusReturnError() instanceof Error) {
            alert("Error handling request");
            console.log({ errorMessage: response.returnMessage() });
          } else {
            toast(response.returnMessage());
            setStateToRerenderInvites((prev) => prev + 1);
          }
        }
      );
    }
  }

  async function getUsersInChatRoom(
    chatRoomId: number | string,
    inviteId: number
  ): Promise<void> {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await fetch(`api/chats/chatroom/users/${chatRoomId}`, requestOptions)
        .then((res) => {
          let response = new ResponseErrorHandlingAndParsing(res);

          if (response.ifErrorStatusReturnError() instanceof Error) {
            console.log({ errorMessage: response.returnMessage() });
            throw response.ifErrorStatusReturnError();
          } else {
            return response.json;
          }
        })
        .then((json: unknown | null) => {
          function typegaurd(
            usersInChat: unknown
          ): usersInChat is UsersInChatInterface[] {
            return (
              usersInChat &&
              Array.isArray(usersInChat) &&
              usersInChat[0] &&
              typeof usersInChat[0] == "object" &&
              "user_id" in usersInChat[0]
            );
          }

          if (typegaurd(json)) {
            setShowOtherUserState((prev) => {
              return {
                ...prev,
                [inviteId]: { ...prev[inviteId], users: json },
              };
            });
          } else {
            throw new Error(
              "the response did not match the shape of users in chat interface"
            );
          }
        });
    } catch (err) {
      alert("Error getting users in chat");
      console.log(err);
    }
  }

  if (Array.isArray(invites) && Array.length) {
    return (
      <>
        <div className="row m-3">
          {Array.isArray(invites) && invites.length ? (
            <h1 className="text-center">Invites</h1>
          ) : null}
        </div>

        {invites.length
          ? invites.map((invite) => {
              return (
                <Card
                  key={`ChatRoomsInvitess ${invite.id} ${invite.created_at_in_utc}`}
                >
                  <Card.Body>
                    <Card.Title>{invite.name_of_chat_room}</Card.Title>
                    <Card.Subtitle>
                      Created by {invite.first_name} {invite.last_name}
                    </Card.Subtitle>
                    <hr />
                    <Card.Text
                      className="text text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        toggleShowOtherUsers(invite.id);
                        getUsersInChatRoom(invite.chat_room_id, invite.id);
                      }}
                    >
                      View users in chat room &#709;
                    </Card.Text>
                    <div className="d-flex flex-wrap">
                      <>
                        {showOtherUsersState[invite.id]?.show
                          ? showOtherUsersState[invite.id]?.users.map(
                              (user: UsersInChatInterface) => {
                                return (
                                  <span
                                    className="m-1"
                                    key={`span for chat room invites ${user.user_id}`}
                                  >
                                    {user.first_name} {user.last_name}
                                  </span>
                                );
                              }
                            )
                          : null}
                      </>
                    </div>
                    <Button
                      className="m-1"
                      name={String(invite.id)}
                      variant="success"
                      onClick={() =>
                        acceptOrDeclineInvite(invite.chat_room_id, true)
                      }
                    >
                      Accepts
                    </Button>
                    <Button
                      className="m-1"
                      variant="danger"
                      name={String(invite.id)}
                      onClick={() =>
                        acceptOrDeclineInvite(invite.chat_room_id, false)
                      }
                    >
                      Decline
                    </Button>
                    <br />
                    <small className="text text-muted">
                      User will not be notified if you decline invite
                    </small>
                  </Card.Body>
                </Card>
              );
            })
          : null}
      </>
    );
  } else {
    return <></>;
  }
}

interface InviteInterface {
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

interface UsersInChatInterface {
  user_id: number;
  first_name: string;
  last_name: string;
}

export default ChatRoomInvites;
