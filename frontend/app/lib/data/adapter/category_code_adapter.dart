import '../../domain/entry/category_code.dart';
import '../network/dto/category_code_response.dart';

class CategoryCodeDtoAdapter{
  static CategoryCode fromResponse(CategoryCodeResponse res) => CategoryCode(
    id: res.id,
    code: res.code,
    description: res.description,
  );
}