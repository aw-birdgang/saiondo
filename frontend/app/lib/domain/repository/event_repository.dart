import '../../domain/entry/event.dart';

abstract class EventRepository {
  Future<List<Event>> getEvents();
  Future<Event> addEvent(Event event);
  Future<void> removeEvent(String id);
}