export interface Event {
  id?: string;
  title: string;
  date: Date;
  type: 'meeting' | 'date' | 'anniversary' | 'other' | 'work' | 'personal';
  description?: string;
  time?: string;
  location?: string;
  priority?: 'low' | 'medium' | 'high';
  isAllDay?: boolean;
  color?: string;
}

export type ViewMode = 'month' | 'week' | 'day';

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: ViewMode;
  events: Event[];
  isEventFormOpen: boolean;
  editingEvent: Event | null;
  selectedEventType: string;
  isLoading: boolean;
}

export interface EventTypeConfig {
  meeting: { color: string; label: string };
  date: { color: string; label: string };
  anniversary: { color: string; label: string };
  other: { color: string; label: string };
  work: { color: string; label: string };
  personal: { color: string; label: string };
}

export interface EventStats {
  total: number;
  byType: Record<string, number>;
  byPriority: { low: number; medium: number; high: number };
}

export interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export interface CalendarViewProps {
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: ViewMode;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  className?: string;
}

export interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  className?: string;
}

export interface WeekViewProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  className?: string;
}

export interface DayViewProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  className?: string;
}

export interface CalendarDayProps {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  isSelected: boolean;
  events: Event[];
  onClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  className?: string;
}

export interface EventItemProps {
  event: Event;
  onClick: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  className?: string;
}

export interface EventFormProps {
  isOpen: boolean;
  editingEvent: Event | null;
  selectedDate: Date | null;
  onSubmit: (event: Event) => void;
  onClose: () => void;
}

export interface EventFilterProps {
  selectedEventType: string;
  onEventTypeChange: (type: string) => void;
  eventStats: EventStats;
  className?: string;
}

export interface CalendarSidebarProps {
  events: Event[];
  selectedDate: Date | null;
  onEventEdit: (event: Event) => void;
  onEventDelete: (eventId: string) => void;
  className?: string;
}

export interface CalendarContainerProps {
  children: React.ReactNode;
  className?: string;
}
