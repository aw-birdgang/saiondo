class Chat {
  final String id;
  final String userId;
  final String message;
  final String sender;
  final DateTime createdAt;
  final String assistantId;
  final String channelId;

  Chat({
    required this.id,
    required this.userId,
    required this.message,
    required this.sender,
    required this.createdAt,
    required this.assistantId,
    required this.channelId,
  });

  /// JSON에서 객체로 변환
  factory Chat.fromJson(Map<String, dynamic> json) => Chat(
    id: json['id'] as String? ?? '',
    userId: json['userId'] as String? ?? '',
    message: json['message'] as String? ?? '',
    sender: json['sender'] as String? ?? 'LLM',
    createdAt: json['createdAt'] != null
        ? DateTime.tryParse(json['createdAt']) ?? DateTime.now()
        : DateTime.now(),
    assistantId: json['assistantId'] as String? ?? '',
    channelId: json['channelId'] as String? ?? '',
  );

  /// Map에서 객체로 변환 (fromJson과 동일, 네이밍만 다름)
  factory Chat.fromMap(Map<String, dynamic> map) => Chat(
    id: map['id'] as String? ?? '',
    userId: map['userId'] as String? ?? '',
    message: map['message'] as String? ?? '',
    sender: map['sender'] as String? ?? 'LLM',
    createdAt: map['createdAt'] != null
        ? DateTime.tryParse(map['createdAt']) ?? DateTime.now()
        : DateTime.now(),
    assistantId: map['assistantId'] as String? ?? '',
    channelId: map['channelId'] as String? ?? '',
  );

  /// 객체를 Map으로 변환
  Map<String, dynamic> toMap() => {
    'id': id,
    'userId': userId,
    'message': message,
    'sender': sender,
    'createdAt': createdAt.toIso8601String(),
    'assistantId': assistantId,
    'channelId': channelId,
  };
}