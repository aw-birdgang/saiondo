class Assistant {
  final String id;
  final String channelId;
  final String userId;

  Assistant({required this.id, required this.channelId, required this.userId});

  factory Assistant.fromJson(Map<String, dynamic> json) => Assistant(
        id: json['id'],
        channelId: json['channelId'],
        userId: json['userId'],
      );
}