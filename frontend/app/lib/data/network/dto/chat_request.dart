class SendMessageRequest {
  final String userId;
  final String assistantId;
  final String message;

  SendMessageRequest({
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
