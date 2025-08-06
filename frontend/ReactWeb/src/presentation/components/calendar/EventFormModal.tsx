import React, { useState, useEffect } from 'react';
import { Modal } from '@/presentation/components/common';
import type { Event } from '@/presentation/pages/calendar/types/calendarTypes';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Event) => void;
  editingEvent?: Event | null;
  selectedDate?: Date | null;
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingEvent,
  selectedDate,
}) => {
  const [formData, setFormData] = useState<Event>({
    title: '',
    date: selectedDate || new Date(),
    time: '',
    type: 'other' as const,
    description: '',
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        ...editingEvent,
        date: editingEvent.date || selectedDate || new Date(),
      });
    } else {
      setFormData({
        title: '',
        date: selectedDate || new Date(),
        time: '',
        type: 'other' as const,
        description: '',
      });
    }
  }, [editingEvent, selectedDate]);

  const handleInputChange = (field: keyof Event, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'type' ? (value as Event['type']) : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingEvent ? '이벤트 수정' : '새 이벤트 추가'}
    >
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-txt mb-1'>
            제목
          </label>
          <input
            type='text'
            value={formData.title}
            onChange={e => handleInputChange('title', e.target.value)}
            className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='이벤트 제목을 입력하세요'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-txt mb-1'>
            타입
          </label>
          <select
            value={formData.type}
            onChange={e => handleInputChange('type', e.target.value)}
            className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
          >
            <option value='meeting'>회의</option>
            <option value='date'>데이트</option>
            <option value='anniversary'>기념일</option>
            <option value='work'>업무</option>
            <option value='personal'>개인</option>
            <option value='other'>기타</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-txt mb-1'>
            시간
          </label>
          <input
            type='time'
            value={formData.time}
            onChange={e => handleInputChange('time', e.target.value)}
            className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-txt mb-1'>
            설명
          </label>
          <textarea
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
            rows={3}
            placeholder='이벤트 설명을 입력하세요'
          />
        </div>
      </div>

      <div className='flex justify-end space-x-2 mt-6'>
        <button
          onClick={onClose}
          className='px-4 py-2 border border-border rounded-lg hover:bg-focus'
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark'
        >
          {editingEvent ? '수정' : '추가'}
        </button>
      </div>
    </Modal>
  );
};

export default EventFormModal;
