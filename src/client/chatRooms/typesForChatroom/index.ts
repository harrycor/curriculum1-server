export default interface ChatInterfaces {
  UserInChatRoomInterface: {
    id: number;
    chat_room_id: number;
    user_id: number;
    time_last_viewed: Date | string;
    user_invite_handled?: 0 | 1;
    user_is_active_in_chat?: 0 | 1;
    user_has_left_chat?: 0 | 1;
    created_at?: Date | string;
  };
  MessageInterface: {
    id: number;
    chat_room_id: number;
    from_user_id: number;
    message_body: string;
    message_is_active?: 0 | 1;
    created_at?: Date | string;
  };
  ChatRoomInterface: {
    id: number;
    name_of_chat_room: string;
    chat_creator_user_id: number;
    chat_room_is_shareable?: 0 | 1;
    time_of_most_recent_message: Date | string;
    chat_room_is_active?: 0 | 1;
    created_at_in_utc?: Date | string;
  };
}
