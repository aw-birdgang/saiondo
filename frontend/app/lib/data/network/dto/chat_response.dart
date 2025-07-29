class ChatMessageResponse {
  final String sender;
  final String message;
  final DateTime createdAt;

  ChatMessageResponse({
    required this.sender,
    required this.message,
    required this.createdAt,
  });

  factory ChatMessageResponse.fromJson(Map<String, dynamic> json) =>
      ChatMessageResponse(
        sender: json['sender'],
        message: json['message'],
        createdAt: DateTime.parse(json['createdAt']),
      );
}
