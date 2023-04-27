import { Router } from "express";
import { verify } from "jsonwebtoken";
import db from "../db";
import config from "../config";
import * as moment from "moment";

const router = Router();

export class UserInChatRoom {
  public id: number;
  public chat_room_id: number;
  public user_id: number;
  public time_last_viewed: Date | string;
  public user_invite_handled: 0 | 1;
  public user_is_active_in_chat: 0 | 1;
  public user_has_left_chat: 0 | 1;
  public created_at: Date | string;

  constructor(userInChatRoom: {
    chat_room_id: number;
    user_id: number;
    time_last_viewed: Date | string;
    user_invite_handled?: 0 | 1;
    user_is_active_in_chat?: 0 | 1;
    user_has_left_chat?: 0 | 1;
    created_at?: Date | string;
  }) {
    Object.assign(this, userInChatRoom);
  }
}

export class ChatRoom {
  public id: number;
  public name_of_chat_room: string;
  public chat_creator_user_id: number;
  public chat_room_is_active: 0 | 1;
  public chat_room_is_shareable: 0 | 1;
  public time_of_most_recent_message?: Date | string;
  public created_at_utc: Date;

  constructor(chatRoom: {
    name_of_chat_room: string;
    chat_creator_user_id: number;
    chat_room_is_active: 0 | 1;
    chat_room_is_shareable: 0 | 1;
    time_of_most_recent_message?: Date | string;
    created_at_utc?: Date;
  }) {
    Object.assign(this, chatRoom);
  }
}

export class Message {
  public id?: number;
  public chat_room_id: number;
  public from_user_id: number;
  public message_body: string;
  public message_is_active: 0 | 1;
  public created_at: Date | string;

  constructor(message: {
    chat_room_id: number;
    from_user_id: number;
    message_body: string;
    message_is_active?: 0 | 1;
    created_at?: Date | string;
  }) {
    Object.assign(this, message);
  }
}

const userIsChatRoomCreator = async (
  chatRoomId: number,
  userIdFromToken: number
): Promise<boolean> => {
  const userIdChatRoomCreator = await db.chats.confirmUserOwnsChatRoom(
    chatRoomId,
    userIdFromToken
  );

  return (
    Array.isArray(userIdChatRoomCreator) == true &&
    userIdChatRoomCreator.length != 0
  );
};

const chatRoomIsShareable = async (chatRoomId: number): Promise<boolean> => {
  const chatRoomIsShareableQuery = await db.chats.confirmChatRoomIsShareable(
    chatRoomId
  );

  const zeroOrOne = chatRoomIsShareableQuery[0]?.chat_room_is_shareable;

  return zeroOrOne == 1;
};

const confirmUserIsAlreadyInChatRoom = async (
  chatRoomId: number,
  userId: number
): Promise<boolean> => {
  let userInvitedOrInChatRoom = await db.chats.confirmUserIsAlreadyInvited(
    chatRoomId,
    userId
  );

  console.log({ userInvitedOrInChatRoom });

  return (
    Array.isArray(userInvitedOrInChatRoom) && userInvitedOrInChatRoom.length > 0
  );
};

const userIsInChatRoom = async (
  chatRoomId: number,
  userIdFromToken: number
): Promise<boolean> => {
  const userIsInChatRoom = await db.chats.confirmUserIsInChatRoom(
    chatRoomId,
    userIdFromToken
  );

  return (
    Array.isArray(userIsInChatRoom) == true && userIsInChatRoom.length != 0
  );
};

// ROUTES
router.get("/chatroominfo/:id", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userIdFromToken = tokenVerify.userId;

    let chatRoomId = Number(req.params.id);

    const userInChatRoomBoolean = await userIsInChatRoom(
      chatRoomId,
      userIdFromToken
    );

    if (!userInChatRoomBoolean) {
      res.sendStatus(403);
    } else {
      db.chats.getChatRoomInfo(chatRoomId).then((response) => {
        if (Array.isArray(response) && response.length) {
          res.status(200).json(response[0]);
        } else {
          res.sendStatus(404);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/chatroom", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userIdFromToken = tokenVerify.userId;

    let { name_of_chat_room, chat_room_is_shareable } = req.body;

    let finalResult = new ChatRoom({
      chat_creator_user_id: userIdFromToken,
      chat_room_is_active: 1,
      name_of_chat_room,
      chat_room_is_shareable,
    });

    if (finalResult instanceof ChatRoom) {
      const chatRoom = new ChatRoom(finalResult);

      const result: Record<string, any> = await db.chats.addChatRoom(
        chatRoom,
        moment().toDate()
      );

      if (!result.insertId) throw new Error("No id returned from database");

      const userAddedToChatRoom = await db.chats.addUserToChatRoom(
        result.insertId,
        userIdFromToken,
        moment().toDate()
      );

      if (userAddedToChatRoom) {
        // @ts-ignore
        res.status(201).json({ createdChatroomId: result.insertId });
      } else {
        throw new Error("User was not added to chat room");
      }
    } else {
      throw new Error("Not instance of chat room");
    }
  } catch (error) {
    console.log(error);
    if (error.message == "Not instance of chat room") {
      res.sendStatus(400);
    } else {
      res.sendStatus(500);
    }
  }
});

router.post("/chatroom/changeShareableStatus", async (req, res) => {
  let { chatRoomShareableStatusBoolean, chatRoomId } = req.body;

  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userIdFromToken = tokenVerify.userId;

    const confirmedCreator = await userIsChatRoomCreator(
      chatRoomId,
      userIdFromToken
    );

    //
    if (userIdFromToken && confirmedCreator) {
      const result = await db.chats.changeShareableStatus(
        chatRoomId,
        chatRoomShareableStatusBoolean
      );

      res.sendStatus(200);
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

// Create array of arrays of user ids and chat room userIdsToInvite

function createArrayOfArraysForInvitingUsers(
  ids: number[],
  chatRoomId: number
): Array<Array<any>> | void {
  if (ids?.length) {
    return ids.map((id) => [
      chatRoomId,
      id,
      moment().toDate(),
      0,
      0,
      0,
      moment().toDate(),
    ]);
  }
}

router.post("/chatroom/inviteUsers", async (req, res) => {
  try {
    const { chatRoomId, userIdsToInvite: userIdsToInviteBeforeMakingUnique } =
      req.body;

    let onlyUnique = (value: number, index: number, array: Array<any>) => {
      return array.indexOf(value) === index;
    };

    const userIdsToInvite =
      userIdsToInviteBeforeMakingUnique.filter(onlyUnique);

    let arrayOfIdsTypeGaurd = (numbers: any): numbers is Array<number> => {
      const res = numbers.every(function (element: any) {
        return typeof element === "number";
      });
      return res;
    };

    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userIdFromToken = tokenVerify.userId;

    const confirmedCreator = await userIsChatRoomCreator(
      chatRoomId,
      userIdFromToken
    );
    const confirmedShareable = await chatRoomIsShareable(chatRoomId);

    // this function was pretty hard what it does is return an array of id's that have been confrimed to not already exsist in the chat room
    // this stops people from being spammed
    // as of now once you decline a chat room invite you cannot get another one
    const returnAnArrayWithNoDuplicateUsers = async (
      userIds: number[],
      chatRoomId: number
    ): Promise<number[] | null> => {
      const promiseArray = userIds.map(async (id: number) => {
        return db.chats.idDoesNotExsistAlreadyInChatRoom(id, chatRoomId);
      });

      const finalArrayOfIds = await Promise.all(promiseArray).then(
        (confirmedPromiseArray: Array<any[]>) => {
          let placeHolderArray: Array<number> = [];

          for (let index = 0; index < confirmedPromiseArray.length; index++) {
            const element = confirmedPromiseArray[index];
            if (Array.isArray(element) && element.length == 0) {
              placeHolderArray.push(userIds[index]);
            } else {
              continue;
            }
          }
          return placeHolderArray;
        }
      );
      if (!finalArrayOfIds.length) {
        return null;
      }
      return finalArrayOfIds;
    };

    if (arrayOfIdsTypeGaurd(userIdsToInvite)) {
      let inviteIds = await returnAnArrayWithNoDuplicateUsers(
        userIdsToInvite,
        chatRoomId
      );

      if (!confirmedShareable) {
        if (!confirmedCreator) {
          res.sendStatus(403);
        } else if (inviteIds == null || !inviteIds.length) {
          throw new Error("message sent");
        } else {
          const arrayOfArrays = createArrayOfArraysForInvitingUsers(
            inviteIds,
            chatRoomId
          );

          const result = await db.chats.inviteUsersToChatRoom(arrayOfArrays);
          res.sendStatus(200);
        }
      } else if (confirmedShareable) {
        const userInChatRoom = await userIsInChatRoom(
          chatRoomId,
          userIdFromToken
        );

        if (!userInChatRoom) {
          res.sendStatus(403);
        } else if (inviteIds == null) {
          res.status(304).json({ message: "Invite sent" });
        } else {
          const arrayOfArrays = createArrayOfArraysForInvitingUsers(
            inviteIds,
            chatRoomId
          );

          const result = await db.chats.inviteUsersToChatRoom(arrayOfArrays);
          res.sendStatus(200);
        }
      }
    } else {
      throw new Error("array of ids was not a number");
    }
  } catch (error) {
    switch (error.message) {
      case "message sent":
        res.sendStatus(304);
        break;

      default:
        res.sendStatus(500);
        break;
    }
  }
});

router.post("/chatroom/newChat", async (req, res) => {
  const { chatRoomId, chatMessage } = req.body;

  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userIdFromToken = tokenVerify.userId;

    const confirmeUserInChatRoom = await userIsInChatRoom(
      chatRoomId,
      userIdFromToken
    );

    if (confirmeUserInChatRoom) {
      const result = db.chats.addNewMessage(
        chatRoomId,
        userIdFromToken,
        chatMessage
      );

      result.then(async (res) => {
        if (res && res instanceof Error == false) {
          let created = await db.chats.updateChatRoomsMostRecentMessage(
            moment().toDate(),
            chatRoomId
          );
          if (created[0] == false || created[0] instanceof Error) {
            // check
            throw new Error("updatingChatRoomsMostRecentMessageDidNotWork");
          }
        }
      });

      res.sendStatus(201);
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/chatroom/:id", async (req, res) => {
  const chatRoomId = Number(req.params.id);

  // get all chats for chat room
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userIdFromToken = tokenVerify.userId;

    const confirmedUserInChatRoom = await userIsInChatRoom(
      chatRoomId,
      userIdFromToken
    );

    if (confirmedUserInChatRoom) {
      const result = await db.chats.getChatRoomMessages(chatRoomId);
      res.status(200).json(result);
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// get all chat rooms that user is in
router.get("/chatrooms", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userIdFromToken = tokenVerify.userId;

    const result = await db.chats.getChatRoomsForUser(userIdFromToken);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/chatrooms/invites", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userIdFromToken = tokenVerify.userId;

    const result = await db.chats.getChatRoomInvitesForUser(userIdFromToken);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Accept or decline chat room invites
router.post("/chatroom/acceptinvite", async (req, res) => {
  try {
    const { chatRoomId, acceptOrDecline } = req.body;

    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userIdFromToken = tokenVerify.userId;

    if (token) {
      const result = await db.chats.acceptOrDeclineChatRoomInvite(
        chatRoomId,
        userIdFromToken,
        acceptOrDecline
      );

      if (result && result != null) {
        res.sendStatus(200);
      } else {
        res.sendStatus(422);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get all users in a chat room
router.get("/chatroom/users/:chatroomid", async (req, res) => {
  const chatRoomId = Number(req.params.chatroomid);

  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userIdFromToken = tokenVerify.userId;

    const usersInChatRoom = await db.chats.getAllUsersInChatRoom(chatRoomId);

    res.status(200).json(usersInChatRoom);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Remove self from chat room
router.post("/chatroom/removeuser", async (req, res) => {
  try {
    const { chatRoomId } = req.body;

    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userIdFromToken = tokenVerify.userId;

    if (token) {
      const userInChatRoom = await userIsInChatRoom(
        chatRoomId,
        userIdFromToken
      );

      if (!userInChatRoom) {
        res.sendStatus(403);
      } else {
        const result = await db.chats.removeUserFromChatRoom(
          chatRoomId,
          userIdFromToken
        );
        res.sendStatus(200);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete chat room
router.post("/chatroom/delete", async (req, res) => {
  try {
    const { chatRoomId } = req.body;

    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userIdFromToken = tokenVerify.userId;

    if (token) {
      const userCreatedChatRoom = await userIsChatRoomCreator(
        chatRoomId,
        userIdFromToken
      );

      if (!userCreatedChatRoom) {
        res.sendStatus(403);
      } else {
        const result = await db.chats.deleteChatRoom(chatRoomId);
        res.sendStatus(200);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default router;
