import 'package:socket_io_client/socket_io_client.dart' as IO;

class ChatWebSocket {
  static final ChatWebSocket _instance = ChatWebSocket._internal();
  factory ChatWebSocket() => _instance;
  ChatWebSocket._internal();

  IO.Socket? _socket;
  bool _isConnected = false;

  void connect({
    required void Function(dynamic data) onReceiveMessage,
    void Function()? onConnect,
    void Function(dynamic error)? onError,
    void Function()? onDisconnect,
  }) {
    if (_isConnected) {
      print('[App][Socket.IO] Already connected, skipping connect()');
      return;
    }

    print('[App][Socket.IO] Connecting...');
    _socket = IO.io(
      'http://10.0.2.2:3000',
      IO.OptionBuilder().setTransports(['websocket']).build(),
    );

    _socket!.onConnect((_) {
      _isConnected = true;
      print('[App][Socket.IO] Connected! socket.id: ${_socket!.id}');
      if (onConnect != null) onConnect();
    });

    _socket!.on('receive_message', (data) {
      print('[App][Socket.IO] Received: $data');
      onReceiveMessage(data);
    });

    _socket!.onDisconnect((_) {
      _isConnected = false;
      print('[App][Socket.IO] Disconnected');
      if (onDisconnect != null) onDisconnect();
    });

    _socket!.onError((err) {
      print('[App][Socket.IO] Error: $err');
      if (onError != null) onError(err);
    });
  }

  void sendMessage(String userId, String roomId, String message) {
    print('[App][Socket.IO] sendMessage called');
    _socket?.emit('send_message', {
      'userId': userId,
      'roomId': roomId,
      'message': message,
    });
  }

  void disconnect() {
    print('[App][Socket.IO] disconnect() called');
    _socket?.disconnect();
    _isConnected = false;
  }
}