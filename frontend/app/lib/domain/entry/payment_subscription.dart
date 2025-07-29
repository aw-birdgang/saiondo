class Subscription {
  final String id;
  final String userId;
  final String platform;
  final bool isValid;
  final DateTime expiresAt;
  final DateTime createdAt;

  Subscription({
    required this.id,
    required this.userId,
    required this.platform,
    required this.isValid,
    required this.expiresAt,
    required this.createdAt,
  });

  bool get isActive => isValid && expiresAt.isAfter(DateTime.now());

  Subscription copyWith({
    String? id,
    String? userId,
    String? platform,
    bool? isValid,
    DateTime? expiresAt,
    DateTime? createdAt,
  }) {
    return Subscription(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      platform: platform ?? this.platform,
      isValid: isValid ?? this.isValid,
      expiresAt: expiresAt ?? this.expiresAt,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
