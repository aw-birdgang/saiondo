class UserRequest {
  final String id;
  final String name;
  final String email;
  final String gender;
  final String? assistantId;

  UserRequest({
    required this.id,
    required this.name,
    required this.email,
    required this.gender,
    this.assistantId,
  });

  factory UserRequest.fromJson(Map<String, dynamic> json) => UserRequest(
        id: json['id'],
        name: json['name'],
        email: json['email'],
        gender: json['gender'],
        assistantId: json['assistantId'],
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'gender': gender,
        'assistantId': assistantId,
      };
}
