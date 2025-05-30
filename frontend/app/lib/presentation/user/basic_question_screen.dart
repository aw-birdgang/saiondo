import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';

import '../../di/service_locator.dart';
import 'store/basic_question_answer_store.dart';

class BasicQuestionAnswerScreen extends StatefulWidget {
  const BasicQuestionAnswerScreen({super.key});

  @override
  State<BasicQuestionAnswerScreen> createState() => _BasicQuestionAnswerScreenState();
}

class _BasicQuestionAnswerScreenState extends State<BasicQuestionAnswerScreen> {
  final _basicQuestionAnswerStore = getIt<BasicQuestionAnswerStore>();

  @override
  void initState() {
    super.initState();
    _basicQuestionAnswerStore.loadQuestionsWithAnswers();
  }

  Future<void> _showAnswerDialog(BuildContext context, String questionId, String? initialValue) async {
    final controller = TextEditingController(text: initialValue ?? '');
    final result = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('답변 입력'),
        content: TextField(
          controller: controller,
          autofocus: true,
          minLines: 1,
          maxLines: 5,
          decoration: const InputDecoration(
            hintText: '답변을 입력하세요',
            border: OutlineInputBorder(),
            isDense: true,
            contentPadding: EdgeInsets.symmetric(vertical: 10, horizontal: 12),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          ElevatedButton(
            onPressed: () async {
              final value = controller.text.trim();
              if (value.isNotEmpty) {
                await _basicQuestionAnswerStore.submitSingleAnswer(questionId, value);
                Navigator.pop(context, value);
              }
            },
            child: const Text('저장'),
          ),
        ],
      ),
    );
    if (result != null && result.isNotEmpty) {
      setState(() {}); // UI 갱신
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('기본 정보 입력'),
        backgroundColor: Colors.pink[100],
        elevation: 0,
      ),
      backgroundColor: Colors.pink[50],
      body: Observer(
        builder: (_) {
          if (_basicQuestionAnswerStore.isLoading) {
            return const Center(child: CircularProgressIndicator(color: Colors.pink));
          }
          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Center(
                child: CircularPercentIndicator(
                  radius: 70,
                  lineWidth: 16,
                  percent: _basicQuestionAnswerStore.answerRatio.clamp(0, 1),
                  animation: true,
                  animationDuration: 800,
                  circularStrokeCap: CircularStrokeCap.round,
                  backgroundColor: Colors.pink[50]!,
                  progressColor: Colors.pinkAccent,
                  center: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '${_basicQuestionAnswerStore.answeredCount} / ${_basicQuestionAnswerStore.totalQuestions}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 22,
                          color: Color(0xFFD81B60),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '답변 완료',
                        style: TextStyle(
                          color: Colors.pink[300],
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              ..._basicQuestionAnswerStore.questions.map((q) {
                final answer = _basicQuestionAnswerStore.answers[q.id];
                return Card(
                  color: Colors.white,
                  margin: const EdgeInsets.symmetric(vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
                  elevation: 5,
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.question_answer, color: Colors.pink[300], size: 24),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                q.question,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 17,
                                  color: Color(0xFFD81B60),
                                ),
                              ),
                            ),
                            if (answer != null && answer.isNotEmpty)
                              IconButton(
                                tooltip: '수정',
                                icon: const Icon(Icons.edit, color: Colors.pink, size: 22),
                                onPressed: () => _showAnswerDialog(context, q.id, answer),
                              )
                            else
                              IconButton(
                                tooltip: '답변하기',
                                icon: const Icon(Icons.add_circle_outline, color: Colors.pinkAccent, size: 26),
                                onPressed: () => _showAnswerDialog(context, q.id, null),
                              ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        if (answer != null && answer.isNotEmpty)
                          Container(
                            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
                            decoration: BoxDecoration(
                              color: Colors.pink[50],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Icon(Icons.check_circle, color: Colors.green, size: 18),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    answer,
                                    style: const TextStyle(fontSize: 15, color: Colors.black87),
                                  ),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              }),
              const SizedBox(height: 32),
              Observer(
                builder: (_) => ElevatedButton.icon(
                  onPressed: _basicQuestionAnswerStore.isSubmitting
                      ? null
                      : () async {
                          try {
                            await _basicQuestionAnswerStore.submitAnswers();
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('답변이 저장되었습니다!')),
                              );
                              Navigator.pop(context);
                            }
                          } catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('에러: ${e.toString()}')),
                              );
                            }
                          }
                        },
                  icon: const Icon(Icons.stars, color: Colors.amber),
                  label: _basicQuestionAnswerStore.isSubmitting
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('전체 저장'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.pink,
                    foregroundColor: Colors.white,
                    minimumSize: const Size.fromHeight(52),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                    textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}