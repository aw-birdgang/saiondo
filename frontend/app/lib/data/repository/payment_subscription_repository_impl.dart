import 'package:saiondo/data/network/apis/payment_subscription_api.dart';

import '../../domain/entry/payment_subscription.dart';
import '../../domain/entry/payment_subscription_history.dart';
import '../../domain/repository/payment_subscription_repository.dart';

class PaymentSubscriptionRepositoryImpl implements PaymentSubscriptionRepository {
  final PaymentSubscriptionApi api;
  PaymentSubscriptionRepositoryImpl(this.api);

  @override
  Future<Subscription?> getCurrentSubscription() async {
    return await api.getCurrentSubscription();
  }

  @override
  Future<List<SubscriptionHistory>> getSubscriptionHistory({String? userId}) async {
    return await api.getSubscriptionHistory(userId: userId);
  }

  @override
  Future<bool> verifyReceipt(String receipt, String platform) async {
    return await api.verifyReceipt(receipt, platform);
  }

  @override
  Future<void> saveSubscription(String receipt, String platform) async {
    await api.saveSubscription(receipt, platform);
  }
}
