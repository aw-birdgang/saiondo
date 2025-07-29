import 'package:flutter_test/flutter_test.dart';
import 'package:saiondo/constants/assets.dart';
import 'package:saiondo/constants/dimens.dart';
import 'package:saiondo/constants/strings.dart';

void main() {
  group('Constants Tests', () {
    test('Assets constants should not be empty', () {
      expect(Assets.appLogo, isNotEmpty);
      expect(Assets.logo, isNotEmpty);
    });

    test('Dimens constants should be positive', () {
      expect(Dimens.horizontalPadding, greaterThan(0));
      expect(Dimens.verticalPadding, greaterThan(0));
    });

    test('Strings constants should not be empty', () {
      expect(Strings.appName, isNotEmpty);
    });
  });
} 