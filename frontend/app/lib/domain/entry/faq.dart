class Faq {
  String faqIdx;
  String category;
  String categoryCode;
  String question;
  String answer;
  DateTime createdAt;

  Faq({
    required this.faqIdx,
    required this.category,
    required this.categoryCode,
    required this.question,
    required this.answer,
    required this.createdAt,
  });

  factory Faq.fromMap(Map<String, dynamic> json) {
    return Faq(
      faqIdx: json['faqIdx'] as String,
      category: json['category'] as String,
      categoryCode: json['categoryCode'] as String,
      question: json['question'] as String,
      answer: json['answer'] as String,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toMap() => {
        'faqIdx': faqIdx,
        'category': category,
        'categoryCode': categoryCode,
        'question': question,
        'answer': answer,
        'createdAt': createdAt.toIso8601String(),
      };
}
