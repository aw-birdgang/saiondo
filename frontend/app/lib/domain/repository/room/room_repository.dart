import '../../../data/network/dto/room_request.dart';

abstract class RoomRepository {
  Future<List<Room>> fetchRooms(String userId);
  Future<Room> fetchRoomById(String roomId);
}