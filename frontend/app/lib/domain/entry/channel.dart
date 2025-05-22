class Channel {
  final String id;
  final String user1Id;
  final String user2Id;
  final String status;
  final DateTime startedAt;
  final DateTime? endedAt;

  Channel({
    required this.id,
    required this.user1Id,
    required this.user2Id,
    required this.status,
    required this.startedAt,
    this.endedAt,
  });

  factory Channel.fromJson(Map<String, dynamic> json) => Channel(
    id: json['id'],
    user1Id: json['user1Id'],
    user2Id: json['user2Id'],
    status: json['status'],
    startedAt: DateTime.parse(json['startedAt']),
    endedAt: json['endedAt'] != null ? DateTime.parse(json['endedAt']) : null,
  );
}