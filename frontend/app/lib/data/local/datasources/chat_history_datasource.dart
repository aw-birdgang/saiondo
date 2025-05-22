import 'package:app/core/data/local/sembast/sembast_client.dart';
import 'package:app/data/local/constants/db_constants.dart';
import 'package:sembast/sembast.dart';

import '../../../domain/entry/chat_history.dart';

class ChatHistoryDataSource {
  final _chatHistoryStore = intMapStoreFactory.store(DBConstants.STORE_NAME);

  final SembastClient _sembastClient;

  ChatHistoryDataSource(this._sembastClient);

  // DB functions:--------------------------------------------------------------
  Future<int> insert(ChatHistory chatHistory) async {
    return await _chatHistoryStore.add(_sembastClient.database, chatHistory.toMap());
  }

  Future<int> count() async {
    return await _chatHistoryStore.count(_sembastClient.database);
  }

  Future<List<ChatHistory>> getAllSortedByFilter({List<Filter>? filters}) async {
    final finder = Finder(
        filter: filters != null ? Filter.and(filters) : null,
        sortOrders: [SortOrder(DBConstants.FIELD_ID)]);

    final recordSnapshots = await _chatHistoryStore.find(
      _sembastClient.database,
      finder: finder,
    );

    return recordSnapshots.map((snapshot) {
      final chatHistory = ChatHistory.fromMap(snapshot.value);
      // chatHistory.id = snapshot.key.toString();
      return chatHistory;
    }).toList();
  }

  // Future<FaqList> getFaqsFromDb() async {
  //   print('Loading from database');
  //
  //   var faqsList;
  //
  //   // fetching data
  //   final recordSnapshots = await _chatHistoryStore.find(
  //     _sembastClient.database,
  //   );
  //
  //   if(recordSnapshots.length > 0) {
  //     faqsList = FaqList(
  //         faqs: recordSnapshots.map((snapshot) {
  //           final faq = Faq.fromMap(snapshot.value);
  //           faq.faqIdx = snapshot.key.toString();
  //           return faq;
  //         }).toList());
  //   }
  //
  //   return faqsList;
  // }

  // Future<int> update(ChatHistory chatHistory) async {
  //   final finder = Finder(filter: Filter.byKey(faq.faqIdx));
  //   return await _chatHistoryStore.update(
  //     _sembastClient.database,
  //     faq.toMap(),
  //     finder: finder,
  //   );
  // }
  //
  // Future<int> delete(ChatHistory chatHistory) async {
  //   final finder = Finder(filter: Filter.byKey(faq.faqIdx));
  //   return await _chatHistoryStore.delete(
  //     _sembastClient.database,
  //     finder: finder,
  //   );
  // }

  Future deleteAll() async {
    await _chatHistoryStore.drop(
      _sembastClient.database,
    );
  }

}
