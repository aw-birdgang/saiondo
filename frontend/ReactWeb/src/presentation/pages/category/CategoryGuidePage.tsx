import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/app";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
  tips: string[];
}

const CategoryGuideScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: Category[] = [
    {
      id: "relationship",
      name: "관계 개선",
      description: "파트너와의 관계를 더 깊고 건강하게 만들어가는 대화",
      icon: "💕",
      color: "bg-pink-100 text-pink-800",
      examples: [
        "서로의 감정을 더 잘 이해하고 싶어요",
        "관계에서 개선하고 싶은 부분이 있어요",
        "파트너와 더 깊은 대화를 나누고 싶어요",
        "서로의 사랑 언어를 알아보고 싶어요",
      ],
      tips: [
        "정기적으로 관계에 대해 대화하는 시간을 가져보세요",
        '서로의 감정을 표현할 때 "나" 메시지를 사용하세요',
        "파트너의 관점을 이해하려고 노력하세요",
        "작은 것들에도 감사함을 표현하세요",
      ],
    },
    {
      id: "communication",
      name: "소통 개선",
      description: "더 효과적이고 건강한 소통 방법을 배우는 대화",
      icon: "💬",
      color: "bg-blue-100 text-blue-800",
      examples: [
        "대화할 때 자주 싸우게 돼요",
        "서로의 의견이 다를 때 어떻게 대화해야 할지 모르겠어요",
        "파트너의 말을 제대로 이해하지 못할 때가 있어요",
        "감정적인 대화를 할 때 어려움이 있어요",
      ],
      tips: [
        "듣기와 말하기의 균형을 맞추세요",
        "감정이 격해질 때는 잠시 휴식을 취하세요",
        "파트너의 말을 반복해서 확인해보세요",
        "비난보다는 요청의 형태로 말해보세요",
      ],
    },
    {
      id: "conflict",
      name: "갈등 해결",
      description: "관계에서 발생하는 갈등을 건설적으로 해결하는 방법",
      icon: "🤝",
      color: "bg-orange-100 text-orange-800",
      examples: [
        "자주 같은 문제로 다투게 돼요",
        "갈등이 생겼을 때 어떻게 해결해야 할지 모르겠어요",
        "서로의 입장이 다를 때 합의점을 찾기 어려워요",
        "과거의 상처가 현재 갈등에 영향을 미쳐요",
      ],
      tips: [
        "갈등의 원인을 함께 찾아보세요",
        "승리보다는 해결에 집중하세요",
        "과거의 일을 끌어오지 마세요",
        "서로의 감정을 인정하고 공감하세요",
      ],
    },
    {
      id: "intimacy",
      name: "친밀감 증진",
      description: "파트너와의 정서적, 신체적 친밀감을 높이는 대화",
      icon: "💝",
      color: "bg-red-100 text-red-800",
      examples: [
        "파트너와 더 가까워지고 싶어요",
        "서로의 취미와 관심사를 더 잘 알고 싶어요",
        "로맨틱한 시간을 더 많이 가져보고 싶어요",
        "서로의 꿈과 목표를 공유하고 싶어요",
      ],
      tips: [
        "매일 서로에 대해 새로운 것을 알아보세요",
        "함께 새로운 경험을 해보세요",
        "서로의 취미에 관심을 가져보세요",
        "정기적인 데이트 시간을 가져보세요",
      ],
    },
    {
      id: "future",
      name: "미래 계획",
      description: "함께 미래를 계획하고 목표를 설정하는 대화",
      icon: "🎯",
      color: "bg-green-100 text-green-800",
      examples: [
        "함께 미래 계획을 세우고 싶어요",
        "결혼이나 동거에 대해 이야기하고 싶어요",
        "경제적인 계획을 함께 세우고 싶어요",
        "가족 계획에 대해 이야기하고 싶어요",
      ],
      tips: [
        "서로의 가치관과 목표를 먼저 공유하세요",
        "단계별로 계획을 세워보세요",
        "서로의 우선순위를 이해하세요",
        "정기적으로 계획을 점검하고 조정하세요",
      ],
    },
    {
      id: "daily",
      name: "일상 공유",
      description: "일상적인 대화를 통해 서로를 더 잘 이해하는 시간",
      icon: "☀️",
      color: "bg-yellow-100 text-yellow-800",
      examples: [
        "하루 동안 있었던 일을 공유하고 싶어요",
        "일상에서 느낀 감정을 나누고 싶어요",
        "작은 성취나 어려움을 함께 나누고 싶어요",
        "일상의 소소한 이야기를 나누고 싶어요",
      ],
      tips: [
        "매일 서로의 하루를 물어보세요",
        "작은 것에도 관심을 가져보세요",
        "감정을 함께 나누세요",
        "서로의 일상에 참여해보세요",
      ],
    },
  ];

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="text-text-secondary hover:text-text"
            >
              ← 뒤로
            </button>
            <h1 className="text-lg font-semibold text-text">
              대화 카테고리 가이드
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text mb-4">
              대화 카테고리 가이드
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Saiondo에서 제공하는 다양한 대화 카테고리를 통해 더 의미 있는
              대화를 나누어보세요. 각 카테고리는 특정 주제에 집중하여 더 깊이
              있는 소통을 도와줍니다.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedCategory === category.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">{category.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-text">
                        {category.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}
                      >
                        {category.name}
                      </span>
                    </div>
                  </div>

                  <p className="text-text-secondary text-sm mb-4">
                    {category.description}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(ROUTES.CHAT);
                    }}
                    className="btn btn-primary w-full"
                  >
                    이 카테고리로 대화하기
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Category Details */}
          {selectedCategoryData && (
            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{selectedCategoryData.icon}</div>
                  <h3 className="text-xl font-semibold text-text">
                    {selectedCategoryData.name} 상세 가이드
                  </h3>
                </div>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Examples */}
                  <div>
                    <h4 className="text-lg font-semibold text-text mb-4">
                      이런 대화를 나누어보세요
                    </h4>
                    <ul className="space-y-3">
                      {selectedCategoryData.examples.map((example, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-text-secondary">{example}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tips */}
                  <div>
                    <h4 className="text-lg font-semibold text-text mb-4">
                      대화 팁
                    </h4>
                    <ul className="space-y-3">
                      {selectedCategoryData.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-text-secondary">{tip}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <button
                    onClick={() => navigate(ROUTES.CHAT)}
                    className="btn btn-primary w-full"
                  >
                    {selectedCategoryData.name} 카테고리로 대화 시작하기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* How to Use */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-xl font-semibold text-text">
                카테고리 활용 방법
              </h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h4 className="font-semibold text-text mb-2">
                    카테고리 선택
                  </h4>
                  <p className="text-sm text-text-secondary">
                    관심 있는 주제나 현재 필요한 대화 카테고리를 선택하세요.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h4 className="font-semibold text-text mb-2">AI와 대화</h4>
                  <p className="text-sm text-text-secondary">
                    선택한 카테고리에 맞는 전문적인 조언과 대화를 나누세요.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h4 className="font-semibold text-text mb-2">관계 개선</h4>
                  <p className="text-sm text-text-secondary">
                    AI의 조언을 바탕으로 파트너와 더 나은 관계를 만들어가세요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.CHAT)}
              className="btn btn-primary"
            >
              대화 시작하기
            </button>
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="btn btn-secondary"
            >
              홈으로 가기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryGuideScreen;
