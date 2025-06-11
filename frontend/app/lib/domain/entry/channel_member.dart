import 'user.dart';

class ChannelMember {
  final String userId;
  final String role;
  final User user;

  ChannelMember({required this.userId, required this.role, required this.user});

  factory ChannelMember.fromJson(Map<String, dynamic> json) => ChannelMember(
    userId: json['userId'],
    role: json['role'],
    user: User.fromJson(json['user']),
  );
}