import 'package:mobx/mobx.dart';

import '../../../domain/entry/event.dart';
import '../../../domain/repository/event_repository.dart';

part 'event_store.g.dart';

class EventStore = _EventStore with _$EventStore;

abstract class _EventStore with Store {
  final EventRepository repository;

  _EventStore(this.repository);

  @observable
  ObservableList<Event> events = ObservableList<Event>();

  @observable
  bool isLoading = false;

  @action
  Future<void> loadEvents() async {
    isLoading = true;
    final fetched = await repository.getEvents();
    events = ObservableList<Event>.of(fetched);
    isLoading = false;
  }

  @action
  Future<void> addEvent(Event event) async {
    final newEvent = await repository.addEvent(event);
    events.add(newEvent);
  }

  @action
  Future<void> deleteEvent(String id) async {
    await repository.removeEvent(id);
    events.removeWhere((e) => e.id == id);
  }
}