class User {
  final String id;
  final String name;
  final String email;
  final String gender;
  // 필요시 room 정보 등 추가

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.gender,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json['id'],
        name: json['name'],
        email: json['email'],
        gender: json['gender'],
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'gender': gender,
      };
}
