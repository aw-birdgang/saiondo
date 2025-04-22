import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart' as auth;
import 'package:flutter/foundation.dart';
import 'package:mobx/mobx.dart';

part 'settings_tab_store.g.dart';

class SettingsTabStore = _SettingsTabStore with _$SettingsTabStore;

abstract class _SettingsTabStore with Store {
  final auth.FirebaseAuth _auth;
  final FirebaseFirestore _firestore;

  _SettingsTabStore({
    required auth.FirebaseAuth auth,
    required FirebaseFirestore firestore,
  }) : _auth = auth,
      _firestore = firestore;

  @observable
  bool darkMode = false;

  @observable
  bool notifications = true;

  @observable
  String relationshipStatus = '연애 중';

  @observable
  bool isLoading = false;

  final List<String> statusOptions = ['연애 중', '약혼', '결혼', '잠시 휴식'];

  @action
  void toggleDarkMode() {
    darkMode = !darkMode;
  }

  @action
  void toggleNotifications() {
    notifications = !notifications;
  }

  @action
  void setRelationshipStatus(String status) {
    relationshipStatus = status;
  }

  @action
  Future<bool> logout() async {
    try {
      isLoading = true;
      await _auth.signOut();
      return true;
    } catch (e) {
      debugPrint('로그아웃 에러: $e');
      return false;
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> init() async {
    // 설정값 초기화 로직 (필요시 SharedPreferences 등에서 로드)
  }

  void dispose() {
    // 필요한 경우 리소스 정리 로직
  }
} 