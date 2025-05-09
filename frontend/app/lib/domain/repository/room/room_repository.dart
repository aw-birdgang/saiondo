import '../../../data/network/model/room.dart';

abstract class RoomRepository {
  Future<List<Room>> fetchRooms(String userId);
  Future<Room> fetchRoomById(String roomId);
}