import 'package:app/core/stores/error/error_store.dart';
import 'package:app/domain/entry/assistant/assistant.dart';
import 'package:app/domain/usecase/assistant/fetch_assistants_usecase.dart';
import 'package:app/presentation/home/home.dart';
import 'package:flutter/widgets.dart';
import 'package:mobx/mobx.dart';

part 'home_store.g.dart';

class HomeStore = _HomeStore with _$HomeStore;

abstract class _HomeStore with Store {
  final String TAG = "_HomeStore";
  final ErrorStore errorStore;
  final FetchAssistantsUseCase fetchAssistantsUseCase;

  _HomeStore(this.fetchAssistantsUseCase, this.errorStore, ) {
    _setupDisposers();
  }

  // disposers:-----------------------------------------------------------------
  late List<ReactionDisposer> _disposers;

  void _setupDisposers() {
    _disposers = [
      reaction((_) => success, (_) => success = false, delay: 200),
    ];
  }

  @observable
  bool success = false;

  @observable
  String title = "Home";

  @observable
  Widget currentScreen = HomeScreen();

  @observable
  ObservableList<Assistant> assistants = ObservableList<Assistant>();

  @observable
  bool isLoading = false;

  @observable
  String? selectedAssistantId;


  @action
  void setTitle(String newTitle) {
    title = newTitle;
  }

  @action
  void setCurrentScreen(Widget screen) {
    currentScreen = screen;
  }

  @action
  Future<void> loadAssistants(String userId) async {
    isLoading = true;
    try {
      final result = await fetchAssistantsUseCase(userId);
      assistants = ObservableList.of(result);
      success = true;
    } catch (e) {
      errorStore.errorMessage = e.toString();
    } finally {
      isLoading = false;
    }
  }

  @action
  void selectAssistant(String assistantId) {
    selectedAssistantId = assistantId;
  }

  // dispose method
  void dispose() {
    for (final d in _disposers) {
      d();
    }
  }
}