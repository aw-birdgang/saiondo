import '../../data/network/apis/room_api.dart';
import '../../domain/repository/room/room_repository.dart';
import '../network/dto/room_request.dart';

class RoomRepositoryImpl implements RoomRepository {
  final RoomApi api;
  RoomRepositoryImpl(this.api);

  @override
  Future<List<Room>> fetchRooms(String userId) => api.fetchRooms(userId);

  @override
  Future<Room> fetchRoomById(String roomId) => api.fetchRoomById(roomId);
}