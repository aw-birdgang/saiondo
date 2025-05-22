import '../../domain/entry/event.dart';
import '../../domain/repository/event_repository.dart';
import '../network/apis/event_api.dart';

class EventRepositoryImpl implements EventRepository {
  final EventApi api;
  EventRepositoryImpl(this.api);

  @override
  Future<List<Event>> getEvents() {
    return api.fetchEvents();
  }

  @override
  Future<Event> addEvent(Event event) {
    return api.createEvent(event);
  }

  @override
  Future<void> removeEvent(String id) {
    return api.deleteEvent(id);
  }
}