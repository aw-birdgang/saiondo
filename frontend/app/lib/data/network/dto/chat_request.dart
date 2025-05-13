class SendMessageRequest {
  final String userId;
  final String roomId;
  final String message;

  SendMessageRequest({
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