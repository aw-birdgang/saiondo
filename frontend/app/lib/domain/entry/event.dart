class Event {
  final String id;
  final String title;
  final String? description;
  final DateTime startTime;
  final DateTime endTime;

  Event({
    required this.id,
    required this.title,
    this.description,
    required this.startTime,
    required this.endTime,
  });

  factory Event.fromJson(Map<String, dynamic> json) => Event(
        id: json['id'],
        title: json['title'],
        description: json['description'],
        startTime: DateTime.parse(json['startTime']),
        endTime: DateTime.parse(json['endTime']),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'description': description,
        'startTime': startTime.toIso8601String(),
        'endTime': endTime.toIso8601String(),
      };
}
