class ChatMessageResponse {
  final String sender;
  final String message;
  final DateTime timestamp;

  ChatMessageResponse({
    required this.sender,
    required this.message,
    required this.timestamp,
  });

  factory ChatMessageResponse.fromJson(Map<String, dynamic> json) => ChatMessageResponse(
    sender: json['sender'],
    message: json['message'],
    timestamp: DateTime.parse(json['timestamp']),
  );
}