import 'channel_member.dart';
import 'dart:convert';

class Channel {
  final String id;
  final String status;
  final DateTime startedAt;
  final DateTime? endedAt;
  final String? inviteCode;
  final DateTime? anniversary;
  final List<String>? keywords;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final DateTime? deletedAt;
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
    this.deletedAt,
    required this.members,
  });

  factory Channel.fromJson(Map<String, dynamic> json) => Channel(
        id: json['id'],
        status: json['status'],
        startedAt: DateTime.parse(json['startedAt']),
        endedAt: json['endedAt'] != null ? DateTime.tryParse(json['endedAt']) : null,
        inviteCode: json['inviteCode'],
        anniversary: json['anniversary'] != null ? DateTime.tryParse(json['anniversary']) : null,
        keywords: _parseKeywords(json['keywords']),
        createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt']) : null,
        updatedAt: json['updatedAt'] != null ? DateTime.tryParse(json['updatedAt']) : null,
        deletedAt: json['deletedAt'] != null ? DateTime.tryParse(json['deletedAt']) : null,
        members: (json['members'] as List<dynamic>?)
                ?.map((m) => ChannelMember.fromJson(m))
                .toList() ??
            [],
      );

  static List<String>? _parseKeywords(dynamic keywords) {
    if (keywords == null) return null;
    if (keywords is List) {
      return keywords.map((e) => e.toString()).toList();
    }
    if (keywords is String) {
      try {
        final decoded = jsonDecode(keywords);
        if (decoded is List) {
          return decoded.map((e) => e.toString()).toList();
        }
      } catch (_) {
        // 파싱 실패 시 그냥 문자열로 반환
        return [keywords];
      }
    }
    return null;
  }
}