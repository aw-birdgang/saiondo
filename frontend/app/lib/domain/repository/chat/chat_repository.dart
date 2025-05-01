import 'package:either_dart/either.dart';

import '../../../core/domain/error/failure.dart';
import '../../entry/chat/chat.dart';

abstract class ChatRepository {
  Future<Either<Failure, Chat>> sendMessage(String message);
  Stream<List<Chat>> getMessages();
}