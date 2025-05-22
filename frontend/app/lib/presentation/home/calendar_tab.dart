import 'package:app/presentation/home/store/event_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:intl/intl.dart';
import 'package:table_calendar/table_calendar.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/event.dart';

class CalendarTab extends StatefulWidget {
  const CalendarTab({Key? key,}) : super(key: key);

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
    this._eventStore.loadEvents();
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
      body: Observer(
        builder: (_) {
          if (_eventStore.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          final events = _eventStore.events;
          return LayoutBuilder(
            builder: (context, constraints) {
              final calendarHeight = constraints.maxHeight * 0.45;
              return Column(
                children: [
                  SizedBox(
                    height: calendarHeight < 400 ? 400 : calendarHeight,
                    child: TableCalendar<Event>(
                      firstDay: DateTime.utc(2020, 1, 1),
                      lastDay: DateTime.utc(2030, 12, 31),
                      focusedDay: _focusedDay,
                      selectedDayPredicate: (day) =>
                          _selectedDay != null &&
                          day.year == _selectedDay!.year &&
                          day.month == _selectedDay!.month &&
                          day.day == _selectedDay!.day,
                      onDaySelected: (selectedDay, focusedDay) {
                        setState(() {
                          _selectedDay = selectedDay;
                          _focusedDay = focusedDay;
                        });
                      },
                      eventLoader: (day) => _getEventsForDay(events, day),
                      daysOfWeekStyle: DaysOfWeekStyle(
                        weekdayStyle: TextStyle(
                          fontSize: 14,
                          height: 1.6,
                          color: Colors.grey[800],
                        ),
                        weekendStyle: TextStyle(
                          fontSize: 14,
                          height: 1.6,
                          color: Colors.pink[400],
                        ),
                      ),
                      calendarStyle: CalendarStyle(
                        markerDecoration: BoxDecoration(
                          color: Colors.pink,
                          shape: BoxShape.circle,
                        ),
                        todayDecoration: BoxDecoration(
                          color: Colors.pink[100],
                          shape: BoxShape.circle,
                        ),
                        selectedDecoration: BoxDecoration(
                          color: Colors.pink[400],
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Expanded(
                    child: _selectedDay == null
                        ? const Center(child: Text('날짜를 선택 하세요.'))
                        : ListView(
                            children: _getEventsForDay(events, _selectedDay!).isEmpty
                                ? [const ListTile(title: Text('일정 없음'))]
                                : _getEventsForDay(events, _selectedDay!).map((event) {
                                    return ListTile(
                                      leading: const Icon(Icons.event),
                                      title: Text(event.title),
                                      subtitle: Text(
                                        '${DateFormat('HH:mm').format(event.startTime)} ~ ${DateFormat('HH:mm').format(event.endTime)}'
                                        '${event.description != null ? '\n${event.description}' : ''}',
                                      ),
                                      trailing: IconButton(
                                        icon: const Icon(Icons.delete, color: Colors.red),
                                        onPressed: () async {
                                          await _eventStore.deleteEvent(event.id);
                                        },
                                      ),
                                    );
                                  }).toList(),
                          ),
                  ),
                ],
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.pink,
        child: const Icon(Icons.add),
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
      title: const Text('일정 추가'),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              decoration: const InputDecoration(labelText: '제목'),
              validator: (v) => v == null || v.isEmpty ? '제목을 입력하세요' : null,
              onSaved: (v) => _title = v ?? '',
            ),
            TextFormField(
              decoration: const InputDecoration(labelText: '설명'),
              onSaved: (v) => _description = v ?? '',
            ),
            Row(
              children: [
                Expanded(
                  child: TextButton(
                    child: Text(_startTime == null
                        ? '시작 시간'
                        : _startTime!.format(context)),
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
                  child: TextButton(
                    child: Text(_endTime == null
                        ? '종료 시간'
                        : _endTime!.format(context)),
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
      actions: [
        TextButton(
          child: const Text('취소'),
          onPressed: () => Navigator.pop(context),
        ),
        ElevatedButton(
          child: const Text('추가'),
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
