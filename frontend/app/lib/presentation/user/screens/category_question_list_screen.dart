import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../../di/service_locator.dart';
import '../../../domain/entry/basic_question_category.dart';
import '../../user/store/basic_question_answer_store.dart';
import '../widgets/basic_question_card.dart';

class CategoryQuestionListScreen extends StatefulWidget {
  final String userId;
  final BasicQuestionCategory category;

  const CategoryQuestionListScreen({
    super.key,
    required this.userId,
    required this.category,
  });

  @override
  State<CategoryQuestionListScreen> createState() =>
      _CategoryQuestionListScreenState();
}

class _CategoryQuestionListScreenState
    extends State<CategoryQuestionListScreen> {
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
      body: _store.isLoadingQuestions
          ? const Center(child: CircularProgressIndicator(color: Colors.pink))
          : ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 16),
              itemCount: _store.questions.length,
              itemBuilder: (context, idx) {
                final q = _store.questions[idx];
                return BasicQuestionCard(
                  key: ValueKey(q.id),
                  question: q,
                  store: _store,
                );
              },
            ),
    );
  }
}
