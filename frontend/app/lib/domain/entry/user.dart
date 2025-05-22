class User {
  final String id;
  final String name;
  final String email;
  final String gender;
  final String? assistantId;
  final String? fcmToken;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.gender,
    this.assistantId,
    this.fcmToken,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    if (json['id'] == null || json['name'] == null || json['email'] == null || json['gender'] == null) {
      throw Exception('User JSON에 필수 필드가 없습니다: $json');
    }
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      gender: json['gender'],
      assistantId: json['assistantId'],
      fcmToken: json['fcmToken'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'gender': gender,
    'assistantId': assistantId,
    'fcmToken': fcmToken,
  };
}