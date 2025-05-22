import 'package:app/data/network/constants/endpoints.dart';

import '../../../core/data/network/dio/dio_client.dart';
import '../../adapter/event_adapter.dart';
import '../rest_client.dart';
import '../../../domain/entry/event.dart';

class EventApi {
  final DioClient _dioClient;
  final RestClient _restClient;

  EventApi(this._dioClient, this._restClient);

  Future<List<Event>> fetchEvents() async {
    final response = await _dioClient.dio.get(Endpoints.events);
    final List data = response.data;
    return data.map<Event>((e) => EventAdapter.fromJson(e)).toList();
  }

  Future<Event> createEvent(Event event) async {
    final response = await _dioClient.dio.post(
      Endpoints.events,
      data: EventAdapter.toJson(event)..remove('id'),
    );
    return EventAdapter.fromJson(response.data);
  }

  Future<void> deleteEvent(String id) async {
    final response = await _dioClient.dio.delete(Endpoints.eventById(id));
    if (response.statusCode != 200 && response.statusCode != 204) {
      throw Exception('Failed to delete event');
    }
  }
}