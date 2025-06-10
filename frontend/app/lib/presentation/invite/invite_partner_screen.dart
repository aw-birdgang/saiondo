import 'package:app/presentation/invite/store/channel_invitation_store.dart';
import 'package:flutter/material.dart';

import '../../di/service_locator.dart';
import '../auth/store/auth_store.dart';
import '../channel/store/channel_store.dart';

class InvitePartnerScreen extends StatefulWidget {
  @override
  State<InvitePartnerScreen> createState() => _InvitePartnerScreenState();
}

class _InvitePartnerScreenState extends State<InvitePartnerScreen> {
  final ChannelStore _channelStore = getIt<ChannelStore>();
  ChannelInvitationStore _channelInvitationStore = getIt<ChannelInvitationStore>();
  final AuthStore _authStore = getIt<AuthStore>();
  final TextEditingController _partnerEmailController = TextEditingController();
  String? _error;
  bool _isLoading = false;

  Future<void> _invite() async {
    final partnerEmail = _partnerEmailController.text.trim();
    final userId = _authStore.userId;
    if (partnerEmail.isEmpty) {
      setState(() => _error = '이메일을 입력해주세요.');
      return;
    }
    if (userId == null) {
      setState(() => _error = '로그인 정보가 없습니다.');
      return;
    }
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      await _channelStore.createOrGetChannel(userId, partnerEmail);
      setState(() => _error = null);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('초대가 발송되었습니다!')),
      );
      _partnerEmailController.clear();
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('파트너 초대')),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            TextField(
              controller: _partnerEmailController,
              decoration: InputDecoration(
                labelText: '초대할 이메일',
                border: OutlineInputBorder(),
              ),
              enabled: !_isLoading,
            ),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(_error!, style: TextStyle(color: Colors.red)),
              ),
            SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _invite,
                child: _isLoading
                    ? SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : Text('초대하기'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
