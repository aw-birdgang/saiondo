import 'package:app/core/stores/error/error_store.dart';
import 'package:app/domain/entities/user/user.dart';
import 'package:app/domain/usecases/user/signup_usecase.dart';
import 'package:mobx/mobx.dart';

part 'signup_store.g.dart';

class SignUpStore = _SignUpStore with _$SignUpStore;

abstract class _SignUpStore with Store {
  // constructor:---------------------------------------------------------------
  _SignUpStore(
    this._signUpUseCase,
    this.errorStore,
  ) {
    // setting up disposers
    _setupDisposers();
  }

  final SignUpUseCase _signUpUseCase;
  final ErrorStore errorStore;

  // disposers:-----------------------------------------------------------------
  late List<ReactionDisposer> _disposers;

  void _setupDisposers() {
    _disposers = [
      reaction((_) => success, (_) => success = false, delay: 200),
    ];
  }

  // store variables:-----------------------------------------------------------
  @observable
  bool success = false;

  @observable
  bool loading = false;

  @observable
  String errorMessage = '';

  @observable
  User? user;

  // actions:-------------------------------------------------------------------
  @action
  Future<User?> signup(String email, String password, String name) async {
    loading = true;
    errorMessage = '';
    user = null;

    final params = SignUpParams(
      email: email,
      password: password,
      name: name,
    );

    print("signup store >> email:: " + email + " ,password :" + password + ", name : " + name);

    try {
      user = await _signUpUseCase.call(params: params);
      if (user != null) {
        print("회원가입 성공: ${user?.id}");
        success = true;
        return user;
      } else {
        print("회원가입 실패: user is null");
        errorMessage = '회원가입에 실패했습니다. 다시 시도해주세요.';
        return null;
      }
    } catch (e) {
      errorMessage = e.toString();
      print(e);
      return null;
    } finally {
      loading = false;
    }
  }

  // general methods:-----------------------------------------------------------
  void dispose() {
    for (final d in _disposers) {
      d();
    }
  }
} 