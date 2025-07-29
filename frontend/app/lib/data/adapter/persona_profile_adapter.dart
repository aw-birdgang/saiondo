import '../../domain/entry/persona_profile.dart';
import '../network/dto/persona_profile_request.dart';
import '../network/dto/persona_profile_response.dart';

class PersonaProfileAdapter {
  static PersonaProfile? fromResponse(PersonaProfileResponse? res) {
    if (res == null) return null;
    return PersonaProfile(
      userId: res.userId,
      categoryCodeId: res.categoryCodeId,
      content: res.content,
      isStatic: res.isStatic,
      source: res.source,
      confidenceScore: res.confidenceScore,
    );
  }

  static PersonaProfileRequest toRequest(PersonaProfile profile) {
    return PersonaProfileRequest(
      userId: profile.userId,
      categoryCodeId: profile.categoryCodeId,
      content: profile.content,
      isStatic: profile.isStatic,
      source: profile.source,
      confidenceScore: profile.confidenceScore,
    );
  }
}
