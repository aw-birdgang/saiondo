import 'package:flutter/material.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int currentStep = 0;
  String? selectedMbti;
  String? selectedLoveLang;
  String? selectedAttachment;

  final List<String> mbtiList = [
    "INFP", "ENFP", "INFJ", "ENFJ",
    "INTJ", "ENTJ", "INTP", "ENTP",
    "ISFP", "ESFP", "ISTP", "ESTP",
    "ISFJ", "ESFJ", "ISTJ", "ESTJ"
  ];

  final Map<String, String> loveLanguages = {
    "words": "긍정적인 말",
    "service": "봉사",
    "gifts": "선물",
    "time": "함께하는 시간",
    "touch": "스킨십",
  };

  final Map<String, String> attachmentStyles = {
    "secure": "안정형",
    "anxious": "불안형",
    "avoidant": "회피형",
    "fearful": "두려움형",
  };

  void onStepContinue() {
    if (currentStep < 2) {
      setState(() {
        currentStep++;
      });
    } else {
      Navigator.pushReplacementNamed(context, '/connect');
    }
  }

  void onStepCancel() {
    if (currentStep > 0) {
      setState(() {
        currentStep--;
      });
    }
  }

  bool get isStepValid {
    if (currentStep == 0) return selectedMbti != null;
    if (currentStep == 1) return selectedLoveLang != null;
    if (currentStep == 2) return selectedAttachment != null;
    return false;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("성향 설정"),
        centerTitle: true,
        backgroundColor: Colors.pinkAccent,
        foregroundColor: Colors.white,
      ),
      body: Stepper(
        currentStep: currentStep,
        onStepContinue: isStepValid ? onStepContinue : null,
        onStepCancel: onStepCancel,
        controlsBuilder: (context, details) {
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (currentStep > 0)
                  TextButton(onPressed: details.onStepCancel, child: const Text("이전")),
                ElevatedButton(
                  onPressed: details.onStepContinue,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.pinkAccent,
                  ),
                  child: Text(currentStep == 2 ? "완료" : "다음"),
                ),
              ],
            ),
          );
        },
        steps: [
          Step(
            title: const Text("MBTI"),
            content: Column(
              children: mbtiList.map((type) {
                return RadioListTile<String>(
                  title: Text(type),
                  value: type,
                  groupValue: selectedMbti,
                  onChanged: (val) {
                    setState(() {
                      selectedMbti = val;
                    });
                  },
                );
              }).toList(),
            ),
            isActive: currentStep == 0,
            state: selectedMbti != null
                ? StepState.complete
                : StepState.indexed,
          ),
          Step(
            title: const Text("사랑의 언어"),
            content: Column(
              children: loveLanguages.entries.map((entry) {
                return RadioListTile<String>(
                  title: Text("${entry.value} (${entry.key})"),
                  value: entry.key,
                  groupValue: selectedLoveLang,
                  onChanged: (val) {
                    setState(() {
                      selectedLoveLang = val;
                    });
                  },
                );
              }).toList(),
            ),
            isActive: currentStep == 1,
            state: selectedLoveLang != null
                ? StepState.complete
                : StepState.indexed,
          ),
          Step(
            title: const Text("애착 유형"),
            content: Column(
              children: attachmentStyles.entries.map((entry) {
                return RadioListTile<String>(
                  title: Text("${entry.value} (${entry.key})"),
                  value: entry.key,
                  groupValue: selectedAttachment,
                  onChanged: (val) {
                    setState(() {
                      selectedAttachment = val;
                    });
                  },
                );
              }).toList(),
            ),
            isActive: currentStep == 2,
            state: selectedAttachment != null
                ? StepState.complete
                : StepState.indexed,
          ),
        ],
      ),
    );
  }
}