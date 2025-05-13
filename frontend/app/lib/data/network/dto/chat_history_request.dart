class ChatHistoryRequest {
  final String userId;
  final String roomId;
  final String message;

  ChatHistoryRequest({
    required this.userId,
    required this.roomId,
    required this.message,
  });

  Map<String, dynamic> toJson() => {
    'userId': userId,
    'roomId': roomId,
    'message': message,
  };
}