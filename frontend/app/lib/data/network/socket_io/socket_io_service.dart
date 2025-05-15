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
  }) {
    print('[Socket.io] connect() called');
    // _socket = IO.io(
    //   url,
    //   IO.OptionBuilder()
    //     .setTransports(['websocket'])
    //     .setPath(path)
    //     .disableAutoConnect()
    //     .build(),
    // );
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

    _socket.on('receive_message', (data) {
      print('[Socket.io] Received: $data');
      onMessage(data);
    });

    _socket.onError((err) {
      print('[Socket.io] Error: $err');
      onStatus(false);
    });

    _socket.onConnecting((_) {
      print('[Socket.io] Connecting...');
    });

    _socket.connect();
  }

  void sendMessage(String userId, String roomId, String message) {
    print('[Socket.io] sendMessage: $userId, $roomId, $message');
    _socket.emit('send_message', {
      'userId': userId,
      'roomId': roomId,
      'message': message,
    });
  }

  void disconnect() {
    print('[Socket.io] disconnect() called');
    _socket.disconnect();
  }
}