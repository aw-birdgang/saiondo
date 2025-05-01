import 'chat.dart';

class ChatList {
  final List<Chat>? chats;

  ChatList({
    this.chats,
  });

  factory ChatList.fromJson(Map<String, dynamic> json) {
    List<Chat> chats = (json['items'] as List).map((chat) => Chat.fromMap(chat)).toList();

    return ChatList(
      chats: chats,
    );
  }
}