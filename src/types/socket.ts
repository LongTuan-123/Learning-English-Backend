export enum SOCKET_KEYS {
  CONNECTION = 'connection',
  USERS = 'users',
  CONNECT_CHAT = 'connect_chat',
  SEND_MESSAGE = 'send_msg',
  RECEIVED_MESSAGE = 'received_msg',
  CHECK_ACTIVE = 'check_active',
  ACTIVE = 'active',
  SEND_TYPING = 'send_typing',
  IS_TYPING = 'is_typing',
  DISCONNECT = 'disconnect',
  SEND_IP_CALL = 'send_ip_call',
  RECEIVED_IP_CALL = 'received_ip_call',
  ACCEPT_IP_CALL = 'accept_ip_call',
  RECEIVED_ACCEPT_IP_CALL = 'received_accept_ip_call',
  REJECT_IP_CALL = 'reject_ip_call',
  ACTIVE_USER = 'active_user',

  // For video call
  ME = 'me',
  CALL_USER = 'call_user',
  ANSWER_CALL = 'answer_call',
  ACCEPTED_CALL = 'accepted_call',
  END_CALL = 'end_call',

  // Chat
  RESPONSE_CHAT = 'response_chat',
  SEEN_CHAT = 'seen_chat',
  SEEN_CHAT_RESPONSE = 'seen_chat_response',
}
