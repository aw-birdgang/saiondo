class ChatHistoryRequest {
  final String userId;
  final String assistantId;
  final String message;

  ChatHistoryRequest({
    required this.userId,
    required this.assistantId,
    required this.message,
  });

  Map<String, dynamic> toJson() => {
        'userId': userId,
        'assistantId': assistantId,
        'message': message,
      };
}
