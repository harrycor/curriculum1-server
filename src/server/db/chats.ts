import { ChatRoom } from "../routes/routesForChats";
import { Query } from "./index";

const allUserById = async (id: number) => {
  return Query("SELECT * from ;", [id]);
};

const idDoesNotExsistAlreadyInChatRoom = async (
  id: number,
  chatRoomId: number
) => {
  return await Query(
    `select * from users_in_chat_rooms where user_id = ? and chat_room_id = ?`,
    [id, chatRoomId]
  );
};

const confirmUserOwnsChatRoom = async (chatRoomId: number, userId: number) => {
  return await Query(
    `select * from chat_rooms where id = ? and chat_creator_user_id = ?`,
    [chatRoomId, userId]
  );
};

const getChatRoomInfo = async (chatRoomId: number) => {
  return await Query(`select * from chat_rooms where id = ?`, [chatRoomId]);
};

const updateChatRoomsMostRecentMessage = async (
  theNewDate: Date,
  chatRoomId: number
) => {
  return await Query(
    `update chat_rooms set time_of_most_recent_message= ?  where id =?`,
    [theNewDate, chatRoomId]
  );
};

const addChatRoom = async (ChatRoom: ChatRoom, currentTimeUtc: Date) => {
  const {
    name_of_chat_room,
    chat_creator_user_id,
    chat_room_is_active,
    chat_room_is_shareable,
  } = ChatRoom;

  console.log({ ChatRoom, currentTimeUtc });

  return await Query(
    `insert into chat_rooms ( name_of_chat_room, chat_creator_user_id, chat_room_is_active, chat_room_is_shareable, time_of_most_recent_message, created_at_in_utc)
values (?, ? ,? , ?, ?, ?)`,
    [
      name_of_chat_room,
      chat_creator_user_id,
      chat_room_is_active,
      chat_room_is_shareable,
      currentTimeUtc,
      currentTimeUtc,
    ]
  );
};

const confirmChatRoomIsShareable = async (chatRoomId: number) => {
  return await Query(
    `select chat_room_is_shareable from chat_rooms where id = ?`,
    [chatRoomId]
  );
};

const confirmUserIsInChatRoom = async (chatRoomId: number, userId: number) => {
  return await Query(
    `select * from users_in_chat_rooms where chat_room_id = ? and user_id = ? and user_is_active_in_chat = 1 and user_has_left_chat = 0`,
    [chatRoomId, userId]
  );
};

const confirmUserIsAlreadyInvited = async (
  chatRoomId: number,
  userId: number
) => {
  return await Query(
    `select * from users_in_chat_rooms where chat_room_id = ? and user_id = ?`,
    [chatRoomId, userId]
  );
};

const changeShareableStatus = async (
  chatRoomId: number,
  chatRoomShareableStatusBoolean: boolean
) => {
  let chatRoomShareableStatusNumber = chatRoomShareableStatusBoolean ? 1 : 0;

  return await Query(
    `update chat_rooms set chat_room_is_shareable = ? where id = ?`,
    [chatRoomShareableStatusNumber, chatRoomId]
  );
};

// this is for when we create a new chat room and want to add the creator to the chat room
const addUserToChatRoom = async (
  chatRoomId: number,
  userId: number,
  currentTimeUtc: Date
) => {
  return await Query(
    `insert into users_in_chat_rooms (chat_room_id, user_id, time_last_viewed, user_invite_handled, user_is_active_in_chat, user_has_left_chat, created_at_in_utc) values (?, ?, ? , 1, 1, 0, ?)`,
    [chatRoomId, userId, currentTimeUtc, currentTimeUtc]
  );
};

const inviteUsersToChatRoom = async (values: any) => {
  return await Query(
    `insert into users_in_chat_rooms (chat_room_id, user_id, time_last_viewed, user_invite_handled, user_is_active_in_chat, user_has_left_chat, created_at_in_utc) values ?`,
    [values]
  );
};

const addNewMessage = async (
  chatRoomId: number,
  userId: number,
  chatMessage: string
) => {
  const utcDate = new Date();

  return await Query(
    `insert into messages (chat_room_id, from_user_id, message_body, message_is_active, created_at_in_utc) values (?, ?, ?, 1, ?)`,
    [chatRoomId, userId, chatMessage, utcDate]
  );
};

const getChatRoomMessages = async (chatRoomId: number) => {
  // get all meassages sorted by date ascending
  return await Query(
    `
select m.id, m.chat_room_id,m.from_user_id, m.message_body, m.message_is_active, m.created_at_in_utc, 
pi.first_name, pi.last_name, cr.name_of_chat_room, cr.time_of_most_recent_message, cr.chat_room_is_active
from messages m 
join personal_info pi on m.from_user_id = pi.user_id 
join chat_rooms cr on cr.id = m.chat_room_id
where m.chat_room_id = ?  order by m.created_at_in_utc asc;
`,
    [chatRoomId]
  );
};

const getChatRoomsForUser = async (userId: number) => {
  return await Query(
    `select * from users_in_chat_rooms u join chat_rooms c on c.id = u.chat_room_id where user_id =? and 
user_is_active_in_chat =1 and chat_room_is_active = 1;`,
    [userId]
  );
};

const getChatRoomInvitesForUser = async (userId: number) => {
  return await Query(
    `select * from users_in_chat_rooms u 
join chat_rooms c on c.id = u.chat_room_id 
join personal_info p on p.user_id = c.chat_creator_user_id
where u.user_id = ? and 
u.user_invite_handled=0 and c.chat_room_is_active = 1;`,
    [userId]
  );
};

const getAllUsersInChatRoom = async (chatRoomId: number) => {
  return await Query(
    `select u.user_id, first_name, last_name from users_in_chat_rooms u 
join personal_info pi 
where u.user_id = pi.user_id 
and chat_room_id = ? and user_is_active_in_chat = 1;`,
    [chatRoomId]
  );
};

const acceptOrDeclineChatRoomInvite = async (
  chatRoomId: number,
  userId: number,
  inviteAccepted: number
) => {
  if (inviteAccepted == 0 || inviteAccepted == 1) {
    return await Query(
      `update users_in_chat_rooms set user_invite_handled = 1, user_is_active_in_chat = ? where chat_room_id = ? and user_id = ?`,
      [inviteAccepted, chatRoomId, userId]
    );
  } else {
    return null;
  }
};

const removeUserFromChatRoom = async (chatRoomId: number, userId: number) => {
  return await Query(
    `update users_in_chat_rooms set user_has_left_chat = 1, user_is_active_in_chat = 0 where chat_room_id = ? and user_id = ?`,
    [chatRoomId, userId]
  );
};

// @todo this needs to be updated so that we also set all users in the chat room to inactive
const deleteChatRoom = async (chatRoomId: number) => {
  return await Query(
    `update chat_rooms set chat_room_is_active = 0 where id = ?`,
    [chatRoomId]
  );
};

export default {
  allUserById,
  addChatRoom,
  getChatRoomInfo,
  confirmChatRoomIsShareable,
  confirmUserIsInChatRoom,
  inviteUsersToChatRoom,
  changeShareableStatus,
  confirmUserOwnsChatRoom,
  addNewMessage,
  addUserToChatRoom,
  getChatRoomMessages,
  getChatRoomsForUser,
  getChatRoomInvitesForUser,
  acceptOrDeclineChatRoomInvite,
  getAllUsersInChatRoom,
  removeUserFromChatRoom,
  deleteChatRoom,
  idDoesNotExsistAlreadyInChatRoom,
  updateChatRoomsMostRecentMessage,
  confirmUserIsAlreadyInvited,
};
