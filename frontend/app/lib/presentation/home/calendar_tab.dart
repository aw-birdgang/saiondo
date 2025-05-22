import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';

class CalendarTab extends StatefulWidget {
  const CalendarTab({Key? key}) : super(key: key);

  @override
  State<CalendarTab> createState() => _CalendarTabState();
}

class _CalendarTabState extends State<CalendarTab> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  // 예시: 일정 데이터 (실제론 API에서 받아와야 함)
  final Map<DateTime, List<String>> _events = {
    DateTime.utc(2024, 6, 1): ['데이트', '운동'],
    DateTime.utc(2025, 5, 3): ['회의'],
    DateTime.utc(2025, 5, 5): ['영화관'],
  };

  List<String> _getEventsForDay(DateTime day) {
    return _events[DateTime.utc(day.year, day.month, day.day)] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          return Column(
            children: [
              TableCalendar(
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
                eventLoader: _getEventsForDay,
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
                  decoration: BoxDecoration(
                    // 요일 배경 등도 가능
                    // color: Colors.grey[100],
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
              SizedBox(height: 8),
              Expanded(
                child: _selectedDay == null
                    ? const Center(child: Text('날짜를 선택 하세요.'))
                    : ListView(
                        children: _getEventsForDay(_selectedDay!).isEmpty
                            ? [const ListTile(title: Text('일정 없음'))]
                            : _getEventsForDay(_selectedDay!).map((event) {
                                return ListTile(
                                  leading: const Icon(Icons.event),
                                  title: Text(event),
                                );
                              }).toList(),
                      ),
              ),
            ],
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.pink,
        child: const Icon(Icons.add),
        onPressed: () {
          // 일정 추가 다이얼로그 등 구현
        },
      ),
    );
  }
}
