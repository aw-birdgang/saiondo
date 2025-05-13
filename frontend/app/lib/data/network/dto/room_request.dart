class Room {
  final String id;
  final String relationshipId;
  final DateTime createdAt;

  Room({
    required this.id,
    required this.relationshipId,
    required this.createdAt,
  });

  factory Room.fromJson(Map<String, dynamic> json) => Room(
    id: json['id'],
    relationshipId: json['relationshipId'],
    createdAt: DateTime.parse(json['createdAt']),
  );
}