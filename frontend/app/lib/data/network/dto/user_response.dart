class UserResponse {
  final String id;
  final String name;
  final String email;
  final String gender;
  final String? assistantId;
  final int point;

  UserResponse({
    required this.id,
    required this.name,
    required this.email,
    required this.gender,
    this.assistantId,
    required this.point,
  });

  factory UserResponse.fromJson(Map<String, dynamic> json) => UserResponse(
        id: json['id'],
        name: json['name'],
        email: json['email'],
        gender: json['gender'],
        assistantId: json['assistantId'],
        point: json['point'] ?? 0,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'gender': gender,
        'assistantId': assistantId,
        'point': point,
      };
}
