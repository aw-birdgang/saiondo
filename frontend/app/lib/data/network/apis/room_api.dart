import 'package:dio/dio.dart';
import '../model/room.dart';

class RoomApi {
  final Dio dio;
  RoomApi(this.dio);

  Future<List<Room>> fetchRooms(String userId) async {
    final response = await dio.get('/rooms', queryParameters: {'userId': userId});
    return (response.data as List).map((e) => Room.fromJson(e)).toList();
  }

  Future<Room> fetchRoomById(String roomId) async {
    final response = await dio.get('/rooms/$roomId');
    return Room.fromJson(response.data);
  }
}