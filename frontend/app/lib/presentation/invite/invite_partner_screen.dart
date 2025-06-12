import 'package:app/presentation/invite/store/channel_invitation_store.dart';
import 'package:flutter/material.dart';

import '../../di/service_locator.dart';
import '../auth/store/auth_store.dart';
import '../channel/store/channel_store.dart';
import '../../utils/locale/app_localization.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

class InvitePartnerScreen extends StatefulWidget {
  @override
  State<InvitePartnerScreen> createState() => _InvitePartnerScreenState();
}

class _InvitePartnerScreenState extends State<InvitePartnerScreen> {
  final ChannelStore _channelStore = getIt<ChannelStore>();
  final ChannelInvitationStore _channelInvitationStore = getIt<ChannelInvitationStore>();
  final AuthStore _authStore = getIt<AuthStore>();
  final TextEditingController _partnerEmailController = TextEditingController();
  String? _error;
  bool _isLoading = false;

  Future<void> _invite() async {
    final partnerEmail = _partnerEmailController.text.trim();
    final userId = _authStore.userId;
    final local = AppLocalizations.of(context);

    if (partnerEmail.isEmpty) {
      setState(() => _error = local?.translate('enter_email') ?? '이메일을 입력해주세요.');
      return;
    }
    if (userId == null) {
      setState(() => _error = local?.translate('no_login') ?? '로그인 정보가 없습니다.');
      return;
    }
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      // 1. 이메일로 초대받을 유저의 id를 조회 (예시, 실제 구현 필요)
      final inviteeId = await _channelInvitationStore.getUserIdByEmail(partnerEmail);
      if (inviteeId == null) {
        setState(() => _error = local?.translate('user_not_found') ?? '해당 이메일의 유저를 찾을 수 없습니다.');
        return;
      }
      // 2. 현재 참여 중인 채널이 없으면 채널을 생성
      String? channelId = _channelStore.currentChannel?.id;
      if (channelId == null) {
        final channel = await _channelStore.createChannel(userId);
        channelId = channel?.id;
      }
      if (channelId == null) {
        setState(() => _error = '채널 생성에 실패했습니다.');
        return;
      }
      // 3. 초대장 생성
      await _channelInvitationStore.createInvitation(channelId, userId, inviteeId);
      setState(() => _error = null);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(local?.translate('invite_sent') ?? '초대가 발송되었습니다!'),
            backgroundColor: AppColors.heartLight,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
        );
      }
      _partnerEmailController.clear();
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final local = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(local?.translate('invite_partner') ?? '파트너 초대'),
        backgroundColor: AppColors.backgroundLight,
        elevation: 0,
        iconTheme: IconThemeData(color: AppColors.heartAccent),
        titleTextStyle: AppTextStyles.sectionTitle.copyWith(color: AppColors.heartAccent),
      ),
      backgroundColor: AppColors.background,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 32),
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: AppColors.heartDark.withOpacity(0.08),
                  blurRadius: 16,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.favorite, color: AppColors.heartLight, size: 48),
                const SizedBox(height: 12),
                Text(
                  local?.translate('invite_partner_desc') ?? '연인/파트너의 이메일을 입력해 초대해보세요!',
                  style: AppTextStyles.body.copyWith(
                    color: AppColors.heartAccent,
                    fontWeight: FontWeight.w600,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: _partnerEmailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: InputDecoration(
                    labelText: local?.translate('partner_email') ?? '초대할 이메일',
                    prefixIcon: Icon(Icons.mail_outline, color: AppColors.heartLight),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: BorderSide(color: AppColors.heartLight),
                    ),
                    filled: true,
                    fillColor: AppColors.background,
                  ),
                  enabled: !_isLoading,
                  style: AppTextStyles.body,
                  onSubmitted: (_) => _invite(),
                ),
                if (_error != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 10),
                    child: Text(
                      _error!,
                      style: AppTextStyles.error,
                    ),
                  ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    icon: Icon(Icons.send, color: AppColors.white),
                    label: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 2.0),
                      child: Text(
                        local?.translate('invite') ?? '초대하기',
                        style: AppTextStyles.sectionTitle.copyWith(
                          color: AppColors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.shadow,
                      minimumSize: const Size(double.infinity, 48),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 4,
                      shadowColor: AppColors.shadow.withOpacity(0.2),
                    ),
                    onPressed: _isLoading ? null : _invite,
                  ),
                ),
                if (_isLoading)
                  Padding(
                    padding: const EdgeInsets.only(top: 16),
                    child: CircularProgressIndicator(
                      color: AppColors.shadow,
                      strokeWidth: 3,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
