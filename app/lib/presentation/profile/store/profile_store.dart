// lib/presentation/profile/store/profile_store.dart

import 'package:app/domain/entities/user/user.dart';
import 'package:app/domain/usecases/user/get_current_user_usecase.dart';
import 'package:app/domain/usecases/user/update_profile_usecase.dart';
import 'package:dartz/dartz.dart';
import 'package:mobx/mobx.dart';

part 'profile_store.g.dart';

class ProfileStore = _ProfileStore with _$ProfileStore;

abstract class _ProfileStore with Store {

  // constructor:---------------------------------------------------------------
  _ProfileStore(
      this._getCurrentUserUseCase,
      this._updateProfileUseCase,
  ) {}

  final GetCurrentUserUseCase _getCurrentUserUseCase;
  final UpdateProfileUseCase _updateProfileUseCase;

  @observable
  bool isLoading = false;

  @observable
  User? user;

  @observable
  String? error;

  @computed
  bool get hasUser => user != null;

  @action
  Future<void> loadUserProfile() async {
    try {
      isLoading = true;
      error = null;
      final result = await _getCurrentUserUseCase.call();
      result.fold(
            (failure) => error = failure.message,
            (currentUser) => user = currentUser,
      );
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> updateProfile({
    String? displayName,
    String? photoUrl,
    String? mbti,
    String? loveLanguage,
  }) async {
    if (!hasUser) {
      error = "사용자 정보가 없습니다.";
      return;
    }

    try {
      isLoading = true;
      error = null;

      final updatedUser = user!.copyWith(
        displayName: displayName,
        photoUrl: photoUrl,
        mbti: mbti,
        loveLanguage: loveLanguage,
      );

      final result = await _updateProfileUseCase.call(
        UpdateProfileParams(updatedUser),
      );

      result.fold(
            (failure) => error = failure.message,
            (_) => loadUserProfile(),
      );
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  @action
  void reset() {
    isLoading = false;
    user = null;
    error = null;
  }
}