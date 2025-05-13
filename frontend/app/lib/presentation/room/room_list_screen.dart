import 'package:flutter/material.dart';

import '../../data/network/dto/room_request.dart';

class RoomListScreen extends StatelessWidget {
  final List<Room> rooms;
  final void Function(Room) onRoomTap;

  const RoomListScreen({required this.rooms, required this.onRoomTap, super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: rooms.length,
      itemBuilder: (context, index) {
        final room = rooms[index];
        return ListTile(
          title: Text('Room: ${room.id.substring(0, 8)}'),
          subtitle: Text('Relationship: ${room.relationshipId}'),
          onTap: () => onRoomTap(room),
        );
      },
    );
  }
}