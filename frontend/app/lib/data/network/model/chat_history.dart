class ChatHistory {
  final String id;
  final String userId;
  final String roomId;
  final String message;
  final String sender; // 'USER' or 'AI'
  final DateTime timestamp;

  ChatHistory({
    required this.id,
    required this.userId,
    required this.roomId,
    required this.message,
    required this.sender,
    required this.timestamp,
  });

  factory ChatHistory.fromJson(Map<String, dynamic> json) => ChatHistory(
    id: json['id'],
    userId: json['userId'],
    roomId: json['roomId'],
    message: json['message'],
    sender: json['sender'],
    timestamp: DateTime.parse(json['timestamp']),
  );
}