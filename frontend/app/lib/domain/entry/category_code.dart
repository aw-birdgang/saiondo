class CategoryCode {
  final String id;
  final String code;
  final String? description;

  const CategoryCode({
    required this.id,
    required this.code,
    this.description,
  });

  factory CategoryCode.fromJson(Map<String, dynamic> json) {
    return CategoryCode(
      id: json['id'] ?? '',
      code: json['code'] ?? '',
      description: json['description'] ?? '',
    );
  }
}
