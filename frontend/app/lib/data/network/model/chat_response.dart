class ChatResponse {
  final String response;
  ChatResponse({required this.response});
  factory ChatResponse.fromJson(Map<String, dynamic> json) =>
      ChatResponse(response: json['response'] ?? '');
}