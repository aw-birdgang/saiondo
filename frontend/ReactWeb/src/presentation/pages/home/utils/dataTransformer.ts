import { getIconComponent } from '../../../components/specific/home/IconComponents';
import { QUICK_ACTIONS } from '../constants/homeData';

export const transformQuickActions = () => {
  return QUICK_ACTIONS.map(action => ({
    ...action,
    icon: getIconComponent(action.icon),
  }));
};
