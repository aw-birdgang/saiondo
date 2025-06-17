// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'payment_subscription_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$PaymentSubscriptionStore on _PaymentSubscriptionStore, Store {
  late final _$isAvailableAtom =
      Atom(name: '_PaymentSubscriptionStore.isAvailable', context: context);

  @override
  bool get isAvailable {
    _$isAvailableAtom.reportRead();
    return super.isAvailable;
  }

  @override
  set isAvailable(bool value) {
    _$isAvailableAtom.reportWrite(value, super.isAvailable, () {
      super.isAvailable = value;
    });
  }

  late final _$productsAtom =
      Atom(name: '_PaymentSubscriptionStore.products', context: context);

  @override
  List<ProductDetails> get products {
    _$productsAtom.reportRead();
    return super.products;
  }

  @override
  set products(List<ProductDetails> value) {
    _$productsAtom.reportWrite(value, super.products, () {
      super.products = value;
    });
  }

  late final _$purchasePendingAtom =
      Atom(name: '_PaymentSubscriptionStore.purchasePending', context: context);

  @override
  bool get purchasePending {
    _$purchasePendingAtom.reportRead();
    return super.purchasePending;
  }

  @override
  set purchasePending(bool value) {
    _$purchasePendingAtom.reportWrite(value, super.purchasePending, () {
      super.purchasePending = value;
    });
  }

  late final _$errorAtom =
      Atom(name: '_PaymentSubscriptionStore.error', context: context);

  @override
  String? get error {
    _$errorAtom.reportRead();
    return super.error;
  }

  @override
  set error(String? value) {
    _$errorAtom.reportWrite(value, super.error, () {
      super.error = value;
    });
  }

  late final _$initStoreInfoAsyncAction =
      AsyncAction('_PaymentSubscriptionStore.initStoreInfo', context: context);

  @override
  Future<void> initStoreInfo(Set<String> productIds) {
    return _$initStoreInfoAsyncAction
        .run(() => super.initStoreInfo(productIds));
  }

  late final _$buySubscriptionAsyncAction = AsyncAction(
      '_PaymentSubscriptionStore.buySubscription',
      context: context);

  @override
  Future<void> buySubscription(ProductDetails productDetails) {
    return _$buySubscriptionAsyncAction
        .run(() => super.buySubscription(productDetails));
  }

  late final _$onPurchaseUpdatedAsyncAction = AsyncAction(
      '_PaymentSubscriptionStore.onPurchaseUpdated',
      context: context);

  @override
  Future<void> onPurchaseUpdated(
      List<PurchaseDetails> purchases, BuildContext context) {
    return _$onPurchaseUpdatedAsyncAction
        .run(() => super.onPurchaseUpdated(purchases, context));
  }

  late final _$verifyReceiptAsyncAction =
      AsyncAction('_PaymentSubscriptionStore.verifyReceipt', context: context);

  @override
  Future<void> verifyReceipt(PurchaseDetails purchase, BuildContext context) {
    return _$verifyReceiptAsyncAction
        .run(() => super.verifyReceipt(purchase, context));
  }

  late final _$_PaymentSubscriptionStoreActionController =
      ActionController(name: '_PaymentSubscriptionStore', context: context);

  @override
  void listenToPurchaseUpdates(BuildContext context) {
    final _$actionInfo = _$_PaymentSubscriptionStoreActionController
        .startAction(name: '_PaymentSubscriptionStore.listenToPurchaseUpdates');
    try {
      return super.listenToPurchaseUpdates(context);
    } finally {
      _$_PaymentSubscriptionStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
isAvailable: ${isAvailable},
products: ${products},
purchasePending: ${purchasePending},
error: ${error}
    ''';
  }
}
