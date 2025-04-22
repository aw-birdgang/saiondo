import 'package:app/presentation/profile/store/profile_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:logger/logger.dart';

import '../../di/service_locator.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  //stores:---------------------------------------------------------------------
  final ProfileStore _store = getIt<ProfileStore>();
  final logger = getIt<Logger>();

  @override
  void initState() {
    super.initState();
    _store.loadUserProfile();
  }

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) {
        if (_store.isLoading) {
          return const CircularProgressIndicator();
        }

        if (_store.error != null) {
          return Text('Error: ${_store.error}');
        }

        final user = _store.user;
        if (user == null) {
          return const Text('No user found');
        }

        return Column(
          children: [
            Text(user.displayName ?? 'No name'),
            Text(user.mbti ?? 'MBTI not set'),
            Text(user.loveLanguage ?? 'Love language not set'),
            ElevatedButton(
              onPressed: () => _store.updateProfile(
                mbti: 'INFJ',
                loveLanguage: 'Words of Affirmation',
              ),
              child: const Text('Update Profile'),
            ),
          ],
        );
      },
    );
  }
}