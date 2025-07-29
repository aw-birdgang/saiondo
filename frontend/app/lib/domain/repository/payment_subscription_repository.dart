import '../entry/payment_subscription.dart';
import '../entry/payment_subscription_history.dart';

abstract class PaymentSubscriptionRepository {
  Future<Subscription?> getCurrentSubscription();
  Future<List<SubscriptionHistory>> getSubscriptionHistory({String? userId});
  Future<bool> verifyReceipt(String receipt, String platform);
  Future<void> saveSubscription(String receipt, String platform);
}
