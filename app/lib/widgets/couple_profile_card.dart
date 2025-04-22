import 'package:flutter/material.dart';

class CoupleProfileCard extends StatelessWidget {
  final String myName;
  final String myMbti;
  final String myLang;
  final String myAvatar;
  final String partnerName;
  final String partnerMbti;
  final String partnerLang;
  final String partnerAvatar;
  final DateTime startDate;
  final String statusMessage;

  const CoupleProfileCard({
    Key? key,
    required this.myName,
    required this.myMbti,
    required this.myLang,
    required this.myAvatar,
    required this.partnerName,
    required this.partnerMbti,
    required this.partnerLang,
    required this.partnerAvatar,
    required this.startDate,
    required this.statusMessage,
  }) : super(key: key);

  Widget _buildAvatar(String imageUrl, String name) {
    if (imageUrl.isEmpty || !Uri.parse(imageUrl).isAbsolute) {
      // 기본 아바타 표시
      return CircleAvatar(
        radius: 30,
        backgroundColor: Colors.grey.shade200,
        child: Text(
          name.isNotEmpty ? name[0].toUpperCase() : '?',
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.grey,
          ),
        ),
      );
    }

    return CircleAvatar(
      radius: 30,
      backgroundImage: NetworkImage(imageUrl),
      onBackgroundImageError: (exception, stackTrace) {
        debugPrint('이미지 로드 실패: $imageUrl');
        debugPrint('에러: $exception');
      },
      child: Container(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: Colors.pink.shade100,
            width: 2,
          ),
        ),
      ),
    );
  }

  String _formatDDay(DateTime date) {
    final difference = DateTime.now().difference(date).inDays;
    return 'D+$difference';
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Column(
                  children: [
                    _buildAvatar(myAvatar, myName),
                    const SizedBox(height: 8),
                    Text(
                      myName,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (myMbti.isNotEmpty)
                      Text(
                        myMbti,
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 12,
                        ),
                      ),
                    if (myLang.isNotEmpty)
                      Text(
                        myLang,
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 12,
                        ),
                      ),
                  ],
                ),
                Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.pink.shade50,
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        _formatDDay(startDate),
                        style: TextStyle(
                          color: Colors.pink.shade500,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Icon(Icons.favorite, color: Colors.pink),
                  ],
                ),
                Column(
                  children: [
                    _buildAvatar(partnerAvatar, partnerName),
                    const SizedBox(height: 8),
                    Text(
                      partnerName,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (partnerMbti.isNotEmpty)
                      Text(
                        partnerMbti,
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 12,
                        ),
                      ),
                    if (partnerLang.isNotEmpty)
                      Text(
                        partnerLang,
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 12,
                        ),
                      ),
                  ],
                ),
              ],
            ),
            if (statusMessage.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  statusMessage,
                  style: const TextStyle(
                    fontSize: 13,
                    height: 1.4,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}