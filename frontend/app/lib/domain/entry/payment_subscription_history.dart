class SubscriptionHistory {
  final String id;
  final String userId;
  final String plan;
  final DateTime startedAt;
  final DateTime expiredAt;
  final DateTime createdAt;

  SubscriptionHistory({
    required this.id,
    required this.userId,
    required this.plan,
    required this.startedAt,
    required this.expiredAt,
    required this.createdAt,
  });
}
