import 'package:either_dart/either.dart';
import '../../core/domain/error/failure.dart';
import '../entry/faq.dart';
import '../entry/faq_list.dart';

abstract class FaqRepository {
  Future<Either<Failure, FaqList>> getFaqs();
  Future<Either<Failure, Faq>> findFaqById(int id);
  Future<Either<Failure, int>> insertFaq(Faq faq);
  Future<Either<Failure, int>> updateFaq(Faq faq);
  Future<Either<Failure, int>> deleteFaq(int id);
}
