import { getIconComponent } from '@/presentation/components/specific/home/IconComponents';
import { QUICK_ACTIONS } from '@/presentation/pages/home/constants/homeData';

export const transformQuickActions = () => {
  return QUICK_ACTIONS.map(action => ({
    ...action,
    icon: getIconComponent(action.icon),
  }));
};
