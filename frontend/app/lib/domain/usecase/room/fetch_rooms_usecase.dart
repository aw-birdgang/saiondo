import '../../../data/network/dto/room_request.dart';
import '../../repository/room/room_repository.dart';

class FetchRoomsUseCase {
  final RoomRepository repository;
  FetchRoomsUseCase(this.repository);

  Future<List<Room>> call(String userId) => repository.fetchRooms(userId);
}