import 'package:saiondo/domain/entry/chat.dart';

class ChatHistories {
  final List<Chat>? chats;

  ChatHistories({
    this.chats,
  });

  factory ChatHistories.fromJson(Map<String, dynamic> json) {
    List<Chat> chats =
        (json['items'] as List).map((chat) => Chat.fromMap(chat)).toList();

    return ChatHistories(
      chats: chats,
    );
  }
}
