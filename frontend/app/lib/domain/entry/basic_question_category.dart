class BasicQuestionCategory {
  final String id;
  final String code;
  final String name;
  final String? description;

  BasicQuestionCategory({
    required this.id,
    required this.code,
    required this.name,
    this.description,
  });

  factory BasicQuestionCategory.fromJson(Map<String, dynamic> json) => BasicQuestionCategory(
    id: json['id'],
    code: json['code'],
    name: json['name'],
    description: json['description'],
  );
}
