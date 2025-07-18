import 'package:flutter/material.dart';
import 'package:mobx/mobx.dart';
import '../../../domain/entry/basic_question_with_answer.dart';
import '../store/basic_question_answer_store.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';

class BasicQuestionCard extends StatefulWidget {
  final BasicQuestionWithAnswer question;
  final BasicQuestionAnswerStore store;

  const BasicQuestionCard({
    super.key,
    required this.question,
    required this.store,
  });

  @override
  State<BasicQuestionCard> createState() => _BasicQuestionCardState();
}

class _BasicQuestionCardState extends State<BasicQuestionCard> {
  late String? selectedAnswer;
  late ReactionDisposer _disposer;

  @override
  void initState() {
    super.initState();
    selectedAnswer = widget.store.answers[widget.question.id];
    _disposer = reaction<String?>(
      (_) => widget.store.answers[widget.question.id],
      (val) {
        if (mounted) {
          setState(() {
            selectedAnswer = val;
          });
        }
      },
      fireImmediately: true,
    );
  }

  @override
  void dispose() {
    _disposer();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      color: AppColors.white,
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
                Icon(Icons.question_answer, color: AppColors.heartLight, size: 24),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    widget.question.question,
                    style: AppTextStyles.body.copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 17,
                      color: AppColors.heartAccent,
                    ),
                  ),
                ),
              ],
            ),
            if (widget.question.description != null)
              Padding(
                padding: const EdgeInsets.only(top: 4.0, left: 34),
                child: Text(widget.question.description!, style: AppTextStyles.label.copyWith(fontSize: 13)),
              ),
            const SizedBox(height: 14),
            ...widget.question.options.map((opt) => RadioListTile<String>(
                  value: opt,
                  groupValue: selectedAnswer,
                  onChanged: (val) async {
                    if (val != null) {
                      await widget.store.submitSingleAnswer(widget.question.id, val);
                      // reaction이 해당 카드만 setState
                    }
                  },
                  title: Text(opt),
                  activeColor: AppColors.textMain,
                  contentPadding: const EdgeInsets.only(left: 8, right: 8),
                )),
            if (selectedAnswer != null)
              Container(
                margin: const EdgeInsets.only(top: 10),
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 14),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.check_circle, color: AppColors.green, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        selectedAnswer!,
                        style: AppTextStyles.body.copyWith(fontSize: 15, color: AppColors.black87),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
