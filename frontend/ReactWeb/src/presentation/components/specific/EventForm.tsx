import React, { useState } from 'react';
import { useFormInitialization } from '../../hooks/useFormInitialization';

interface Event {
  id?: string;
  title: string;
  date: Date;
  type: 'meeting' | 'date' | 'anniversary' | 'other';
  description?: string;
  time?: string;
  location?: string;
}

interface EventFormProps {
  event?: Event;
  selectedDate: Date;
  onSubmit: (event: Event) => void;
  onCancel: () => void;
  isOpen: boolean;
  className?: string;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  selectedDate,
  onSubmit,
  onCancel,
  isOpen,
  className = ''
}) => {
  const eventTypes = [
    { value: 'meeting', label: '미팅', icon: '🤝' },
    { value: 'date', label: '데이트', icon: '💕' },
    { value: 'anniversary', label: '기념일', icon: '🎉' },
    { value: 'other', label: '기타', icon: '📅' }
  ];

  // Use custom hook for form initialization
  const { formData, updateFormData } = useFormInitialization({
    initialData: event,
    defaultData: {
      title: '',
      date: selectedDate,
      type: 'other' as const,
      description: '',
      time: '',
      location: ''
    },
    dependencies: [selectedDate]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const eventToSubmit: Event = {
      ...formData,
      id: event?.id || Date.now().toString(),
      date: formData.date
    };

    onSubmit(eventToSubmit);
  };

  const handleInputChange = (field: keyof Event, value: string | Date) => {
    updateFormData({ [field]: value } as Partial<Event>);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${className}`}>
      <div className="card max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-txt leading-tight">
              {event ? '일정 수정' : '새 일정'}
            </h2>
            <button
              onClick={onCancel}
              className="text-txt-secondary hover:text-txt transition-all duration-200 hover:scale-110 p-3"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Type */}
            <div>
              <label className="block text-sm font-semibold text-txt mb-4">
                일정 유형
              </label>
              <div className="grid grid-cols-2 gap-4">
                {eventTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value as Event['type'])}
                    className={`
                      p-6 rounded-xl border-2 text-left transition-all duration-200 hover:scale-105
                      ${formData.type === type.value
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/30'
                      }
                    `}
                  >
                    <div className="text-3xl mb-3">{type.icon}</div>
                    <div className="text-sm font-semibold text-txt leading-tight">
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-txt mb-4">
                제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="일정 제목을 입력하세요"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-txt mb-4">
                날짜
              </label>
              <input
                type="date"
                value={formData.date.toISOString().split('T')[0]}
                onChange={(e) => handleInputChange('date', new Date(e.target.value))}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-semibold text-txt mb-4">
                시간
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-txt mb-4">
                장소
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="장소를 입력하세요"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-txt mb-4">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="일정에 대한 설명을 입력하세요"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 border border-border rounded-lg text-txt-secondary hover:bg-secondary transition-all duration-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
              >
                {event ? '수정' : '추가'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm; 