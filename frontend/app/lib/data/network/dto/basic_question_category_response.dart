class BasicQuestionCategoryResponse {
  final String id;
  final String code;
  final String name;

  BasicQuestionCategoryResponse({
    required this.id,
    required this.code,
    required this.name,
  });

  factory BasicQuestionCategoryResponse.fromJson(Map<String, dynamic> json) =>
      BasicQuestionCategoryResponse(
        id: json['id'],
        code: json['code'],
        name: json['name'],
      );
}
