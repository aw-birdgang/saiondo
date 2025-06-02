import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../../di/service_locator.dart';
import '../../../domain/entry/basic_question_category.dart';
import '../../user/store/basic_question_answer_store.dart';

class CategoryQuestionListScreen extends StatefulWidget {
  final String userId;
  final BasicQuestionCategory category;

  const CategoryQuestionListScreen({
    super.key,
    required this.userId,
    required this.category,
  });

  @override
  State<CategoryQuestionListScreen> createState() => _CategoryQuestionListScreenState();
}

class _CategoryQuestionListScreenState extends State<CategoryQuestionListScreen> {
  final _store = getIt<BasicQuestionAnswerStore>();

  @override
  void initState() {
    super.initState();
    _store.selectCategory(widget.category.id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.category.name} 질문 입력'),
        backgroundColor: Colors.pink[100],
        elevation: 0,
      ),
      backgroundColor: Colors.pink[50],
      body: Observer(
        builder: (_) {
          if (_store.isLoadingQuestions) {
            return const Center(child: CircularProgressIndicator(color: Colors.pink));
          }
          return ListView(
            padding: const EdgeInsets.symmetric(vertical: 16),
            children: [
              ..._store.questions.map((q) {
                final answer = _store.answers[q.id];
                return Card(
                  color: Colors.white,
                  margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
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
                        if (q.description != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 4.0, left: 34),
                            child: Text(q.description!, style: const TextStyle(color: Colors.grey, fontSize: 13)),
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
              const SizedBox(height: 24),
            ],
          );
        },
      ),
    );
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
                await _store.submitSingleAnswer(questionId, value);
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
}