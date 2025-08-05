import React from 'react';
import { ProfileSection } from '../../../components/specific/mypage';
import SectionBlock from '../SectionBlock';

interface ProfileSectionWrapperProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileSectionWrapper: React.FC<ProfileSectionWrapperProps> = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
}) => (
  <SectionBlock
    id='profile-section'
    ariaLabelledby='profile-heading'
    className='border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800'
  >
    <ProfileSection
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
    />
  </SectionBlock>
);

export default ProfileSectionWrapper;
