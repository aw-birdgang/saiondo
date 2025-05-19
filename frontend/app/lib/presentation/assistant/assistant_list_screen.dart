import 'package:flutter/material.dart';

import '../../domain/entry/assistant/assistant.dart';

class AssistantListScreen extends StatelessWidget {
  final List<Assistant> assistants;
  final void Function(Assistant) onAssistantTap;

  const AssistantListScreen({required this.assistants, required this.onAssistantTap, super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: assistants.length,
      itemBuilder: (context, index) {
        final assistant = assistants[index];
        return ListTile(
          title: Text('Assistant: ${assistant.id.substring(0, 8)}'),
          subtitle: Text('Relationship: ${assistant.id}'),
          onTap: () => onAssistantTap(assistant),
        );
      },
    );
  }
}