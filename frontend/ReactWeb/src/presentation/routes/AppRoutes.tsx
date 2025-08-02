import React from "react";
import { Routes, Route } from "react-router-dom";
import { 
  HomePage,
  LoginPage,
  RegisterPage,
  ChatPage,
  ChannelPage,
  MyPage,
  AnalysisPage,
  AssistantPage,
  CalendarPage,
  CategoryCodeGuidePage,
  CategoryGuidePage,
  ChannelInvitationPage,
  InvitePartnerPage,
  PaymentPage,
  SplashPage
} from "../pages";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Splash */}
      <Route path="/" element={<SplashPage />} />
      
      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Main Pages */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/channels" element={<ChannelPage />} />
      <Route path="/analysis" element={<AnalysisPage />} />
      <Route path="/assistant" element={<AssistantPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/mypage" element={<MyPage />} />
      
      {/* Category */}
      <Route path="/category/guide" element={<CategoryGuidePage />} />
      <Route path="/category/code-guide" element={<CategoryCodeGuidePage />} />
      
      {/* Invite */}
      <Route path="/invite/partner" element={<InvitePartnerPage />} />
      <Route path="/invite/channel" element={<ChannelInvitationPage />} />
      
      {/* Payment */}
      <Route path="/payment" element={<PaymentPage />} />
      
      {/* Profile */}
      <Route path="/profile" element={<MyPage />} />
      

    </Routes>
  );
};
