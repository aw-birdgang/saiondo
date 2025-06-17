import 'dart:async';

import 'package:flutter/material.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:mobx/mobx.dart';

import '../../../data/network/apis/payment_subscription_api.dart';

part 'payment_subscription_store.g.dart';

class PaymentSubscriptionStore = _PaymentSubscriptionStore with _$PaymentSubscriptionStore;

abstract class _PaymentSubscriptionStore with Store {
  final InAppPurchase _iap = InAppPurchase.instance;
  final PaymentSubscriptionApi api;

  _PaymentSubscriptionStore(this.api);

  @observable
  bool isAvailable = false;

  @observable
  List<ProductDetails> products = [];

  @observable
  bool purchasePending = false;

  @observable
  String? error;

  StreamSubscription<List<PurchaseDetails>>? _subscription;

  @action
  Future<void> initStoreInfo(Set<String> productIds) async {
    error = null;
    purchasePending = true;
    bool available = await _iap.isAvailable();
    print("PaymentSubscriptionStore >> initStoreInfo >> available::" + available.toString());
    isAvailable = available;
    if (!available) {
      error = '스토어를 사용할 수 없습니다.';
      purchasePending = false;
      return;
    }
    final ProductDetailsResponse response = await _iap.queryProductDetails(productIds);
    if (response.error != null) {
      error = response.error!.message;
      purchasePending = false;
      return;
    }
    products = response.productDetails;
    purchasePending = false;
  }

  @action
  void listenToPurchaseUpdates(BuildContext context) {
    _subscription?.cancel();
    _subscription = _iap.purchaseStream.listen(
      (purchases) => onPurchaseUpdated(purchases, context),
      onError: (e) {
        error = '결제 오류: $e';
        purchasePending = false;
      },
    );
  }

  @action
  Future<void> buySubscription(ProductDetails productDetails) async {
    final PurchaseParam purchaseParam = PurchaseParam(productDetails: productDetails);
    _iap.buyNonConsumable(purchaseParam: purchaseParam);
  }

  @action
  Future<void> onPurchaseUpdated(List<PurchaseDetails> purchases, BuildContext context) async {
    for (var purchase in purchases) {
      if (purchase.status == PurchaseStatus.purchased) {
        await verifyReceipt(purchase, context);
      }
      if (purchase.pendingCompletePurchase) {
        await _iap.completePurchase(purchase);
      }
    }
  }

  @action
  Future<void> verifyReceipt(PurchaseDetails purchase, BuildContext context) async {
    purchasePending = true;
    try {
      final platform = Theme.of(context).platform == TargetPlatform.iOS ? 'apple' : 'google';
      final receipt = purchase.verificationData.serverVerificationData;
      final isValid = await api.verifyReceipt(receipt, platform);
      if (isValid) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('구독 활성화 완료!')),
          );
        }
      } else {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('구독 실패')),
          );
        }
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('서버 오류: $e')),
        );
      }
    } finally {
      purchasePending = false;
    }
  }

  void dispose() {
    _subscription?.cancel();
  }
}