import 'package:app/data/network/apis/user_api.dart';

class UpdateFcmTokenUseCase {
  final UserApi _userApi;
  UpdateFcmTokenUseCase(this._userApi);

  Future<void> call(String userId, String fcmToken) async {
    await _userApi.updateFcmToken(userId, fcmToken);
  }
}