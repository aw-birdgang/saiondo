import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../common';

interface ImageUploadProps {
  currentImage?: string;
  onImageUpload: (file: File) => Promise<void>;
  type: 'avatar' | 'cover';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageUpload,
  type,
  size = 'md',
  className = '',
}) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: {
      container: 'w-20 h-20',
      image: 'w-20 h-20',
      icon: 'w-8 h-8',
    },
    md: {
      container: 'w-32 h-32',
      image: 'w-32 h-32',
      icon: 'w-12 h-12',
    },
    lg: {
      container: 'w-48 h-48',
      image: 'w-48 h-48',
      icon: 'w-16 h-16',
    },
  };

  const currentSize = sizeClasses[size];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 유효성 검사
      if (!validateFile(file)) {
        return;
      }

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = e => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // 업로드 실행
      handleUpload(file);
    }
  };

  const validateFile = (file: File): boolean => {
    // 파일 크기 검사 (5MB 제한)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert(t('image_too_large', { maxSize: '5MB' }));
      return false;
    }

    // 파일 타입 검사
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert(t('invalid_image_type'));
      return false;
    }

    return true;
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await onImageUpload(file);
      // 성공 시 미리보기 제거
      setPreviewUrl(null);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert(t('upload_failed'));
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = previewUrl || currentImage;

  return (
    <div className={`relative ${className}`}>
      {/* 이미지 컨테이너 */}
      <div
        className={`${currentSize.container} relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors ${
          type === 'avatar' ? 'rounded-full' : 'rounded-lg'
        }`}
        onClick={handleClick}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={type === 'avatar' ? t('avatar') : t('cover_image')}
            className={`${currentSize.image} object-cover ${
              type === 'avatar' ? 'rounded-full' : 'rounded-lg'
            }`}
          />
        ) : (
          <div className='text-center'>
            <svg
              className={`${currentSize.icon} mx-auto text-gray-400 mb-2`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
            <p className='text-sm text-gray-500'>
              {type === 'avatar'
                ? t('click_to_upload_avatar')
                : t('click_to_upload_cover')}
            </p>
          </div>
        )}

        {/* 업로드 중 오버레이 */}
        {isUploading && (
          <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg'>
            <div className='text-white text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2'></div>
              <p className='text-sm'>{t('uploading')}</p>
            </div>
          </div>
        )}
      </div>

      {/* 액션 버튼들 */}
      <div className='mt-2 flex space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={handleClick}
          disabled={isUploading}
          className='flex-1'
        >
          {displayImage ? t('change') : t('upload')}
        </Button>

        {displayImage && (
          <Button
            variant='outline'
            size='sm'
            onClick={handleRemove}
            disabled={isUploading}
            className='text-red-600 hover:text-red-700'
          >
            {t('remove')}
          </Button>
        )}
      </div>

      {/* 파일 입력 */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/jpeg,image/jpg,image/png,image/webp'
        onChange={handleFileSelect}
        className='hidden'
      />

      {/* 도움말 텍스트 */}
      <p className='mt-2 text-xs text-gray-500'>
        {t('image_upload_help', {
          maxSize: '5MB',
          formats: 'JPG, PNG, WebP',
        })}
      </p>
    </div>
  );
};

export default ImageUpload;
