import React from 'react';
import { SearchInput } from '../../search';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  suggestions: string[];
}

const SearchSection: React.FC<SearchSectionProps> = ({
  onSearch,
  onSuggestionClick,
  suggestions
}) => {
  return (
    <div className="mb-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-txt mb-2">무엇을 찾고 계신가요?</h2>
          <p className="text-txt-secondary">상담, 조언, 정보를 검색해보세요</p>
        </div>
        <SearchInput
          placeholder="상담 주제나 키워드를 입력하세요..."
          className="w-full"
          onSearch={onSearch}
          showSuggestions={true}
          suggestions={suggestions}
          onSuggestionClick={onSuggestionClick}
        />
      </div>
    </div>
  );
};

export default SearchSection; 