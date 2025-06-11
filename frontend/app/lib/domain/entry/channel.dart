import 'channel_member.dart';

class Channel {
  final String id;
  final String status;
  final DateTime startedAt;
  final DateTime? endedAt;
  final String? inviteCode;
  final DateTime? anniversary;
  final String? keywords;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final List<ChannelMember> members;

  Channel({
    required this.id,
    required this.status,
    required this.startedAt,
    this.endedAt,
    this.inviteCode,
    this.anniversary,
    this.keywords,
    this.createdAt,
    this.updatedAt,
    required this.members,
  });

  factory Channel.fromJson(Map<String, dynamic> json) => Channel(
        id: json['id'],
        status: json['status'],
        startedAt: DateTime.parse(json['startedAt']),
        endedAt: json['endedAt'] != null ? DateTime.parse(json['endedAt']) : null,
        inviteCode: json['inviteCode'],
        anniversary: json['anniversary'] != null ? DateTime.parse(json['anniversary']) : null,
        keywords: json['keywords'],
        createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
        updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
        members: (json['members'] as List<dynamic>?)
                ?.map((m) => ChannelMember.fromJson(m))
                .toList() ??
            [],
      );
}