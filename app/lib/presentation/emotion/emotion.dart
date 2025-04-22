import 'package:app/di/service_locator.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import 'store/emotion_store.dart';

class EmotionScreen extends StatefulWidget {
  const EmotionScreen({super.key});

  @override
  State<EmotionScreen> createState() => _EmotionScreenState();
}

class _EmotionScreenState extends State<EmotionScreen> {
  final EmotionStore _store = getIt<EmotionStore>();

  @override
  void dispose() {
    _store.reset();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('오늘의 감정 기록'),
        backgroundColor: Colors.pinkAccent,
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Observer(
        builder: (_) => SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (_store.aiAdvice != null) _buildAdviceCard(),
              _buildTemperatureCard(),
              const SizedBox(height: 16),
              _buildEmojiCard(),
              const SizedBox(height: 16),
              _buildTagsCard(),
              const SizedBox(height: 16),
              _buildNoteCard(),
              const SizedBox(height: 24),
              _buildSubmitButton(),
              if (_store.error != null) _buildErrorMessage(),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _handleSubmit() async {
    final success = await _store.saveEmotion();
    if (success && mounted) {
      Navigator.of(context).pop(); // 기본 Navigator 사용
    }
  }

  Widget _buildTemperatureCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '감정 온도',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const Text(
              '오늘 당신의 감정 온도는 어떤가요?',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('차가움'),
                Text(
                  '${_store.temperature.round()}°',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const Text('뜨거움'),
              ],
            ),
            Slider(
              value: _store.temperature,
              min: 0,
              max: 100,
              divisions: 100,
              onChanged: _store.setTemperature,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmojiCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '감정 이모지',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const Text(
              '지금 감정과 가장 가까운 이모지를 선택하세요',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _store.emojis.map((emoji) => GestureDetector(
                onTap: () => _store.setSelectedEmoji(emoji),
                child: Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: _store.selectedEmoji == emoji
                        ? Colors.pink.shade50
                        : Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(
                    child: Text(emoji, style: const TextStyle(fontSize: 24)),
                  ),
                ),
              )).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTagsCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '감정 태그',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const Text(
              '해당되는 감정을 모두 선택하세요',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _store.emotionTags.map((tag) => FilterChip(
                label: Text(tag),
                selected: _store.selectedTags.contains(tag),
                onSelected: (_) => _store.toggleTag(tag),
                selectedColor: Colors.pink.shade100,
                checkmarkColor: Colors.pink,
              )).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNoteCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '감정 기록',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const Text(
              '오늘 어떤 일이 있었나요?',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 16),
            Stack(
              children: [
                TextField(
                  maxLines: 4,
                  decoration: const InputDecoration(
                    hintText: '오늘 있었던 일이나 감정을 자유롭게 적어보세요...',
                    border: OutlineInputBorder(),
                  ),
                  onChanged: _store.setEmotionText,
                ),
                Positioned(
                  bottom: 8,
                  right: 8,
                  child: IconButton(
                    icon: const Icon(Icons.mic),
                    onPressed: () {
                      // 음성 입력 구현
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAdviceCard() {
    return Card(
      color: Colors.pink.shade50,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'AI 감정 조언',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: _store.clearAdvice,
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              _store.aiAdvice ?? '',
              style: const TextStyle(
                fontSize: 16,
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmitButton() {
    return ElevatedButton(
      onPressed: _store.isSubmitDisabled || _store.isLoading
          ? null
          : _handleSubmit,
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 16),
        backgroundColor: Colors.pink,
        foregroundColor: Colors.white,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(_store.isLoading ? "저장 중..." : "감정 저장하기"),
          const SizedBox(width: 8),
          const Icon(Icons.send, size: 16),
        ],
      ),
    );
  }

  Widget _buildErrorMessage() {
    return Padding(
      padding: const EdgeInsets.only(top: 16),
      child: Text(
        _store.error!,
        style: const TextStyle(color: Colors.red),
        textAlign: TextAlign.center,
      ),
    );
  }

  Future<void> _showAIAdvice() async {
    final partnerId = "PARTNER_ID";

    if (_store.isLoadingAdvice) return;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );

    await _store.getEmotionAdvice(partnerId);

    if (mounted) {
      Navigator.of(context).pop();  // 로딩 다이얼로그 닫기
    }
  }

}