import 'package:mobx/mobx.dart';
import '../../../domain/entry/user/persona_profile.dart';
import '../../../domain/repository/user/user_repository.dart';

part 'persona_profile_store.g.dart';

class PersonaProfileStore = _PersonaProfileStore with _$PersonaProfileStore;

abstract class _PersonaProfileStore with Store {
  final UserRepository _userRepository;

  _PersonaProfileStore(this._userRepository);

  @observable
  ObservableList<PersonaProfile> profiles = ObservableList<PersonaProfile>();

  @observable
  bool isLoading = false;

  @action
  Future<void> loadProfiles(String userId) async {
    print('[PersonaProfileStore] loadProfiles: userId=$userId');
    isLoading = true;
    try {
      // 예시: 여러 프로필을 가져오는 API가 있다고 가정
      final result = await _userRepository.fetchPersonaProfiles(userId);
      profiles = ObservableList.of(result ?? []);
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> addProfile(String userId, PersonaProfile profile) async {
    isLoading = true;
    try {
      final newProfile = await _userRepository.createPersonaProfile(userId, profile);
      profiles.add(newProfile);
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> updateProfile(String userId, PersonaProfile profile) async {
    isLoading = true;
    try {
      final updated = await _userRepository.updatePersonaProfile(userId, profile);
      final idx = profiles.indexWhere((p) => p.categoryCodeId == profile.categoryCodeId);
      if (idx != -1) profiles[idx] = updated;
    } finally {
      isLoading = false;
    }
  }
}