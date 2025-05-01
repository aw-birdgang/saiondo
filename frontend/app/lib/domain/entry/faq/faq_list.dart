import 'faq.dart';

class FaqList {
  final List<Faq>? faqs;

  FaqList({
    this.faqs,
  });

  factory FaqList.fromJson(Map<String, dynamic> json) {
    List<Faq> faqs = (json['items'] as List).map((faq) => Faq.fromMap(faq)).toList();

    return FaqList(
      faqs: faqs,
    );
  }
}