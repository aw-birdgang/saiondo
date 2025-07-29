// lib/data/adapter/payment_subscription_adapter.dart
import '../../domain/entry/payment_subscription_history.dart';

class SubscriptionHistoryAdapter {
  static SubscriptionHistory fromJson(Map<String, dynamic> json) {
    return SubscriptionHistory(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      plan: json['plan'] ?? '',
      startedAt: json['startedAt'] != null
          ? DateTime.parse(json['startedAt'])
          : DateTime.fromMillisecondsSinceEpoch(0),
      expiredAt: json['expiredAt'] != null
          ? DateTime.parse(json['expiredAt'])
          : DateTime.fromMillisecondsSinceEpoch(0),
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.fromMillisecondsSinceEpoch(0),
    );
  }

  static Map<String, dynamic> toJson(SubscriptionHistory history) {
    return {
      'id': history.id,
      'userId': history.userId,
      'plan': history.plan,
      'startedAt': history.startedAt.toIso8601String(),
      'expiredAt': history.expiredAt.toIso8601String(),
      'createdAt': history.createdAt.toIso8601String(),
    };
  }
}
