import '../../../core/data/network/dio/dio_client.dart';
import '../../../domain/entry/payment_subscription.dart';
import '../../../domain/entry/payment_subscription_history.dart';
import '../../adapter/payment_subscription_adapter.dart';
import '../../adapter/payment_subscription_history_adapter.dart';
import '../constants/endpoints.dart';
import '../dto/payment_subscription_dto.dart';
import '../rest_client.dart';

class PaymentSubscriptionApi {
  final DioClient _dioClient;
  // final RestClient _restClient;

  PaymentSubscriptionApi(this._dioClient);

  Future<Subscription?> getCurrentSubscription() async {
    try {
      final response =
          await _dioClient.dio.get(Endpoints.paymentSubscriptionCurrent);
      print('getCurrentSubscription response: ${response.data}');
      if (response.statusCode == 204 || response.data == null) {
        return null;
      }
      return SubscriptionAdapter.fromJson(response.data);
    } catch (e) {
      print('getCurrentSubscription error: $e');
      return null;
    }
  }

  Future<List<SubscriptionHistory>> getSubscriptionHistory(
      {String? userId}) async {
    try {
      final endpoint = userId == null
          ? Endpoints.paymentSubscriptionHistories
          : Endpoints.paymentSubscriptionHistoriesByUser(userId);
      final response = await _dioClient.dio.get(endpoint);
      final List data = response.data;
      return data
          .map<SubscriptionHistory>(
              (e) => SubscriptionHistoryAdapter.fromJson(e))
          .toList();
    } catch (e) {
      print('getSubscriptionHistory error: $e');
      return [];
    }
  }

  Future<bool> verifyReceipt(String receipt, String platform) async {
    try {
      final dto = VerifyReceiptDto(
        receipt: receipt,
        platform: platform,
      );

      final response = await _dioClient.dio.post(
        Endpoints.paymentSubscriptionVerify,
        data: dto.toJson(),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('verifyReceipt error: $e');
      return false;
    }
  }

  Future<void> saveSubscription(String receipt, String platform) async {
    try {
      final dto = SaveSubscriptionDto(
        receipt: receipt,
        platform: platform,
      );

      final response = await _dioClient.dio.post(
        Endpoints.paymentSubscriptionSave,
        data: dto.toJson(),
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to save subscription');
      }
    } catch (e) {
      print('saveSubscription error: $e');
      throw Exception('Failed to save subscription: $e');
    }
  }
}
