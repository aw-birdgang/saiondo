import 'dart:async';
import 'package:app/core/domain/error/failure.dart';
import 'package:either_dart/either.dart';
import '../../../domain/entry/chat/chat.dart';
import '../../../domain/repository/chat/chat_repository.dart';
import '../../network/apis/chats/chst_api.dart';

class ChatRepositoryImpl implements ChatRepository {
  final List<Chat> _messages = [];
  final _messageController = StreamController<List<Chat>>.broadcast();
  final ChatApi _chatApi;

  ChatRepositoryImpl(this._chatApi);

  @override
  Future<Either<Failure, Chat>> sendMessage(String message) async {
    try {
      // 사용자 메시지 추가
      final userMessage = Chat(
        id: DateTime.now().toString(),
        content: message,
        isUser: true,
        createdAt: DateTime.now(),
      );
      _messages.add(userMessage);
      _messageController.add(_messages);

      // API 호출
      try {
        final chatResponse = await _chatApi.sendMessage(message);

        // 서버 응답 메시지 추가
        final botMessage = Chat(
          id: DateTime.now().toString(),
          content: chatResponse.response,  // 타입 안전한 접근
          isUser: false,
          createdAt: DateTime.now(),
        );

        _messages.add(botMessage);
        _messageController.add(_messages);

        return Right(botMessage);
      } catch (apiError) {
        return Left(ChatFailure(
            message: 'API Error: ${apiError.toString()}'
        ));
      }
    } catch (e) {
      return Left(ChatFailure(
          message: 'Failed to send message: ${e.toString()}'
      ));
    }
  }

  @override
  Stream<List<Chat>> getMessages() {
    return _messageController.stream;
  }

  void dispose() {
    _messageController.close();
  }
}