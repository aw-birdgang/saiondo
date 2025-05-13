class UserRequest {
  final String id;
  final String name;
  final String email;
  final String gender;
  final String? roomId;

  UserRequest({
    required this.id,
    required this.name,
    required this.email,
    required this.gender,
    this.roomId,
  });

  factory UserRequest.fromJson(Map<String, dynamic> json) => UserRequest(
        id: json['id'],
        name: json['name'],
        email: json['email'],
        gender: json['gender'],
        roomId: json['roomId'],
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'gender': gender,
        'roomId': roomId,
      };
}
