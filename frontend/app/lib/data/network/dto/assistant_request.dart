class AssistantCreateRequest {
  final String userId;
  final String channelId;

  AssistantCreateRequest({required this.userId, required this.channelId});

  Map<String, dynamic> toJson() => {
        'userId': userId,
        'channelId': channelId,
        // 기타 필드
      };
}

class AssistantUpdateRequest {
  // 수정 가능한 필드들
  final String? channelId;
  // 기타 필드

  AssistantUpdateRequest({this.channelId});

  Map<String, dynamic> toJson() => {
        if (channelId != null) 'channelId': channelId,
        // 기타 필드
      };
}
