# 🎨 Design System - Modern Enterprise UI/UX

현업에서 가장 많이 사용하는 UI/UX 패턴을 적용한 모던 디자인 시스템입니다.

## 📋 목차

- [개요](#개요)
- [설치 및 설정](#설치-및-설정)
- [컴포넌트](#컴포넌트)
- [훅](#훅)
- [유틸리티](#유틸리티)
- [애니메이션](#애니메이션)
- [접근성](#접근성)
- [사용 예시](#사용-예시)

## 🎯 개요

이 디자인 시스템은 다음과 같은 현업 UI/UX 트렌드를 반영합니다:

- **Glassmorphism**: 반투명 효과와 블러 처리
- **Neumorphism**: 부드러운 그림자와 입체감
- **Micro-interactions**: 세밀한 상호작용 애니메이션
- **Accessibility**: WCAG 2.1 AA 준수
- **Responsive Design**: 모바일 퍼스트 접근
- **Dark Mode**: 다크 테마 지원
- **Performance**: 최적화된 렌더링

## 🚀 설치 및 설정

### 1. 의존성 설치

```bash
pnpm add class-variance-authority clsx tailwind-merge
```

### 2. Tailwind CSS 설정

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Design System Colors
        primary: {
          50: '#fef2f2',
          500: '#d21e1d',
          600: '#dc2626',
        },
        // ... 기타 색상
      },
      boxShadow: {
        // Glassmorphism shadows
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        
        // Neumorphism shadows
        'neu-light': '5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff',
        'neu-dark': '5px 5px 10px #1a1a1a, -5px -5px 10px #2a2a2a',
      },
    },
  },
};
```

## 🧩 컴포넌트

### Button

```tsx
import { Button } from '@/shared/design-system/components';

// 기본 버튼
<Button>Click me</Button>

// 다양한 변형
<Button variant="glass">Glass Button</Button>
<Button variant="neu">Neumorphic Button</Button>
<Button variant="floating">Floating Button</Button>

// 로딩 상태
<Button loading>Loading...</Button>

// 아이콘과 함께
<Button leftIcon={<Icon />}>With Icon</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/design-system/components';

// 기본 카드
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Card content goes here</CardContent>
</Card>

// Glassmorphism 카드
<GlassmorphicCard>
  <div>Glass effect content</div>
</GlassmorphicCard>

// Neumorphic 카드
<NeumorphicCard>
  <div>Neumorphic effect content</div>
</NeumorphicCard>
```

### Input

```tsx
import { Input } from '@/shared/design-system/components';

// 기본 입력
<Input placeholder="Enter text..." />

// 다양한 스타일
<Input variant="glass" placeholder="Glass input" />
<Input variant="neu" placeholder="Neumorphic input" />
<Input variant="modern" placeholder="Modern input" />

// 에러 상태
<Input error="This field is required" />
```

### Floating Action Button

```tsx
import { FloatingActionButton } from '@/shared/design-system/components';

<FloatingActionButton
  icon={<PlusIcon />}
  label="Add new item"
  variant="primary"
  size="lg"
  position="bottom-right"
  onClick={() => console.log('FAB clicked')}
/>
```

## 🎣 훅

### useTheme

```tsx
import { useTheme } from '@/shared/design-system/hooks';

const { theme, setTheme, toggleTheme } = useTheme();

// 테마 토글
<button onClick={toggleTheme}>
  {theme === 'dark' ? '🌞' : '🌙'}
</button>
```

### useLoading

```tsx
import { useLoading } from '@/shared/design-system/hooks';

const { loading, startLoading, stopLoading, withLoading } = useLoading();

// 수동 로딩 제어
const handleSubmit = async () => {
  startLoading();
  try {
    await submitData();
  } finally {
    stopLoading();
  }
};

// 자동 로딩 제어
const handleSubmitWithLoading = () => {
  withLoading(async () => {
    await submitData();
  });
};
```

### useToast

```tsx
import { useToast } from '@/shared/design-system/hooks';

const { success, error, warning, info } = useToast();

// 토스트 메시지 표시
success('Successfully saved!');
error('Something went wrong');
warning('Please check your input');
info('New feature available');
```

### useForm

```tsx
import { useForm } from '@/shared/design-system/hooks';

const { values, errors, handleChange, handleBlur, reset } = useForm({
  email: '',
  password: '',
});

// 폼 필드 변경
<input
  name="email"
  value={values.email}
  onChange={(e) => handleChange('email', e.target.value)}
  onBlur={() => handleBlur('email')}
/>
```

## 🛠️ 유틸리티

### 색상 유틸리티

```tsx
import { hexToRgb, getContrastColor, adjustBrightness } from '@/shared/design-system/utils';

// HEX to RGB 변환
const rgb = hexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }

// 대비 색상 계산
const contrastColor = getContrastColor('#ffffff'); // 'black'

// 밝기 조정
const darkerColor = adjustBrightness('#ff0000', -20); // 20% 어둡게
```

### 문자열 유틸리티

```tsx
import { capitalize, truncate, slugify, formatNumber } from '@/shared/design-system/utils';

capitalize('hello world'); // 'Hello world'
truncate('Very long text', 10); // 'Very long...'
slugify('Hello World!'); // 'hello-world'
formatNumber(1234567); // '1.2M'
```

### 날짜 유틸리티

```tsx
import { formatDate, formatTime } from '@/shared/design-system/utils';

formatDate(new Date(), 'short'); // 'Jan 1, 2024'
formatDate(new Date(), 'long'); // 'Monday, January 1, 2024'
formatDate(new Date(), 'relative'); // 'Today'
formatTime(new Date()); // '2:30 PM'
```

## 🎬 애니메이션

### useAnimation

```tsx
import { useAnimation } from '@/shared/design-system/animations';

const { elementRef, isAnimating } = useAnimation('fadeIn', true, 0);

<div ref={elementRef} className="animate-fade-in">
  Animated content
</div>
```

### useIntersectionAnimation

```tsx
import { useIntersectionAnimation } from '@/shared/design-system/animations';

const { elementRef, isAnimating, isVisible } = useIntersectionAnimation(
  'slideInUp',
  0.1,
  '0px'
);

<div ref={elementRef}>
  Content that animates when visible
</div>
```

### useStaggerAnimation

```tsx
import { useStaggerAnimation } from '@/shared/design-system/animations';

const items = ['Item 1', 'Item 2', 'Item 3'];
const animatedItems = useStaggerAnimation(items, 'fadeIn', 100);

{items.map((item, index) => (
  <div
    key={index}
    className={`transition-all duration-300 ${
      animatedItems.has(index) ? 'opacity-100' : 'opacity-0'
    }`}
  >
    {item}
  </div>
))}
```

## ♿ 접근성

### ARIA 속성

```tsx
import { getAriaAttributes } from '@/shared/design-system/accessibility';

const ariaProps = getAriaAttributes({
  label: 'Submit button',
  describedby: 'form-description',
  required: true,
});

<button {...ariaProps}>Submit</button>
```

### 포커스 관리

```tsx
import { useFocusManagement } from '@/shared/design-system/accessibility';

const { focusedIndex, focusNext, focusPrevious } = useFocusManagement();

// 키보드 네비게이션
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') focusNext();
    if (e.key === 'ArrowUp') focusPrevious();
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [focusNext, focusPrevious]);
```

### 스크린 리더 지원

```tsx
import { useScreenReaderAnnouncement } from '@/shared/design-system/accessibility';

const { announce } = useScreenReaderAnnouncement();

// 상태 변경 시 스크린 리더에 알림
const handleSubmit = () => {
  submitData();
  announce('Form submitted successfully');
};
```

## 📱 사용 예시

### 모던 홈페이지

```tsx
import React from 'react';
import {
  GlassmorphicCard,
  NeumorphicCard,
  FloatingActionButton,
  Button,
  Input,
} from '@/shared/design-system/components';
import { useIntersectionAnimation } from '@/shared/design-system/animations';

const ModernHomePage = () => {
  const { elementRef } = useIntersectionAnimation('slideInUp', 0.1, '0px');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section ref={elementRef} className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-8">
            Welcome to Our Platform
          </h1>
          <Input
            placeholder="Search..."
            variant="modern"
            className="max-w-md mx-auto"
          />
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassmorphicCard className="p-8 text-center">
              <h3>Feature 1</h3>
              <p>Description</p>
            </GlassmorphicCard>
            
            <NeumorphicCard className="p-8 text-center">
              <h3>Feature 2</h3>
              <p>Description</p>
            </NeumorphicCard>
            
            <GlassmorphicCard className="p-8 text-center">
              <h3>Feature 3</h3>
              <p>Description</p>
            </GlassmorphicCard>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={<PlusIcon />}
        label="Add new"
        variant="primary"
        onClick={() => console.log('FAB clicked')}
      />
    </div>
  );
};
```

### 반응형 카드 그리드

```tsx
import React from 'react';
import { Card, useStaggerAnimation } from '@/shared/design-system';

const CardGrid = () => {
  const cards = [
    { id: 1, title: 'Card 1', content: 'Content 1' },
    { id: 2, title: 'Card 2', content: 'Content 2' },
    { id: 3, title: 'Card 3', content: 'Content 3' },
    { id: 4, title: 'Card 4', content: 'Content 4' },
  ];

  const animatedCards = useStaggerAnimation(cards, 'fadeIn', 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card
          key={card.id}
          variant="modern"
          className={`transition-all duration-300 ${
            animatedCards.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
          </CardHeader>
          <CardContent>{card.content}</CardContent>
        </Card>
      ))}
    </div>
  );
};
```

## 🎨 디자인 토큰

### 색상

```css
/* Light Theme */
--color-primary: #d21e1d;
--color-secondary: #eff3f3;
--color-surface: #fafbfb;
--color-text: #241e30;

/* Dark Theme */
--color-primary: #ff8383;
--color-secondary: #4d1f7c;
--color-surface: #1f1929;
--color-text: #ffffff;
```

### 간격

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

### 그림자

```css
/* Glassmorphism */
--shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.37);

/* Neumorphism */
--shadow-neu-light: 5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff;
--shadow-neu-dark: 5px 5px 10px #1a1a1a, -5px -5px 10px #2a2a2a;
```

## 🔧 성능 최적화

### 메모이제이션

```tsx
import { memoize } from '@/shared/design-system/utils';

const expensiveCalculation = memoize((input) => {
  // 복잡한 계산
  return result;
});
```

### 디바운싱

```tsx
import { debounce } from '@/shared/design-system/utils';

const debouncedSearch = debounce((query) => {
  performSearch(query);
}, 300);

<input onChange={(e) => debouncedSearch(e.target.value)} />
```

### 스로틀링

```tsx
import { throttle } from '@/shared/design-system/utils';

const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 16); // 60fps

window.addEventListener('scroll', throttledScroll);
```

## 📚 추가 리소스

- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Headless UI 문서](https://headlessui.dev/)
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design 3](https://m3.material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## 🤝 기여하기

1. 이슈 생성
2. 브랜치 생성 (`feature/component-name`)
3. 변경사항 커밋
4. Pull Request 생성

## 📄 라이선스

MIT License 