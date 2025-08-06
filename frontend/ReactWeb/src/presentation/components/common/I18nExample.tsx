import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/presentation/components/common/LanguageSwitcher';

export const I18nExample: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>{t('common.welcome')}</h2>

      <div className='space-y-4'>
        <div>
          <h3 className='text-lg font-semibold mb-2'>{t('navigation.home')}</h3>
          <p className='text-gray-600'>{t('home.subtitle')}</p>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-2'>{t('auth.signIn')}</h3>
          <p className='text-gray-600'>{t('auth.email')}: user@example.com</p>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-2'>{t('common.actions')}</h3>
          <div className='flex gap-2'>
            <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
              {t('common.save')}
            </button>
            <button className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'>
              {t('common.cancel')}
            </button>
          </div>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-2'>{t('common.language')}</h3>
          <LanguageSwitcher variant='buttons' />
        </div>
      </div>
    </div>
  );
};
