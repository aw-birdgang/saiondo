import '../../../domain/entry/event.dart';

class EventAdapter {
  static Event fromJson(Map<String, dynamic> json) {
    return Event(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      startTime: DateTime.parse(json['startTime']),
      endTime: DateTime.parse(json['endTime']),
    );
  }

  static Map<String, dynamic> toJson(Event event) {
    return {
      'id': event.id,
      'title': event.title,
      'description': event.description,
      'startTime': event.startTime.toIso8601String(),
      'endTime': event.endTime.toIso8601String(),
    };
  }
}
