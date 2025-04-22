import 'package:another_flushbar/flushbar_helper.dart';
import 'package:flutter/material.dart';
import 'package:app/constants/assets.dart';
import 'package:app/core/stores/form/form_store.dart';
import 'package:app/core/widgets/app_icon_widget.dart';
import 'package:app/core/widgets/empty_app_bar_widget.dart';
import 'package:app/core/widgets/progress_indicator_widget.dart';
import 'package:app/core/widgets/rounded_button_widget.dart';
import 'package:app/core/widgets/textfield_widget.dart';
import 'package:app/di/service_locator.dart';
import 'package:app/presentation/signup/store/signup_store.dart';
import 'package:app/utils/device/device_utils.dart';
import 'package:app/utils/locale/app_localization.dart';
import 'package:app/utils/routes/routes.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../data/sharedpref/constants/preferences.dart';
import '../home/store/theme/theme_store.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});
  @override
  _SignUpScreenState createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  //text controllers:-----------------------------------------------------------
  TextEditingController _nameController = TextEditingController();
  TextEditingController _emailController = TextEditingController();
  TextEditingController _passwordController = TextEditingController();
  TextEditingController _confirmPasswordController = TextEditingController();

  //stores:---------------------------------------------------------------------
  final ThemeStore _themeStore = getIt<ThemeStore>();
  final FormStore _formStore = getIt<FormStore>();
  final SignUpStore _signUpStore = getIt<SignUpStore>();

  //focus nodes:-----------------------------------------------------------------
  late FocusNode _emailFocusNode;
  late FocusNode _passwordFocusNode;
  late FocusNode _confirmPasswordFocusNode;

  @override
  void initState() {
    super.initState();
    _emailFocusNode = FocusNode();
    _passwordFocusNode = FocusNode();
    _confirmPasswordFocusNode = FocusNode();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      primary: true,
      appBar: AppBar(
        title: Text('회원가입'),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: _buildBody(),
    );
  }

  // body methods:--------------------------------------------------------------
  Widget _buildBody() {
    return Stack(
      children: <Widget>[
        _buildRightSide(),
        Observer(
          builder: (context) {
            final errorMsg = _signUpStore.errorMessage;
            if (errorMsg.isNotEmpty) {
              return _showErrorMessage(errorMsg);
            }
            return SizedBox.shrink();
          },
        ),
        Observer(
          builder: (context) {
            return Visibility(
              visible: _signUpStore.loading,
              child: CustomProgressIndicatorWidget(),
            );
          },
        )
      ],
    );
  }

  Widget _buildRightSide() {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          mainAxisSize: MainAxisSize.max,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            SizedBox(height: 24.0),
            AppIconWidget(image: 'assets/icons/ic_launcher.png'),
            SizedBox(height: 24.0),
            _buildNameField(),
            _buildEmailField(),
            _buildPasswordField(),
            _buildConfirmPasswordField(),
            _buildSignUpButton(),
            _buildLoginButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildNameField() {
    return Observer(
      builder: (context) {
        return TextFieldWidget(
          hint: '이름을 입력하세요',
          inputType: TextInputType.name,
          icon: Icons.person,
          iconColor: _themeStore.darkMode ? Colors.white70 : Colors.black54,
          textController: _nameController,
          inputAction: TextInputAction.next,
          autoFocus: true,
          errorText: null,
          onChanged: (value) {
            // 이름 유효성 검사를 추가할 수 있습니다
          },
          onFieldSubmitted: (value) {
            FocusScope.of(context).requestFocus(_emailFocusNode);
          },
        );
      },
    );
  }

  Widget _buildEmailField() {
    return Observer(
      builder: (context) {
        return TextFieldWidget(
          hint: '이메일을 입력하세요',
          inputType: TextInputType.emailAddress,
          icon: Icons.email,
          iconColor: _themeStore.darkMode ? Colors.white70 : Colors.black54,
          textController: _emailController,
          inputAction: TextInputAction.next,
          autoFocus: false,
          onChanged: (value) {
            _formStore.setUserId(_emailController.text);
          },
          onFieldSubmitted: (value) {
            FocusScope.of(context).requestFocus(_passwordFocusNode);
          },
          errorText: _formStore.formErrorStore.userEmail,
          focusNode: _emailFocusNode,
        );
      },
    );
  }

  Widget _buildPasswordField() {
    return Observer(
      builder: (context) {
        return TextFieldWidget(
          hint: '비밀번호를 입력하세요',
          isObscure: true,
          padding: EdgeInsets.only(top: 16.0),
          icon: Icons.lock,
          iconColor: _themeStore.darkMode ? Colors.white70 : Colors.black54,
          textController: _passwordController,
          focusNode: _passwordFocusNode,
          errorText: _formStore.formErrorStore.password,
          onChanged: (value) {
            _formStore.setPassword(_passwordController.text);
          },
          onFieldSubmitted: (value) {
            FocusScope.of(context).requestFocus(_confirmPasswordFocusNode);
          },
        );
      },
    );
  }

  Widget _buildConfirmPasswordField() {
    return Observer(
      builder: (context) {
        return TextFieldWidget(
          hint: '비밀번호를 다시 입력하세요',
          isObscure: true,
          padding: EdgeInsets.only(top: 16.0),
          icon: Icons.lock,
          iconColor: _themeStore.darkMode ? Colors.white70 : Colors.black54,
          textController: _confirmPasswordController,
          focusNode: _confirmPasswordFocusNode,
          errorText: null,
          onChanged: (value) {
            // 비밀번호 확인 유효성 검사
          },
        );
      },
    );
  }

  Widget _buildSignUpButton() {
    return Padding(
      padding: EdgeInsets.only(top: 24.0),
      child: RoundedButtonWidget(
        buttonText: '회원가입',
        buttonColor: Colors.orangeAccent,
        textColor: Colors.white,
        onPressed: () async {
          if (_validateForm()) {
            DeviceUtils.hideKeyboard(context);
            try {
              // 회원가입 시도
              final user = await _signUpStore.signup(
                _emailController.text,
                _passwordController.text,
                _nameController.text,
              );
              
              // 회원가입 성공 시 (user가 null이 아닐 때 - Firestore에 데이터 저장까지 완료됨)
              if (_signUpStore.success && user != null) {
                // 로그인 상태 저장
                await SharedPreferences.getInstance().then((prefs) {
                  prefs.setBool(Preferences.is_logged_in, true);
                });
                
                // 회원가입 및 Firestore 저장 완료 메시지 표시
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('회원가입이 완료되었습니다.'),
                    duration: Duration(seconds: 2),
                  ),
                );
                
                // 홈 화면으로 이동
                Navigator.of(context).pushNamedAndRemoveUntil(Routes.home, (Route<dynamic> route) => false);
              }
            } catch (e) {
              _showErrorMessage(e.toString());
            }
          } else {
            _showErrorMessage('모든 항목을 올바르게 입력해주세요');
          }
        },
      ),
    );
  }

  Widget _buildLoginButton() {
    return Padding(
      padding: EdgeInsets.only(top: 16.0),
      child: TextButton(
        onPressed: () {
          Navigator.of(context).pop();
        },
        child: Text(
          '이미 계정이 있으신가요? 로그인하기',
          style: TextStyle(color: Colors.orangeAccent),
        ),
      ),
    );
  }

  bool _validateForm() {
    // 이메일, 비밀번호, 이름 유효성 검사
    bool isValid = true;
    
    if (_nameController.text.isEmpty) {
      isValid = false;
    }
    
    if (_emailController.text.isEmpty || !_emailController.text.contains('@')) {
      isValid = false;
    }
    
    if (_passwordController.text.isEmpty || _passwordController.text.length < 6) {
      isValid = false;
    }
    
    if (_passwordController.text != _confirmPasswordController.text) {
      _showErrorMessage('비밀번호가 일치하지 않습니다');
      isValid = false;
    }
    
    return isValid;
  }

  Widget navigate(BuildContext context) {
    SharedPreferences.getInstance().then((prefs) {
      prefs.setBool(Preferences.is_logged_in, true);
    });

    Future.delayed(Duration(milliseconds: 0), () {
      Navigator.of(context).pushNamedAndRemoveUntil(Routes.home, (Route<dynamic> route) => false);
    });

    return Container();
  }

  // General Methods:-----------------------------------------------------------
  _showErrorMessage(String message) {
    if (message.isNotEmpty) {
      Future.delayed(Duration(milliseconds: 0), () {
        if (message.isNotEmpty) {
          FlushbarHelper.createError(
            message: message,
            title: AppLocalizations.of(context).translate('home_tv_error'),
            duration: Duration(seconds: 3),
          )..show(context);
        }
      });
    }

    return SizedBox.shrink();
  }

  // dispose:-------------------------------------------------------------------
  @override
  void dispose() {
    // Clean up the controller when the Widget is removed from the Widget tree
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _emailFocusNode.dispose();
    _passwordFocusNode.dispose();
    _confirmPasswordFocusNode.dispose();
    super.dispose();
  }
} 