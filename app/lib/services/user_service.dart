import 'package:hive/hive.dart';
import '../models/user_profile.dart';

class UserService {
  static final Box<UserProfile> _box = Hive.box<UserProfile>('userProfile');

  static Future<void> registerUser(UserProfile profile) async {
    await _box.clear(); // 하나만 저장
    await _box.add(profile);
  }

  static UserProfile? getCurrentUser() {
    return _box.isNotEmpty ? _box.getAt(0) : null;
  }

  static bool login(String email, String password) {
    final user = getCurrentUser();
    return user != null && user.email == email; // password 없이 비교
  }

  static Future<void> logout() async {
    await _box.clear();
  }
}