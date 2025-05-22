// class Chat {
//   final String id;
//   final String content;
//   final bool isUser;
//   final DateTime createdAt;
//
//   Chat({
//     required this.id,
//     required this.content,
//     required this.isUser,
//     required this.createdAt,
//   });
//
//   factory Chat.fromMap(Map<String, dynamic> json) {
//     return Chat(
//       id: json['id'] as String,
//       content: json['content'] as String,
//       isUser: json['isUser'] as bool,
//       createdAt: DateTime.parse(json['createdAt']),
//     );
//   }
//
//   Map<String, dynamic> toMap() => {
//     'id': id,
//     'content': content,
//     'categoryCode': isUser,
//     'createdAt': createdAt.toIso8601String(),
//   };
//
//   factory Chat.fromChatHistory(ChatHistory history, String myUserId) {
//     return Chat(
//       id: history.id,
//       content: history.message,
//       isUser: history.userId == myUserId,
//       createdAt: history.timestamp,
//     );
//   }
// }