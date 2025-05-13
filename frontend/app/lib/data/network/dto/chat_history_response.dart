class ChatHistoryResponse {
  final String id;
  final String userId;
  final String message;
  final String sender; // "USER" 또는 "AI" 등
  final bool isQuestionResponse;
  final bool isUserInitiated;
  final bool analyzedByLlm;
  final DateTime timestamp;
  final String roomId;

  ChatHistoryResponse({
    required this.id,
    required this.userId,
    required this.message,
    required this.sender,
    required this.isQuestionResponse,
    required this.isUserInitiated,
    required this.analyzedByLlm,
    required this.timestamp,
    required this.roomId,
  });

  factory ChatHistoryResponse.fromJson(Map<String, dynamic> json) => ChatHistoryResponse(
    id: json['id'],
    userId: json['userId'],
    message: json['message'],
    sender: json['sender'],
    isQuestionResponse: json['isQuestionResponse'],
    isUserInitiated: json['isUserInitiated'],
    analyzedByLlm: json['analyzedByLlm'],
    timestamp: DateTime.parse(json['timestamp']),
    roomId: json['roomId'],
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'userId': userId,
    'message': message,
    'sender': sender,
    'isQuestionResponse': isQuestionResponse,
    'isUserInitiated': isUserInitiated,
    'analyzedByLlm': analyzedByLlm,
    'timestamp': timestamp.toIso8601String(),
    'roomId': roomId,
  };
}