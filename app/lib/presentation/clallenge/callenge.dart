import 'package:app/presentation/clallenge/store/callenge_store.dart';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';

import '../../di/service_locator.dart';


class CallengeScreen extends StatefulWidget {
  @override
  State<CallengeScreen> createState() => _CallengeScreenState();
}

class _CallengeScreenState extends State<CallengeScreen> {
  //stores:---------------------------------------------------------------------
  final CallengeStore _callengeStore = getIt<CallengeStore>();
  final logger = getIt<Logger>();

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    throw UnimplementedError();
  }
}