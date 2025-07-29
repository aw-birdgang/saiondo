import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import 'store/payment_subscription_store.dart';

class PaymentSubscriptionScreen extends StatefulWidget {
  final Set<String> productIds;

  const PaymentSubscriptionScreen({
    Key? key,
    this.productIds = const {'your_subscription_id'},
  }) : super(key: key);

  @override
  State<PaymentSubscriptionScreen> createState() =>
      _PaymentSubscriptionScreenState();
}

class _PaymentSubscriptionScreenState extends State<PaymentSubscriptionScreen> {
  final paymentSubscriptionStore = getIt<PaymentSubscriptionStore>();

  @override
  void initState() {
    super.initState();
    paymentSubscriptionStore.initStoreInfo(widget.productIds);
    paymentSubscriptionStore.listenToPurchaseUpdates(context);
  }

  @override
  void dispose() {
    paymentSubscriptionStore.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) {
        if (paymentSubscriptionStore.purchasePending) {
          return const Center(child: CircularProgressIndicator());
        }
        if (paymentSubscriptionStore.error != null) {
          return Center(
              child: Text(paymentSubscriptionStore.error!,
                  style: const TextStyle(color: Colors.red)));
        }
        if (!paymentSubscriptionStore.isAvailable) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('스토어를 사용할 수 없습니다.'),
                const SizedBox(height: 8),
                Text(
                  '기기에서 Google Play/Apple App Store에 로그인되어 있는지,\n네트워크 연결 상태, 인앱결제 상품 등록 여부를 확인하세요.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                ),
              ],
            ),
          );
        }
        if (paymentSubscriptionStore.products.isEmpty) {
          return const Center(child: Text('구독 상품이 없습니다.'));
        }
        return ListView(
          padding: const EdgeInsets.all(16),
          children: paymentSubscriptionStore.products.map((product) {
            return Card(
              child: ListTile(
                title: Text(product.title),
                subtitle: Text(product.description),
                trailing: ElevatedButton(
                  onPressed: () =>
                      paymentSubscriptionStore.buySubscription(product),
                  child: Text(product.price),
                ),
              ),
            );
          }).toList(),
        );
      },
    );
  }
}
