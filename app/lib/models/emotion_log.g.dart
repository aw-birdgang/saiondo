// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'emotion_log.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class EmotionLogAdapter extends TypeAdapter<EmotionLog> {
  @override
  final int typeId = 0;

  @override
  EmotionLog read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return EmotionLog(
      date: fields[0] as String,
      emoji: fields[1] as String,
      temperature: fields[2] as int,
      tags: (fields[3] as List).cast<String>(),
      note: fields[4] as String,
      events: (fields[5] as List?)?.cast<String>(),
    );
  }

  @override
  void write(BinaryWriter writer, EmotionLog obj) {
    writer
      ..writeByte(6)
      ..writeByte(0)
      ..write(obj.date)
      ..writeByte(1)
      ..write(obj.emoji)
      ..writeByte(2)
      ..write(obj.temperature)
      ..writeByte(3)
      ..write(obj.tags)
      ..writeByte(4)
      ..write(obj.note)
      ..writeByte(5)
      ..write(obj.events);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is EmotionLogAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
