import 'package:equatable/equatable.dart';

class FirebaseFunctionResponse extends Equatable {
  final dynamic data;
  final String? message;
  final bool success;

  const FirebaseFunctionResponse({
    required this.data,
    this.message,
    required this.success,
  });

  @override
  List<Object?> get props => [data, message, success];
}