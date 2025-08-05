import React, { useState } from 'react';
import { useChannelController } from '../../providers/ControllerProvider';
import { toast } from 'react-hot-toast';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelCreated?: (channel: any) => void;
  currentUserId: string;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  onChannelCreated,
  currentUserId,
}) => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [channelType, setChannelType] = useState<'public' | 'private'>(
    'public'
  );
  const [isCreating, setIsCreating] = useState(false);

  const channelController = useChannelController();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!channelName.trim() || isCreating) return;

    setIsCreating(true);

    try {
      const newChannel = await channelController.createChannel({
        name: channelName.trim(),
        description: description.trim(),
        type: channelType,
        ownerId: currentUserId,
        members: [currentUserId], // 생성자가 자동으로 멤버가 됨
      });

      // 폼 초기화
      setChannelName('');
      setDescription('');
      setChannelType('public');

      onChannelCreated?.(newChannel);
      onClose();

      toast.success('채널이 생성되었습니다.');
    } catch (error) {
      console.error('채널 생성 실패:', error);
      toast.error('채널 생성에 실패했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setChannelName('');
      setDescription('');
      setChannelType('public');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            새 채널 만들기
          </h2>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* 채널 이름 */}
          <div>
            <label
              htmlFor='channelName'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              채널 이름 *
            </label>
            <input
              id='channelName'
              type='text'
              value={channelName}
              onChange={e => setChannelName(e.target.value)}
              disabled={isCreating}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50'
              placeholder='채널 이름을 입력하세요'
              maxLength={50}
              required
            />
          </div>

          {/* 채널 설명 */}
          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              설명 (선택사항)
            </label>
            <textarea
              id='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={isCreating}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50'
              placeholder='채널에 대한 설명을 입력하세요'
              rows={3}
              maxLength={200}
            />
          </div>

          {/* 채널 타입 */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              채널 타입
            </label>
            <div className='space-y-2'>
              <label className='flex items-center'>
                <input
                  type='radio'
                  value='public'
                  checked={channelType === 'public'}
                  onChange={e =>
                    setChannelType(e.target.value as 'public' | 'private')
                  }
                  disabled={isCreating}
                  className='mr-2'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  공개 채널 - 누구나 찾을 수 있고 참여할 수 있습니다
                </span>
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  value='private'
                  checked={channelType === 'private'}
                  onChange={e =>
                    setChannelType(e.target.value as 'public' | 'private')
                  }
                  disabled={isCreating}
                  className='mr-2'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  비공개 채널 - 초대된 사람만 참여할 수 있습니다
                </span>
              </label>
            </div>
          </div>

          {/* 버튼 */}
          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={handleClose}
              disabled={isCreating}
              className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50'
            >
              취소
            </button>
            <button
              type='submit'
              disabled={!channelName.trim() || isCreating}
              className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isCreating ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  생성중...
                </div>
              ) : (
                '채널 만들기'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
