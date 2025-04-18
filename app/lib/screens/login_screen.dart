// import 'package:cloud_functions/cloud_functions.dart';
// import 'package:flutter/material.dart';
// import 'package:google_fonts/google_fonts.dart';
//
// class LoginScreen extends StatefulWidget {
//   const LoginScreen({super.key});
//
//   @override
//   State<LoginScreen> createState() => _LoginScreenState();
// }
//
// class _LoginScreenState extends State<LoginScreen> {
//   final emailController = TextEditingController();
//   final passwordController = TextEditingController();
//   bool isLoading = false;
//
//   void handleLogin() async {
//     final email = emailController.text.trim();
//     final password = passwordController.text.trim();
//
//     if (email.isEmpty || password.isEmpty) {
//       _showMessage("이메일과 비밀번호를 입력해주세요.");
//       return;
//     }
//
//     setState(() => isLoading = true);
//
//     try {
//       final HttpsCallable callable = FirebaseFunctions.instance.httpsCallable('login');
//       final response = await callable.call({
//         'email': email,
//         'password': password,
//       });
//
//       final data = response.data;
//
//       if (data['success'] == true) {
//         _showMessage("로그인 성공 🎉");
//         Navigator.pushReplacementNamed(context, '/home');
//       } else {
//         _showMessage("로그인 실패 😢");
//       }
//     } on FirebaseFunctionsException catch (e) {
//       _showMessage("에러: ${e.message}");
//     } catch (e) {
//       _showMessage("로그인 중 오류가 발생했습니다.");
//     } finally {
//       setState(() => isLoading = false);
//     }
//   }
//
//
//   void _showMessage(String msg) {
//     ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
//   }
//
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Container(
//         padding: const EdgeInsets.all(24),
//         decoration: const BoxDecoration(
//           gradient: LinearGradient(
//             colors: [Color(0xFFF8E1EC), Color(0xFFFFFFFF)],
//             begin: Alignment.topLeft,
//             end: Alignment.bottomRight,
//           ),
//         ),
//         child: Center(
//           child: SingleChildScrollView(
//             child: Column(
//               children: [
//                 Text(
//                   "사이온도",
//                   style: GoogleFonts.inter(
//                     fontSize: 32,
//                     fontWeight: FontWeight.bold,
//                     color: Colors.pinkAccent,
//                   ),
//                 ),
//                 const SizedBox(height: 8),
//                 Text(
//                   "커플의 감정 온도를 기록하고 소통하세요",
//                   style: TextStyle(color: Colors.grey[600]),
//                   textAlign: TextAlign.center,
//                 ),
//                 const SizedBox(height: 32),
//
//                 // 이메일 입력
//                 TextField(
//                   controller: emailController,
//                   decoration: const InputDecoration(
//                     labelText: "이메일",
//                     border: OutlineInputBorder(),
//                   ),
//                 ),
//                 const SizedBox(height: 16),
//
//                 // 비밀번호 입력
//                 TextField(
//                   controller: passwordController,
//                   obscureText: true,
//                   decoration: const InputDecoration(
//                     labelText: "비밀번호",
//                     border: OutlineInputBorder(),
//                   ),
//                 ),
//                 const SizedBox(height: 16),
//
//                 // 로그인 버튼
//                 ElevatedButton(
//                   onPressed: isLoading ? null : handleLogin,
//                   style: ElevatedButton.styleFrom(
//                     minimumSize: const Size.fromHeight(48),
//                     backgroundColor: Colors.pinkAccent,
//                   ),
//                   child: Text(
//                     isLoading ? "로그인 중..." : "로그인",
//                     style: const TextStyle(color: Colors.white),
//                   ),
//                 ),
//
//                 const SizedBox(height: 24),
//
//                 const Text("또는"),
//                 const SizedBox(height: 12),
//
//                 // 소셜 로그인 버튼
//                 Row(
//                   mainAxisAlignment: MainAxisAlignment.center,
//                   children: [
//                     OutlinedButton(
//                       onPressed: () {},
//                       child: const Text("Google"),
//                     ),
//                     const SizedBox(width: 12),
//                     OutlinedButton(
//                       onPressed: () {},
//                       child: const Text("Apple"),
//                     ),
//                   ],
//                 ),
//
//                 const SizedBox(height: 24),
//
//                 Row(
//                   mainAxisAlignment: MainAxisAlignment.center,
//                   children: [
//                     const Text("계정이 없으신가요? "),
//                     TextButton(
//                       onPressed: () {
//                         Navigator.pushNamed(context, "/register");
//                       },
//                       child: const Text("회원가입"),
//                     ),
//                   ],
//                 ),
//               ],
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }