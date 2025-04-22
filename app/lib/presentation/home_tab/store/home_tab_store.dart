import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart' as auth;
import 'package:flutter/foundation.dart';
import 'package:mobx/mobx.dart';

import '../../../domain/usecases/daily_tip/get_daily_tip_usecase.dart';
import '../../../domain/usecases/emotion/get_recent_emotion_logs_usecase.dart';
import '../../../models/daily_tip.dart';
import '../../../models/emotion_log.dart';

part 'home_tab_store.g.dart';

class HomeTabStore = _HomeTabStore with _$HomeTabStore;

abstract class _HomeTabStore with Store {
  final GetRecentEmotionLogsUseCase _getRecentEmotionLogsUseCase;
  final GetDailyTipUseCase _getDailyTipUseCase;
  final auth.FirebaseAuth _auth;
  final FirebaseFirestore _firestore;
  final FirebaseFunctions _firebaseFunctions;

  _HomeTabStore(
      this._getRecentEmotionLogsUseCase,
      this._getDailyTipUseCase,{
    required auth.FirebaseAuth auth,
    required FirebaseFirestore firestore,
    required FirebaseFunctions firebaseFunctions,
  })  : _auth = auth,
        _firestore = firestore,
        _firebaseFunctions = firebaseFunctions;

  @observable
  bool isLoading = false;

  @observable
  ObservableList<EmotionLog> recentLogs = ObservableList<EmotionLog>();

  @observable
  Map<String, dynamic>? coupleProfileData;

  @observable
  DailyTip? currentDailyTip;

  @action
  Future<void> fetchRecentEmotionLogs() async {
    try {
      isLoading = true;
      final currentUser = _auth.currentUser;
      if (currentUser == null) {
        isLoading = false;
        return;
      }
      debugPrint('fetchRecentEmotionLogs 시작: userId=${currentUser.uid}');

      final logs = await _getRecentEmotionLogsUseCase.call(currentUser.uid, 3);

      // 로그 데이터 상세 출력
      debugPrint('\n=== 감정 로그 데이터 ===');
      debugPrint('총 ${logs.length}개의 로그를 가져왔습니다.');

      for (var log in logs) {
        debugPrint('''
\n--- 감정 로그 상세 ---
문서 ID: ${log.id}
날짜: ${log.date}
사용자 ID: ${log.userId}
이모지: ${log.emoji}
온도: ${log.temperature}°
태그: ${log.tags.join(', ')}
이벤트: ${log.events?.join(', ') ?? '없음'}
노트: ${log.note}
작성일: ${log.createdAt.toDate()}
-----------------
''');
      }

      recentLogs.clear();
      recentLogs.addAll(logs.where((log) =>
      log.emoji.isNotEmpty &&
          log.userId == currentUser.uid
      ));
      debugPrint('\n=== 필터링 후 감정 로그 ===');
      debugPrint('표시될 로그 수: ${recentLogs.length}');
      for (var log in recentLogs) {
        debugPrint('로그 ID: ${log.id}, 이모지: ${log.emoji}, 작성일: ${log.createdAt.toDate()}');
      }
    } catch (e, stackTrace) {
      debugPrint('''
\n=== fetchRecentEmotionLogs 에러 ===
에러 타입: ${e.runtimeType}
에러 메시지: $e
스택 트레이스:
$stackTrace
============================
''');
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> fetchCoupleProfile() async {
    try {
      isLoading = true;
      
      final currentUser = _auth.currentUser;
      if (currentUser == null) {
        isLoading = false;
        return;
      }

      final userId = currentUser.uid;
      final userDoc = await _firestore.collection('users').doc(userId).get();
      final userData = userDoc.data();

      if (userData == null || !userData.containsKey('coupleId')) {
        isLoading = false;
        return;
      }

      final coupleId = userData['coupleId'];
      final coupleDoc = await _firestore.collection('couples').doc(coupleId).get();
      final coupleData = coupleDoc.data();

      if (coupleData == null) {
        isLoading = false;
        return;
      }

      final String userAId = coupleData['userAId'];
      final String userBId = coupleData['userBId'];

      final partnerId = userId == userAId ? userBId : userAId;
      final partnerDoc = await _firestore.collection('users').doc(partnerId).get();
      final partnerData = partnerDoc.data();

      coupleProfileData = {
        "me": userData,
        "partner": partnerData,
        "couple": coupleData,
      };
    } catch (e) {
      debugPrint('fetchCoupleProfile 에러: $e');
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> fetchDailyTip() async {
    try {
      if (recentLogs.isEmpty || coupleProfileData == null) {
        debugPrint('fetchDailyTip: 필요한 데이터가 없습니다.');
        return;
      }

      final partnerId = coupleProfileData!['partner']?['uid'] ??
          coupleProfileData!['couple']?['userBId'];
      if (partnerId == null) {
        debugPrint('fetchDailyTip: 파트너 ID를 찾을 수 없습니다.');
        return;
      }

      final userId = _auth.currentUser?.uid;
      if (userId == null) {
        debugPrint('fetchDailyTip: 사용자가 로그인하지 않았습니다.');
        return;
      }

      debugPrint('Daily Tip 요청 - userId: $userId, partnerId: $partnerId');
      currentDailyTip = await _getDailyTipUseCase.call(
        userId: userId,
        partnerId: partnerId,
        recentLogs: recentLogs.toList(),
      );
      debugPrint('Daily Tip 수신 완료: ${currentDailyTip?.title}');
    } catch (e) {
      debugPrint('fetchDailyTip 에러: $e');
      currentDailyTip = null;  // 에러 시 명시적으로 null 설정
    }
  }


  @action
  Future<void> updateDailyTipsWithEmotion() async {
    try {
      if (recentLogs.isEmpty || coupleProfileData == null) {
        debugPrint('updateDailyTipsWithEmotion: 필요한 데이터가 없습니다.');
        return;
      }

      final userId = _auth.currentUser?.uid;
      if (userId == null) {
        debugPrint('updateDailyTipsWithEmotion: 사용자가 로그인하지 않았습니다.');
        return;
      }

      // 최근 감정 로그에서 데이터 추출
      final latestLog = recentLogs.first;

      debugPrint('updateDailyTips 함수 호출 시작');
      final result = await _firebaseFunctions.httpsCallable('updateDailyTips').call({
        'emotion': latestLog.emoji,
        'situation': latestLog.note ?? '',
        'partnerBehavior': '',
        'intensity': latestLog.temperature,
        'category': latestLog.tags.isNotEmpty ? latestLog.tags.first : 'general',
        'isPrivate': false,
      });

      debugPrint('updateDailyTips 응답 수신: ${result.data}');

      // 새로운 데일리 팁으로 업데이트
      if (result.data != null && result.data['success']) {
        final tipData = result.data['data'];
        final aiAdvice = tipData['aiAdvice'] ?? {};

        currentDailyTip = DailyTip(
          id: tipData['id'] ?? '',
          title: aiAdvice['content']?.toString().split('\n').first ?? '새로운 조언',
          content: aiAdvice['content'] ?? '',
          category: tipData['category'] ?? 'general',
          createdAt: tipData['createdAt'] != null
              ? Timestamp(
            tipData['createdAt']['_seconds'] ?? 0,
            tipData['createdAt']['_nanoseconds'] ?? 0,
          )
              : Timestamp.now(),
          priority: 0,
        );
        debugPrint('새로운 Daily Tip 업데이트 완료');
      }
    } catch (e) {
      debugPrint('updateDailyTipsWithEmotion 에러: $e');
      rethrow;
    }
  }


  @action
  Future<void> init() async {
    try {
      isLoading = true;
      debugPrint('새로고침 시작: 데이터 갱신 중...');

      // 순차적 실행으로 변경
      await fetchCoupleProfile();
      debugPrint('커플 프로필 갱신 완료');

      await fetchRecentEmotionLogs();
      debugPrint('감정 로그 갱신 완료');

      await fetchDailyTip();
      debugPrint('데일리 팁 갱신 완료: ${currentDailyTip?.title}');

      debugPrint('모든 데이터 갱신 완료');
    } catch (e) {
      debugPrint('새로고침 중 에러 발생: $e');
    } finally {
      isLoading = false;
    }
  }

  void dispose() {
  }

  @action
  Future<void> reflesh() async {
    await init();
  }
} 