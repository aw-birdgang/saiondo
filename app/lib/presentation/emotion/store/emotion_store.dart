import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart' as auth;
import 'package:mobx/mobx.dart';

import '../../../core/stores/error/error_store.dart';

part 'emotion_store.g.dart';

class EmotionStore = _EmotionStore with _$EmotionStore;

abstract class _EmotionStore with Store {
  final ErrorStore errorStore;

  final auth.FirebaseAuth _auth;
  final FirebaseFirestore _firestore;
  final FirebaseFunctions _firebaseFunctions;

  _EmotionStore(this.errorStore, {
        required auth.FirebaseAuth auth,
        required FirebaseFirestore firestore,
        required FirebaseFunctions firebaseFunctions,
      })  : _auth = auth,
        _firestore = firestore,
        _firebaseFunctions = firebaseFunctions;


  @observable
  String? aiAdvice;

  @observable
  bool isLoadingAdvice = false;  // AI 조언 로딩 상태

  @observable
  String? selectedEmoji;

  @observable
  ObservableList<String> selectedTags = ObservableList<String>();

  @observable
  String emotionText = "";

  @observable
  double temperature = 50;

  @observable
  bool isLoading = false;

  @observable
  String? error;

  // 상수 데이터
  final List<String> emojis = ["😄", "🙂", "😐", "😢", "😠", "😴", "😰", "🥰", "😎", "🤔"];
  final List<String> emotionTags = ["행복", "만족", "평온", "지루함", "불안", "슬픔", "화남", "설렘", "기대", "걱정"];

  // Computed 값들
  @computed
  bool get isSubmitDisabled =>
      selectedEmoji == null || selectedTags.isEmpty || emotionText.isEmpty;

  // Actions
  @action
  void setSelectedEmoji(String emoji) {
    selectedEmoji = emoji;
    error = null;
  }

  @action
  void toggleTag(String tag) {
    if (selectedTags.contains(tag)) {
      selectedTags.remove(tag);
    } else {
      selectedTags.add(tag);
    }
    error = null;
  }

  @action
  void setTemperature(double value) {
    temperature = value;
    error = null;
  }

  @action
  void setEmotionText(String value) {
    emotionText = value;
    error = null;
  }

  @action
  Future<bool> saveEmotion() async {
    try {
      isLoading = true;
      error = null;

      final user = _auth.currentUser;
      if (user == null) {
        error = "사용자 인증이 필요합니다.";
        return false;
      }

      final emotionData = {
        'userId': user.uid,
        'emoji': selectedEmoji,
        'tags': selectedTags.toList(),
        'temperature': temperature.round(),
        'note': emotionText,
        'createdAt': FieldValue.serverTimestamp(),
        'date': DateTime.now().toString().split(' ')[0],
      };

      await _firestore
          .collection('emotion_logs')
          .add(emotionData);

      return true;
    } catch (e) {
      error = "감정 저장 중 오류가 발생했습니다: ${e.toString()}";
      errorStore.setErrorMessage(error!);
      return false;
    } finally {
      isLoading = false;
    }
  }


  @action
  Future<void> getEmotionAdvice(String partnerId) async {
    try {
      isLoadingAdvice = true;
      error = null;

      final user = _auth.currentUser;
      if (user == null) {
        error = "사용자 인증이 필요 합니다.";
        return;
      }

      // Cloud Function 호출
      final callable = _firebaseFunctions.httpsCallable('getEmotionAdvice');
      final result = await callable.call<Map<String, dynamic>>({
        'userId': user.uid,
        'partnerId': partnerId,
      });

      if (result.data['success'] == true) {
        aiAdvice = result.data['message'] as String;
      } else {
        error = "조언을 가져오는데 실패 했습니다.";
      }
    } on FirebaseFunctionsException catch (e) {
      error = "Cloud Function 오류: ${e.message}";
      errorStore.setErrorMessage(error!);
    } catch (e) {
      error = "예상치 못한 오류가 발생 했습니다: ${e.toString()}";
      errorStore.setErrorMessage(error!);
    } finally {
      isLoadingAdvice = false;
    }
  }


  @action
  void reset() {
    selectedEmoji = null;
    selectedTags.clear();
    emotionText = "";
    temperature = 50;
    isLoading = false;
    error = null;
  }

  @action
  void clearAdvice() {
    aiAdvice = null;
  }

  // 디버깅을 위한 로그 출력
  void _logEmotionData() {
    print('Emotion Data:');
    print('Emoji: $selectedEmoji');
    print('Tags: ${selectedTags.join(", ")}');
    print('Temperature: $temperature');
    print('Note: $emotionText');
  }
}