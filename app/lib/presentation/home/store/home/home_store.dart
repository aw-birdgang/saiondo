import 'package:app/core/stores/error/error_store.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_slider_drawer/flutter_slider_drawer.dart';
import 'package:mobx/mobx.dart';

part 'home_store.g.dart';

class HomeStore = _HomeStore with _$HomeStore;

abstract class _HomeStore with Store {
  final String TAG = "_HomeStore";

  _HomeStore(
      this.errorStore,
      ) {
    _setupDisposers();
  }


  final ErrorStore errorStore;

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
  GlobalKey<SliderDrawerState> sliderDrawerKey = GlobalKey<SliderDrawerState>();

  @observable
  String title = "Home";


  @action
  void setTitle(String newTitle) {
    title = newTitle;
  }


  @action
  void onMenuItemClick(String newTitle) {
    setTitle(newTitle);
  }

  void closeDrawer() {
    sliderDrawerKey.currentState?.closeSlider();
  }
}
