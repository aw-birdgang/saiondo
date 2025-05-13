import '../../domain/entry/user/persona_profile.dart';
import '../network/dto/persona_profile_request.dart';
import '../network/dto/persona_profile_response.dart';

class PersonaProfileAdapter {
  static PersonaProfile? fromResponse(PersonaProfileResponse? res) {
    if (res == null) return null;
    return PersonaProfile(
      categoryCodeId: res.categoryCodeId,
      content: res.content,
      confidenceScore: res.confidenceScore,
    );
  }

  static PersonaProfileRequest toRequest(PersonaProfile profile) {
    return PersonaProfileRequest(
      categoryCodeId: profile.categoryCodeId,
      content: profile.content,
      confidenceScore: profile.confidenceScore,
    );
  }
}
