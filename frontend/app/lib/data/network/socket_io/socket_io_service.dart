import 'package:socket_io_client/socket_io_client.dart' as IO;

typedef MessageCallback = void Function(dynamic data);
typedef StatusCallback = void Function(bool connected);

class SocketIoService {
  late IO.Socket _socket;
  final String url;
  final String path;

  SocketIoService({
    required this.url,
    this.path = '',
  });

  void connect({
    required Function(dynamic) onMessage,
    required Function(bool) onStatus,
    Function(dynamic)? onError,
  }) {
    print('[Socket.io] connect() called');
    _socket = IO.io(
      'http://10.0.2.2:3000',
      IO.OptionBuilder().setTransports(['websocket']).build(),
    );

    _socket.onConnect((_) {
      print('[Socket.io] Connected!');
      onStatus(true);
    });

    _socket.onDisconnect((_) {
      print('[Socket.io] Disconnected!');
      onStatus(false);
    });

    _socket.off('receive_message');
    _socket.on('receive_message', (data) {
      print('[Socket.io] Received: $data');
      onMessage(data);
    });

    //커스텀 에러(서버 emit('error'))
    _socket.on('error', (err) {
      print('[Socket.io] Custom error event: $err');
      if (onError != null) {
        onError(err);
      }
    });

    // 네트워크/연결/프로토콜 에러
    _socket.onError((err) {
      print('[Socket.io] Socket error: $err');
      onStatus(false);
    });

    _socket.onConnecting((_) {
      print('[Socket.io] Connecting...');
    });

    _socket.connect();
  }

  void sendMessage(
      String userId, String assistantId, String channelId, String message) {
    print('[Socket.io] sendMessage: $userId, $assistantId, $message');
    _socket.emit('send_message', {
      'userId': userId,
      'assistantId': assistantId,
      'channelId': channelId,
      'message': message,
    });
  }

  void disconnect() {
    print('[Socket.io] disconnect() called');
    _socket.disconnect();
  }
}
