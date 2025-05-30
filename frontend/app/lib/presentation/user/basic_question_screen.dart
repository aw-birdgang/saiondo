import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import 'store/basic_question_answer_store.dart';

class BasicQuestionAnswerScreen extends StatefulWidget {
  const BasicQuestionAnswerScreen({super.key});

  @override
  State<BasicQuestionAnswerScreen> createState() => _BasicQuestionAnswerScreenState();
}

class _BasicQuestionAnswerScreenState extends State<BasicQuestionAnswerScreen> {
  final _basicQuestionAnswerStore = getIt<BasicQuestionAnswerStore>();
  final Map<String, TextEditingController> _controllers = {};

  @override
  void initState() {
    super.initState();
    _basicQuestionAnswerStore.loadQuestionsWithAnswers();
  }

  @override
  void dispose() {
    for (final c in _controllers.values) {
      c.dispose();
    }
    super.dispose();
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
              ..._basicQuestionAnswerStore.questions.map((q) {
                _controllers.putIfAbsent(q.id, () => TextEditingController(text: _basicQuestionAnswerStore.answers[q.id] ?? ''));
                return Card(
                  color: Colors.white,
                  margin: const EdgeInsets.symmetric(vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                  elevation: 3,
                  child: Padding(
                    padding: const EdgeInsets.all(18),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.question_answer, color: Colors.pink[200], size: 22),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                q.question,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFFD81B60)),
                              ),
                            ),
                          ],
                        ),
                        if (q.description != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 4.0, left: 30),
                            child: Text(q.description!, style: const TextStyle(color: Colors.grey, fontSize: 13)),
                          ),
                        const SizedBox(height: 14),
                        TextField(
                          controller: _controllers[q.id],
                          onChanged: (v) => _basicQuestionAnswerStore.setAnswer(q.id, v),
                          decoration: InputDecoration(
                            hintText: '답변을 입력하세요',
                            filled: true,
                            fillColor: Colors.pink[50],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.pink[100]!),
                            ),
                            isDense: true,
                            contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 14),
                          ),
                          minLines: 1,
                          maxLines: 3,
                          textInputAction: TextInputAction.done,
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
                      : const Text('제출하고 포인트 받기'),
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
