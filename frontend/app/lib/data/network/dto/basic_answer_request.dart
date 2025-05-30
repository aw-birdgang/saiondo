class BasicAnswerRequest {
  final String userId;
  final String questionId;
  final String answer;

  BasicAnswerRequest({
    required this.userId,
    required this.questionId,
    required this.answer,
  });

  Map<String, dynamic> toJson() => {
    'userId': userId,
    'questionId': questionId,
    'answer': answer,
  };
}
