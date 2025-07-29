import '../../repository/payment_subscription_repository.dart';

class PaymentSubscriptionUseCases {
  final PaymentSubscriptionRepository repository;

  PaymentSubscriptionUseCases(this.repository);

  Future<bool> purchaseSubscription(String receipt, String platform) async {
    final isValid = await repository.verifyReceipt(receipt, platform);
    if (isValid) {
      await repository.saveSubscription(receipt, platform);
    }
    return isValid;
  }

  Future<bool> isSubscriptionActive() async {
    final subscription = await repository.getCurrentSubscription();
    if (subscription == null) return false;
    return subscription.isValid &&
        subscription.expiresAt.isAfter(DateTime.now());
  }
}
