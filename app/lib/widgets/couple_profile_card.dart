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
    super.key,
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
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Text("💑 우리 커플", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const Spacer(),
                IconButton(
                  onPressed: () {
                    Navigator.pushNamed(context, "/profile");
                  },
                  icon: const Icon(Icons.edit, color: Colors.pinkAccent),
                )
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildProfile(myAvatar, myName, myMbti, myLang),
                const SizedBox(width: 8),
                const Text("❤️", style: TextStyle(fontSize: 24)),
                const SizedBox(width: 8),
                _buildProfile(partnerAvatar, partnerName, partnerMbti, partnerLang),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(Icons.favorite, color: Colors.pink),
                const SizedBox(width: 8),
                Text("연애 시작일: ${startDate.toLocal().toString().split(' ')[0]}"),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.chat_bubble, color: Colors.purple),
                const SizedBox(width: 8),
                Expanded(
                  child: Text("현재 상태: $statusMessage"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfile(String avatar, String name, String mbti, String lang) {
    return Expanded(
      child: Row(
        children: [
          CircleAvatar(
            backgroundImage: NetworkImage(avatar),
            radius: 20,
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
              Text("$mbti / $lang", style: const TextStyle(fontSize: 12)),
            ],
          ),
        ],
      ),
    );
  }
}