import '../../domain/entry/user.dart';
import '../network/dto/user_response.dart';

class UserAdapter {
  static User fromResponse(UserResponse res) => User(
    id: res.id,
    name: res.name,
    email: res.email,
    gender: res.gender,
    assistantId: res.assistantId,
    point: res.point,
  );
}