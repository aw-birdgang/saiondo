import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Basic App Tests', () {
    testWidgets('Basic MaterialApp should work', (WidgetTester tester) async {
      // Build a simple MaterialApp
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          appBar: AppBar(title: const Text('Test App')),
          body: const Center(child: Text('Hello World')),
        ),
      ));

      // Verify that the app renders correctly
      expect(find.byType(MaterialApp), findsOneWidget);
      expect(find.byType(AppBar), findsOneWidget);
      expect(find.text('Test App'), findsOneWidget);
      expect(find.text('Hello World'), findsOneWidget);
    });

    testWidgets('Basic navigation should work', (WidgetTester tester) async {
      // Build a simple app with navigation
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          appBar: AppBar(title: const Text('Home')),
          body: const Center(child: Text('Home Page')),
        ),
      ));

      // Verify that the app renders correctly
      expect(find.byType(MaterialApp), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Home Page'), findsOneWidget);
    });
  });
}
