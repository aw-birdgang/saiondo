import '../../domain/entry/user/persona_profile.dart';
import '../network/dto/persona_profile_response.dart';

class PersonaProfileAdapter {
  static PersonaProfile fromResponse(PersonaProfileResponse res) => PersonaProfile(
    categoryCodeId: res.categoryCodeId,
    content: res.content,
    confidenceScore: res.confidenceScore,
  );
}
