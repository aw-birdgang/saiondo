import 'package:app/core/data/local/sembast/sembast_client.dart';
import 'package:app/data/local/constants/db_constants.dart';
import 'package:sembast/sembast.dart';

import '../../../domain/entry/chat.dart';

class ChatHistoryDataSource {
  final _chatHistoryStore = intMapStoreFactory.store(DBConstants.STORE_NAME);

  final SembastClient _sembastClient;

  ChatHistoryDataSource(this._sembastClient);

  // DB functions:--------------------------------------------------------------
  Future<int> insert(Chat chatHistory) async {
    return await _chatHistoryStore.add(_sembastClient.database, chatHistory.toMap());
  }

  Future<int> count() async {
    return await _chatHistoryStore.count(_sembastClient.database);
  }

  Future<List<Chat>> getAllSortedByFilter({List<Filter>? filters}) async {
    final finder = Finder(
        filter: filters != null ? Filter.and(filters) : null,
        sortOrders: [SortOrder(DBConstants.FIELD_ID)]);

    final recordSnapshots = await _chatHistoryStore.find(
      _sembastClient.database,
      finder: finder,
    );

    return recordSnapshots.map((snapshot) {
      final chatHistory = Chat.fromMap(snapshot.value);
      return chatHistory;
    }).toList();
  }

  Future deleteAll() async {
    await _chatHistoryStore.drop(
      _sembastClient.database,
    );
  }

}