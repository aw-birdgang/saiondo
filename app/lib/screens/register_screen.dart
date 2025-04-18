// import 'package:cloud_functions/cloud_functions.dart';
// import 'package:flutter/material.dart';
// import 'package:google_fonts/google_fonts.dart';
//
// class RegisterScreen extends StatefulWidget {
//   const RegisterScreen({super.key});
//
//   @override
//   State<RegisterScreen> createState() => _RegisterScreenState();
// }
//
// class _RegisterScreenState extends State<RegisterScreen> {
//   final nameController = TextEditingController();
//   final emailController = TextEditingController();
//   final passwordController = TextEditingController();
//   bool isLoading = false;
//
//   void handleRegister() async {
//     final name = nameController.text.trim();
//     final email = emailController.text.trim();
//     final password = passwordController.text;
//
//     if (name.isEmpty || email.isEmpty || password.isEmpty) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(content: Text("모든 항목을 입력해주세요.")),
//       );
//       return;
//     }
//
//     setState(() => isLoading = true);
//
//     try {
//       // Firebase Function 호출
//       final callable = FirebaseFunctions.instance.httpsCallable('register');
//       final result = await callable.call(<String, dynamic>{
//         "name": name,
//         "email": email,
//         "password": password,
//       });
//
//       if (result.data["success"] == true) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           const SnackBar(content: Text("회원가입 성공 🎉")),
//         );
//         Navigator.pushReplacementNamed(context, "/onboarding");
//       } else {
//         throw Exception("회원가입 실패");
//       }
//     } catch (e) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text("회원가입 오류: ${e.toString()}")),
//       );
//     } finally {
//       setState(() => isLoading = false);
//     }
//   }
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
//                   "회원가입",
//                   style: GoogleFonts.inter(
//                     fontSize: 28,
//                     fontWeight: FontWeight.bold,
//                     color: Colors.pinkAccent,
//                   ),
//                 ),
//                 const SizedBox(height: 8),
//                 const Text(
//                   "사이온도에 오신 것을 환영합니다 💑",
//                   textAlign: TextAlign.center,
//                 ),
//                 const SizedBox(height: 32),
//
//                 // 이름
//                 TextField(
//                   controller: nameController,
//                   decoration: const InputDecoration(
//                     labelText: "이름",
//                     border: OutlineInputBorder(),
//                   ),
//                 ),
//                 const SizedBox(height: 16),
//
//                 // 이메일
//                 TextField(
//                   controller: emailController,
//                   decoration: const InputDecoration(
//                     labelText: "이메일",
//                     border: OutlineInputBorder(),
//                   ),
//                   keyboardType: TextInputType.emailAddress,
//                 ),
//                 const SizedBox(height: 16),
//
//                 // 비밀번호
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
//                 // 가입 버튼
//                 ElevatedButton(
//                   onPressed: isLoading ? null : handleRegister,
//                   style: ElevatedButton.styleFrom(
//                     minimumSize: const Size.fromHeight(48),
//                     backgroundColor: Colors.pinkAccent,
//                   ),
//                   child: Text(
//                     isLoading ? "가입 중..." : "가입하기",
//                     style: const TextStyle(color: Colors.white),
//                   ),
//                 ),
//
//                 const SizedBox(height: 24),
//
//                 const Text("또는"),
//                 const SizedBox(height: 12),
//
//                 // 소셜 버튼
//                 Row(
//                   mainAxisAlignment: MainAxisAlignment.center,
//                   children: [
//                     OutlinedButton(onPressed: () {}, child: const Text("Google")),
//                     const SizedBox(width: 12),
//                     OutlinedButton(onPressed: () {}, child: const Text("Apple")),
//                   ],
//                 ),
//
//                 const SizedBox(height: 24),
//
//                 Row(
//                   mainAxisAlignment: MainAxisAlignment.center,
//                   children: [
//                     const Text("이미 계정이 있으신가요? "),
//                     TextButton(
//                       onPressed: () {
//                         Navigator.pop(context);
//                       },
//                       child: const Text("로그인"),
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