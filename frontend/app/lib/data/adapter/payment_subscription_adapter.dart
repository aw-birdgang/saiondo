import '../../domain/entry/payment_subscription.dart';

class SubscriptionAdapter {
  static Subscription fromJson(Map<String, dynamic> json) {
    return Subscription(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      platform: json['platform'] ?? '',
      isValid: json['isValid'] ?? false,
      expiresAt: (json['expiresAt'] != null && json['expiresAt'] is String)
          ? DateTime.tryParse(json['expiresAt']) ?? DateTime.now()
          : DateTime.now(),
      createdAt: (json['createdAt'] != null && json['createdAt'] is String)
          ? DateTime.tryParse(json['createdAt']) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  static Map<String, dynamic> toJson(Subscription subscription) {
    return {
      'id': subscription.id,
      'userId': subscription.userId,
      'platform': subscription.platform,
      'isValid': subscription.isValid,
      'expiresAt': subscription.expiresAt.toIso8601String(),
      'createdAt': subscription.createdAt.toIso8601String(),
    };
  }
}
