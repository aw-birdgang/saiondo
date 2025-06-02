import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';

import '../../../di/service_locator.dart';
import '../../user/store/basic_question_answer_store.dart';
import 'category_question_list_screen.dart';

class BasicQuestionAnswerSection extends StatefulWidget {
  final String userId;
  const BasicQuestionAnswerSection({super.key, required this.userId});

  @override
  State<BasicQuestionAnswerSection> createState() => _BasicQuestionAnswerSectionState();
}

class _BasicQuestionAnswerSectionState extends State<BasicQuestionAnswerSection> {
  final _store = getIt<BasicQuestionAnswerStore>();

  @override
  void initState() {
    super.initState();
    _store.loadCategories().then((_) => _store.loadAllCategoryQAndAByUserId());
  }

  _CategoryProgress getCategoryProgress(String categoryId) {
    final questions = _store.categoryQuestionsMap[categoryId] ?? [];
    final total = questions.length;
    final answered = questions.where((q) => q.answer != null && q.answer!.answer.trim().isNotEmpty).length;
    final ratio = total == 0 ? 0.0 : answered / total;
    return _CategoryProgress(total: total, answered: answered, ratio: ratio);
  }

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) {
        if (_store.isLoadingCategories || _store.isLoadingQuestions) {
          return Center(
            child: LoadingAnimationWidget.staggeredDotsWave(
              color: Colors.pink,
              size: 40,
            ),
          );
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
              child: Text(
                '카테고리별 기본정보 입력',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: Colors.pink[400],
                  fontFamily: 'Nunito',
                  letterSpacing: 1.2,
                ),
              ),
            ),
            ..._store.categories.map((cat) {
              final progress = getCategoryProgress(cat.id);

              return GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => CategoryQuestionListScreen(
                        userId: widget.userId,
                        category: cat,
                      ),
                    ),
                  );
                },
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 0, vertical: 10),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.pink[50]!, Colors.purple[50]!],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.pink.withOpacity(0.10),
                        blurRadius: 16,
                        offset: const Offset(0, 8),
                      ),
                    ],
                    border: Border.all(
                      color: Colors.pinkAccent.withOpacity(0.18),
                      width: 1.2,
                    ),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 20),
                  child: Row(
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [Colors.pinkAccent, Colors.purpleAccent],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                        ),
                        child: const CircleAvatar(
                          backgroundColor: Colors.transparent,
                          radius: 22,
                          child: Icon(Icons.category, color: Colors.white, size: 26),
                        ),
                      ),
                      const SizedBox(width: 18),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              cat.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 17,
                                color: Color(0xFFD81B60),
                                fontFamily: 'Nunito',
                              ),
                            ),
                          ],
                        ),
                      ),
                      CircularPercentIndicator(
                        radius: 32,
                        lineWidth: 5,
                        percent: progress.ratio.clamp(0, 1),
                        animation: true,
                        animationDuration: 900,
                        circularStrokeCap: CircularStrokeCap.round,
                        backgroundColor: Colors.white,
                        progressColor: Colors.pinkAccent,
                        center: Container(
                          width: 38,
                          height: 38,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                '${progress.answered}',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                  color: Color(0xFFD81B60),
                                ),
                              ),
                              Text(
                                '/${progress.total}',
                                style: TextStyle(
                                  color: Colors.pink[300],
                                  fontSize: 11,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Icon(Icons.arrow_forward_ios, size: 20, color: Colors.pink[200]),
                    ],
                  ),
                ),
              );
            }),
            const SizedBox(height: 28),
          ],
        );
      },
    );
  }
}

class _CategoryProgress {
  final int total;
  final int answered;
  final double ratio;
  _CategoryProgress({required this.total, required this.answered, required this.ratio});
}