class ChatHistory {
  final String id;
  final String userId;
  final String message;
  final String sender;
  final DateTime timestamp;
  final String roomId;

  ChatHistory({
    required this.id,
    required this.userId,
    required this.message,
    required this.sender,
    required this.timestamp,
    required this.roomId,
  });

  /// JSON에서 객체로 변환
  factory ChatHistory.fromJson(Map<String, dynamic> json) => ChatHistory(
    id: json['id'] as String? ?? '',
    userId: json['userId'] as String? ?? '',
    message: json['message'] as String? ?? '',
    sender: json['sender'] as String? ?? 'LLM',
    timestamp: json['timestamp'] != null
        ? DateTime.tryParse(json['timestamp']) ?? DateTime.now()
        : DateTime.now(),
    roomId: json['roomId'] as String? ?? '',
  );

  /// Map에서 객체로 변환 (fromJson과 동일, 네이밍만 다름)
  factory ChatHistory.fromMap(Map<String, dynamic> map) => ChatHistory(
    id: map['id'] as String,
    userId: map['userId'] as String,
    roomId: map['roomId'] as String,
    message: map['message'] as String,
    sender: map['sender'] as String,
    timestamp: DateTime.parse(map['timestamp'] as String),
  );

  /// 객체를 Map으로 변환
  Map<String, dynamic> toMap() => {
    'id': id,
    'userId': userId,
    'roomId': roomId,
    'message': message,
    'sender': sender,
    'timestamp': timestamp.toIso8601String(),
  };
}