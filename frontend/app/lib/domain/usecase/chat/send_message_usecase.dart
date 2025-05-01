import 'dart:async';

import 'package:either_dart/either.dart';

import '../../../core/domain/error/failure.dart';
import '../../../core/domain/usecase/use_case.dart';
import '../../entry/chat/chat.dart';
import '../../repository/chat/chat_repository.dart';

class SendMessageUseCase extends UseCase<Chat, String> {
  final ChatRepository repository;

  SendMessageUseCase(this.repository);

  @override
  Future<Either<Failure, Chat>> call({required String params}) async {
    return await repository.sendMessage(params);
  }
}