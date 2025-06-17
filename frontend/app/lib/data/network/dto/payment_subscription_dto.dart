class VerifyReceiptDto {
  final String receipt;
  final String platform;

  VerifyReceiptDto({
    required this.receipt,
    required this.platform,
  });

  Map<String, dynamic> toJson() {
    return {
      'receipt': receipt,
      'platform': platform,
    };
  }
}

class SaveSubscriptionDto {
  final String receipt;
  final String platform;

  SaveSubscriptionDto({
    required this.receipt,
    required this.platform,
  });

  Map<String, dynamic> toJson() {
    return {
      'receipt': receipt,
      'platform': platform,
    };
  }
}
