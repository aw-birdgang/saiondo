class CategoryCodeResponse {
  final String id;
  final String code;
  final String? description;

  CategoryCodeResponse({
    required this.id,
    required this.code,
    this.description,
  });

  factory CategoryCodeResponse.fromJson(Map<String, dynamic> json) {
    return CategoryCodeResponse(
      id: json['id'] as String,
      code: json['code'] as String,
      description: json['description'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'code': code,
    'description': description,
  };
}