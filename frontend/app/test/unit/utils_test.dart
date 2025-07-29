import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:saiondo/utils/device/device_utils.dart';

void main() {
  group('Device Utils Tests', () {
    testWidgets('hideKeyboard should not throw exception', (WidgetTester tester) async {
      // Build a simple widget to get BuildContext
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: Builder(
            builder: (context) {
              // This is a simple test to ensure the function exists and doesn't throw
              expect(() => DeviceUtils.hideKeyboard(context), returnsNormally);
              return Container();
            },
          ),
        ),
      ));
    });
  });
} 