class ChatHistoryResponse {
  final String id;
  final String userId;
  final String message;
  final String sender;
  final DateTime createdAt;
  final String assistantId;
  final String channelId;

  ChatHistoryResponse({
    required this.id,
    required this.userId,
    required this.message,
    required this.sender,
    required this.createdAt,
    required this.assistantId,
    required this.channelId,
  });

  factory ChatHistoryResponse.fromJson(Map<String, dynamic> json) =>
      ChatHistoryResponse(
        id: json['id'],
        userId: json['userId'],
        message: json['message'],
        sender: json['sender'],
        createdAt: DateTime.parse(json['createdAt']),
        assistantId: json['assistantId'],
        channelId: json['channelId'],
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'message': message,
        'sender': sender,
        'createdAt': createdAt.toIso8601String(),
        'assistantId': assistantId,
        'channelId': channelId,
      };
}
