import 'package:mobx/mobx.dart';
import '../../../domain/entry/persona_profile.dart';
import '../../../domain/repository/user_repository.dart';

part 'persona_profile_store.g.dart';

class PersonaProfileStore = _PersonaProfileStore with _$PersonaProfileStore;

abstract class _PersonaProfileStore with Store {
  final UserRepository _userRepository;

  _PersonaProfileStore(this._userRepository);

  @observable
  ObservableList<PersonaProfile> profiles = ObservableList<PersonaProfile>();

  @observable
  bool isLoading = false;

  @observable
  String? error;

  @action
  Future<void> loadProfiles(String userId) async {
    print('[PersonaProfileStore] loadProfiles: userId=$userId');
    isLoading = true;
    error = null;
    try {
      final result = await _userRepository.fetchPersonaProfiles(userId);
      profiles = ObservableList.of(result ?? []);
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> addProfile(String userId, PersonaProfile profile) async {
    isLoading = true;
    error = null;
    try {
      final newProfile =
          await _userRepository.createPersonaProfile(userId, profile);
      profiles.add(newProfile);
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> updateProfile(String userId, PersonaProfile profile) async {
    isLoading = true;
    error = null;
    try {
      final updated =
          await _userRepository.updatePersonaProfile(userId, profile);
      final idx = profiles
          .indexWhere((p) => p.categoryCodeId == updated.categoryCodeId);
      if (idx != -1) profiles[idx] = updated;
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> deleteProfile(String userId, String categoryCodeId) async {
    isLoading = true;
    error = null;
    try {
      await _userRepository.deletePersonaProfile(userId, categoryCodeId);
      profiles.removeWhere((p) => p.categoryCodeId == categoryCodeId);
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }
}
