import { getIconComponent } from '../../../components/specific/home/IconComponents';
import { STATS_DATA, QUICK_ACTIONS } from '../constants/homeData';

export const transformStatsData = () => {
  return STATS_DATA.map(stat => ({
    ...stat,
    icon: getIconComponent(stat.icon)
  }));
};

export const transformQuickActions = () => {
  return QUICK_ACTIONS.map(action => ({
    ...action,
    icon: getIconComponent(action.icon)
  }));
}; 