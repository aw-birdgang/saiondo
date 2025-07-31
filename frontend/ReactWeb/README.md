# Saiondo Web App

사랑을 이어주는 커플 앱의 웹 버전입니다. Flutter 앱과 동일한 기능을 제공하는 React 기반 웹 애플리케이션입니다.

## 🚀 Features

- **인증 시스템**: 로그인/회원가입 기능
- **실시간 채팅**: Socket.IO 기반 실시간 메시징
- **개인화 분석**: AI 기반 대화 분석 및 조언
- **다크/라이트 테마**: 사용자 선호에 따른 테마 전환
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **다국어 지원**: 한국어/영어 지원
- **푸시 알림**: Firebase 기반 푸시 알림

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Build Tool**: Vite
- **Linting**: ESLint + Prettier

## 📁 Project Structure

```
src/
├── constants/          # 앱 상수 및 설정
├── core/              # 핵심 기능
│   ├── network/       # 네트워크 레이어
│   ├── routes/        # 라우팅 설정
│   └── stores/        # 상태 관리
├── data/              # 데이터 레이어
│   ├── api/           # API 서비스
│   ├── models/        # 데이터 모델
│   └── repositories/  # 리포지토리
├── domain/            # 도메인 레이어
│   ├── entities/      # 엔티티
│   ├── repositories/  # 리포지토리 인터페이스
│   └── usecases/      # 유스케이스
├── presentation/      # 프레젠테이션 레이어
│   ├── auth/          # 인증 관련 페이지
│   ├── chat/          # 채팅 페이지
│   ├── home/          # 홈 페이지
│   └── shared/        # 공통 컴포넌트
└── utils/             # 유틸리티 함수
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend/ReactWeb
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**

   ```bash
   cp env.example .env.local
   ```

   `.env.local` 파일을 편집하여 필요한 환경 변수를 설정하세요.

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   [http://localhost:5173](http://localhost:5173)에서 앱을 확인하세요.

## 📝 Available Scripts

- `npm run dev` - 개발 서버 시작
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드된 앱 미리보기
- `npm run lint` - 코드 린팅
- `npm run format` - 코드 포맷팅
- `npm run type-check` - TypeScript 타입 체크

## 🎨 Design System

### Colors

**Light Theme:**

- Primary: `#d21e1d`
- Secondary: `#EFF3F3`
- Surface: `#FAFBFB`
- Text: `#241E30`

**Dark Theme:**

- Primary: `#FF8383`
- Secondary: `#4D1F7C`
- Surface: `#1F1929`
- Text: `#FFFFFF`

### Typography

- **Primary Font**: Montserrat
- **Secondary Font**: Oswald
- **Font Weights**: 400, 500, 600, 700

## 🔧 Configuration

### Environment Variables

필요한 환경 변수들을 `.env.local` 파일에 설정하세요:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

## 🏗️ Architecture

이 프로젝트는 Clean Architecture 패턴을 따릅니다:

- **Presentation Layer**: UI 컴포넌트 및 페이지
- **Domain Layer**: 비즈니스 로직 및 엔티티
- **Data Layer**: API 통신 및 데이터 관리

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [Saiondo Flutter App](../app/) - 모바일 앱
- [Saiondo Backend](../../backend/) - 백엔드 API
- [Saiondo LLM](../../backend/llm/) - AI 서비스
