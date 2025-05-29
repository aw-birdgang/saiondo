import 'package:app/presentation/home/store/event_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:intl/intl.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/event.dart';

class CalendarTab extends StatefulWidget {
  const CalendarTab({Key? key}) : super(key: key);

  @override
  State<CalendarTab> createState() => _CalendarTabState();
}

class _CalendarTabState extends State<CalendarTab> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  final _eventStore = getIt<EventStore>();

  @override
  void initState() {
    super.initState();
    _eventStore.loadEvents();
  }

  List<Event> _getEventsForDay(List<Event> events, DateTime day) {
    return events.where((e) =>
      e.startTime.year == day.year &&
      e.startTime.month == day.month &&
      e.startTime.day == day.day
    ).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.pink[50],
      body: Observer(
        builder: (_) {
          if (_eventStore.isLoading) {
            return Center(
              child: LoadingAnimationWidget.staggeredDotsWave(
                color: Colors.pink,
                size: 40,
              ),
            );
          }
          final events = _eventStore.events;
          final dayEvents = _selectedDay == null ? <Event>[] : _getEventsForDay(events, _selectedDay!);

          return ListView(
            padding: const EdgeInsets.only(bottom: 80),
            children: [
              CalendarView(
                focusedDay: _focusedDay,
                selectedDay: _selectedDay,
                onDaySelected: (selected, focused) {
                  setState(() {
                    _selectedDay = selected;
                    _focusedDay = focused;
                  });
                },
                eventLoader: (day) => _getEventsForDay(events, day),
              ),
              const SizedBox(height: 8),
              EventListView(
                selectedDay: _selectedDay,
                dayEvents: dayEvents,
                onDelete: (eventId) async {
                  await _eventStore.deleteEvent(eventId);
                },
              ),
            ],
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: Colors.pink[100],
        elevation: 8,
        icon: const Icon(Icons.favorite, color: Color(0xFFD81B60)),
        label: const Padding(
          padding: EdgeInsets.symmetric(horizontal: 6.0, vertical: 2.0),
          child: Text(
            '일정 추가',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
              color: Color(0xFFD81B60),
              fontFamily: 'Nunito',
            ),
          ),
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: Color(0xFFD81B60), width: 1.2),
        ),
        onPressed: () async {
          final newEvent = await showDialog<Event>(
            context: context,
            builder: (context) => _EventDialog(selectedDay: _selectedDay ?? DateTime.now()),
          );
          if (newEvent != null) {
            await _eventStore.addEvent(newEvent);
          }
        },
      ),
    );
  }
}

// 캘린더 영역 위젯
class CalendarView extends StatelessWidget {
  final DateTime focusedDay;
  final DateTime? selectedDay;
  final void Function(DateTime, DateTime) onDaySelected;
  final List<Event> Function(DateTime) eventLoader;

  const CalendarView({
    super.key,
    required this.focusedDay,
    required this.selectedDay,
    required this.onDaySelected,
    required this.eventLoader,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 24, left: 16, right: 16, bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.pink.withOpacity(0.08),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: SizedBox(
        height: 340,
        child: TableCalendar<Event>(
          firstDay: DateTime.utc(2020, 1, 1),
          lastDay: DateTime.utc(2030, 12, 31),
          focusedDay: focusedDay,
          selectedDayPredicate: (day) =>
              selectedDay != null &&
              day.year == selectedDay!.year &&
              day.month == selectedDay!.month &&
              day.day == selectedDay!.day,
          onDaySelected: onDaySelected,
          eventLoader: eventLoader,
          daysOfWeekStyle: DaysOfWeekStyle(
            weekdayStyle: TextStyle(
              fontSize: 14,
              height: 1.6,
              color: Colors.grey[800],
              fontFamily: 'Nunito',
            ),
            weekendStyle: TextStyle(
              fontSize: 14,
              height: 1.6,
              color: Colors.pink[400],
              fontFamily: 'Nunito',
            ),
          ),
          calendarStyle: CalendarStyle(
            markerDecoration: BoxDecoration(
              color: Colors.pink[200],
              shape: BoxShape.circle,
            ),
            todayDecoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.pink[100]!, Colors.blue[50]!],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              shape: BoxShape.circle,
            ),
            selectedDecoration: BoxDecoration(
              color: Colors.pink[400],
              shape: BoxShape.circle,
            ),
            todayTextStyle: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Color(0xFFD81B60),
              fontFamily: 'Nunito',
            ),
            selectedTextStyle: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
              fontFamily: 'Nunito',
            ),
          ),
          headerStyle: HeaderStyle(
            formatButtonVisible: false,
            titleCentered: true,
            titleTextStyle: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(0xFFD81B60),
              fontFamily: 'Nunito',
            ),
            leftChevronIcon: Icon(Icons.chevron_left, color: Colors.pink[300]),
            rightChevronIcon: Icon(Icons.chevron_right, color: Colors.pink[300]),
          ),
        ),
      ),
    );
  }
}

// 일정 리스트/안내 영역 위젯
class EventListView extends StatelessWidget {
  final DateTime? selectedDay;
  final List<Event> dayEvents;
  final Future<void> Function(String eventId) onDelete;

  const EventListView({
    super.key,
    required this.selectedDay,
    required this.dayEvents,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    if (selectedDay == null) {
      // 날짜 선택 안함
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.calendar_today_rounded, color: Colors.pink[200], size: 48),
            const SizedBox(height: 12),
            const Text(
              '날짜를 선택 하세요.',
              style: TextStyle(fontSize: 16, color: Color(0xFFD81B60), fontFamily: 'Nunito'),
            ),
          ],
        ),
      );
    }
    if (dayEvents.isEmpty) {
      // 일정 없음
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.nightlight_round, color: Colors.blue[200], size: 44),
            const SizedBox(height: 10),
            const Text(
              '일정 없음',
              style: TextStyle(fontSize: 15, color: Colors.blueGrey, fontFamily: 'Nunito'),
            ),
          ],
        ),
      );
    }
    // 일정 있음
    return Column(
      children: dayEvents.map((event) {
        return Card(
          elevation: 2,
          margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: ListTile(
            leading: const Icon(Icons.event, color: Color(0xFFD81B60)),
            title: Text(
              event.title,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: Color(0xFFD81B60),
                fontFamily: 'Nunito',
              ),
            ),
            subtitle: Text(
              '${DateFormat('HH:mm').format(event.startTime)} ~ ${DateFormat('HH:mm').format(event.endTime)}'
              '${event.description != null && event.description!.isNotEmpty ? '\n${event.description}' : ''}',
              style: const TextStyle(fontSize: 13, color: Colors.blueGrey, fontFamily: 'Nunito'),
            ),
            trailing: IconButton(
              icon: const Icon(Icons.delete, color: Colors.redAccent, size: 20),
              tooltip: '삭제',
              onPressed: () async {
                await onDelete(event.id);
              },
            ),
          ),
        );
      }).toList(),
    );
  }
}

class _EventDialog extends StatefulWidget {
  final DateTime selectedDay;
  const _EventDialog({required this.selectedDay});

  @override
  State<_EventDialog> createState() => _EventDialogState();
}

class _EventDialogState extends State<_EventDialog> {
  final _formKey = GlobalKey<FormState>();
  String _title = '';
  String _description = '';
  TimeOfDay? _startTime;
  TimeOfDay? _endTime;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      backgroundColor: Colors.pink[50],
      title: Row(
        children: const [
          Icon(Icons.favorite, color: Color(0xFFD81B60)),
          SizedBox(width: 8),
          Text('일정 추가', style: TextStyle(fontFamily: 'Nunito', color: Color(0xFFD81B60))),
        ],
      ),
      content: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                decoration: const InputDecoration(
                  labelText: '제목',
                  labelStyle: TextStyle(color: Color(0xFFD81B60)),
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Color(0xFFD81B60)),
                  ),
                ),
                validator: (v) => v == null || v.isEmpty ? '제목을 입력하세요' : null,
                onSaved: (v) => _title = v ?? '',
              ),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: '설명',
                  labelStyle: TextStyle(color: Color(0xFFD81B60)),
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Color(0xFFD81B60)),
                  ),
                ),
                onSaved: (v) => _description = v ?? '',
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextButton.icon(
                      icon: const Icon(Icons.access_time, color: Color(0xFFD81B60), size: 18),
                      label: Text(
                        _startTime == null ? '시작 시간' : _startTime!.format(context),
                        style: const TextStyle(color: Color(0xFFD81B60), fontFamily: 'Nunito'),
                      ),
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.pink[100],
                      ),
                      onPressed: () async {
                        final t = await showTimePicker(
                          context: context,
                          initialTime: TimeOfDay(hour: 9, minute: 0),
                        );
                        if (t != null) setState(() => _startTime = t);
                      },
                    ),
                  ),
                  Expanded(
                    child: TextButton.icon(
                      icon: const Icon(Icons.access_time, color: Color(0xFFD81B60), size: 18),
                      label: Text(
                        _endTime == null ? '종료 시간' : _endTime!.format(context),
                        style: const TextStyle(color: Color(0xFFD81B60), fontFamily: 'Nunito'),
                      ),
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.pink[100],
                      ),
                      onPressed: () async {
                        final t = await showTimePicker(
                          context: context,
                          initialTime: TimeOfDay(hour: 10, minute: 0),
                        );
                        if (t != null) setState(() => _endTime = t);
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          child: const Text('취소', style: TextStyle(color: Colors.blueGrey)),
          onPressed: () => Navigator.pop(context),
        ),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.pink[100],
            foregroundColor: const Color(0xFFD81B60),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            elevation: 0,
          ),
          child: const Text('추가', style: TextStyle(fontWeight: FontWeight.bold)),
          onPressed: () {
            if (_formKey.currentState?.validate() ?? false) {
              _formKey.currentState?.save();
              final start = DateTime(
                widget.selectedDay.year,
                widget.selectedDay.month,
                widget.selectedDay.day,
                _startTime?.hour ?? 9,
                _startTime?.minute ?? 0,
              );
              final end = DateTime(
                widget.selectedDay.year,
                widget.selectedDay.month,
                widget.selectedDay.day,
                _endTime?.hour ?? 10,
                _endTime?.minute ?? 0,
              );
              Navigator.pop(
                context,
                Event(
                  id: '', // 생성 시 서버에서 할당
                  title: _title,
                  description: _description,
                  startTime: start,
                  endTime: end,
                ),
              );
            }
          },
        ),
      ],
    );
  }
}
