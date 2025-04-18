import 'package:flutter/material.dart';

class ConnectScreen extends StatefulWidget {
  const ConnectScreen({super.key});

  @override
  State<ConnectScreen> createState() => _ConnectScreenState();
}

class _ConnectScreenState extends State<ConnectScreen> {
  String selectedTab = 'generate';
  String myName = '';
  String partnerCode = '';
  String myMBTI = '';
  String myLoveLang = '';
  String myGender = 'male';
  DateTime? startDate;
  String generatedCode = '';

  final mbtiList = [
    "INFP", "ENFP", "INFJ", "ENFJ", "INTJ", "ENTJ", "INTP", "ENTP",
    "ISFP", "ESFP", "ISTP", "ESTP", "ISFJ", "ESFJ", "ISTJ", "ESTJ",
  ];

  final loveLangList = [
    "Words", "Acts", "Gifts", "Time", "Touch",
  ];

  void _generateCode() {
    final code = DateTime.now().millisecondsSinceEpoch.toString().substring(7);
    setState(() => generatedCode = code);
  }

  void _connect() {
    // if (selectedTab == 'generate' && generatedCode.isEmpty) return;
    // if (selectedTab == 'enter' && partnerCode.isEmpty) return;
    // if (myName.isEmpty || myMBTI.isEmpty || myLoveLang.isEmpty || startDate == null) return;

    Navigator.pushNamed(context, '/home');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("커플 연결하기"),
        centerTitle: true,
        backgroundColor: Colors.pinkAccent,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            ToggleButtons(
              isSelected: [selectedTab == 'generate', selectedTab == 'enter'],
              onPressed: (index) {
                setState(() {
                  selectedTab = index == 0 ? 'generate' : 'enter';
                  generatedCode = '';
                });
              },
              borderRadius: BorderRadius.circular(8),
              children: const [
                Padding(padding: EdgeInsets.symmetric(horizontal: 20), child: Text("코드 생성")),
                Padding(padding: EdgeInsets.symmetric(horizontal: 20), child: Text("코드 입력")),
              ],
            ),
            const SizedBox(height: 24),
            if (selectedTab == 'generate') ...[
              ElevatedButton(
                onPressed: _generateCode,
                child: const Text("연결 코드 생성"),
              ),
              if (generatedCode.isNotEmpty) ...[
                const SizedBox(height: 12),
                Text("상대방에게 이 코드를 알려주세요"),
                const SizedBox(height: 8),
                SelectableText(
                  generatedCode,
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
              ],
            ],
            if (selectedTab == 'enter') ...[
              TextField(
                decoration: const InputDecoration(labelText: "상대방의 코드 입력"),
                textAlign: TextAlign.center,
                onChanged: (val) => setState(() => partnerCode = val),
              ),
            ],
            const Divider(height: 32),
            TextField(
              decoration: const InputDecoration(labelText: "내 이름"),
              onChanged: (val) => setState(() => myName = val),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField(
              value: myGender,
              items: const [
                DropdownMenuItem(value: 'male', child: Text("남자")),
                DropdownMenuItem(value: 'female', child: Text("여자")),
              ],
              onChanged: (val) => setState(() => myGender = val!),
              decoration: const InputDecoration(labelText: "성별"),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField(
              value: myMBTI.isEmpty ? null : myMBTI,
              items: mbtiList.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
              onChanged: (val) => setState(() => myMBTI = val!),
              decoration: const InputDecoration(labelText: "MBTI"),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField(
              value: myLoveLang.isEmpty ? null : myLoveLang,
              items: loveLangList.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
              onChanged: (val) => setState(() => myLoveLang = val!),
              decoration: const InputDecoration(labelText: "사랑의 언어"),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Text("연애 시작일: "),
                Text(startDate != null ? "${startDate!.toLocal()}".split(' ')[0] : "선택 안됨"),
                const Spacer(),
                TextButton(
                  onPressed: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now(),
                      firstDate: DateTime(2010),
                      lastDate: DateTime.now(),
                    );
                    if (picked != null) setState(() => startDate = picked);
                  },
                  child: const Text("날짜 선택"),
                )
              ],
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _connect,
              style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(48)),
              child: const Text("연결하기"),
            ),
          ],
        ),
      ),
    );
  }
}