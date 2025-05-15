// import 'dart:async';
// import 'dart:convert';
// import 'package:web_socket_channel/web_socket_channel.dart';
//
// enum ChatConnectionStatus { connected, connecting, disconnected, error }
//
// class ChatWebSocketService {
//   final String url;
//   WebSocketChannel? _channel;
//   final _messageController = StreamController<String>.broadcast();
//   final _statusController = StreamController<ChatConnectionStatus>.broadcast();
//
//   bool _isClosed = false;
//
//   Stream<String> get messages => _messageController.stream;
//   Stream<ChatConnectionStatus> get status => _statusController.stream;
//
//   ChatWebSocketService(this.url);
//
//   void connect() {
//     if (_isClosed) return;
//     print('[WebSocket] connect() called');
//     _statusController.add(ChatConnectionStatus.connecting);
//     try {
//       _channel = WebSocketChannel.connect(Uri.parse(url));
//       print('[WebSocket] Connected to $url');
//       _statusController.add(ChatConnectionStatus.connected);
//
//       _channel!.stream.listen(
//         (data) {
//           print('[WebSocket] Received: $data');
//           if (!_isClosed) _messageController.add(data);
//         },
//         onDone: () {
//           print('[WebSocket] Connection closed (onDone)');
//           if (!_isClosed) _statusController.add(ChatConnectionStatus.disconnected);
//         },
//         onError: (error) {
//           print('[WebSocket] Error: $error');
//           if (!_isClosed) _statusController.add(ChatConnectionStatus.error);
//         },
//         cancelOnError: true,
//       );
//     } catch (e) {
//       print('[WebSocket] Exception: $e');
//       if (!_isClosed) _statusController.add(ChatConnectionStatus.error);
//     }
//   }
//
//   void send(dynamic message) {
//     if (_channel != null && !_isClosed) {
//       print('[WebSocket] Sending: $message');
//       if (message is String) {
//         _channel!.sink.add(message);
//       } else {
//         _channel!.sink.add(jsonEncode(message));
//       }
//     } else {
//       print('[WebSocket] send() called but channel is null or closed');
//     }
//   }
//
//   void disconnect() {
//     print('[WebSocket] disconnect() called');
//     _channel?.sink.close();
//     if (!_isClosed) {
//       _statusController.add(ChatConnectionStatus.disconnected);
//     }
//   }
//
//   void dispose() {
//     print('[WebSocket] dispose() called');
//     _isClosed = true;
//     _channel?.sink.close();
//     _messageController.close();
//     _statusController.close();
//   }
// }