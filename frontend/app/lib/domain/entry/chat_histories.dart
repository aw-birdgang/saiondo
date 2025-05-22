import 'package:app/domain/entry/chat_history.dart';

class ChatHistories {
  final List<ChatHistory>? chats;

  ChatHistories({
    this.chats,
  });

  factory ChatHistories.fromJson(Map<String, dynamic> json) {
    List<ChatHistory> chats = (json['items'] as List).map((chat) => ChatHistory.fromMap(chat)).toList();

    return ChatHistories(
      chats: chats,
    );
  }
}