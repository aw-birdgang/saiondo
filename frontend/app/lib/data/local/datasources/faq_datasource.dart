import 'package:app/core/data/local/sembast/sembast_client.dart';
import 'package:app/data/local/constants/db_constants.dart';
import 'package:app/domain/entry/faq.dart';
import 'package:sembast/sembast.dart';

import '../../../domain/entry/faq_list.dart';

class FaqDataSource {
  final _faqsStore = intMapStoreFactory.store(DBConstants.STORE_NAME);

  final SembastClient _sembastClient;

  FaqDataSource(this._sembastClient);

  // DB functions:--------------------------------------------------------------
  Future<int> insert(Faq faq) async {
    return await _faqsStore.add(_sembastClient.database, faq.toMap());
  }

  Future<int> count() async {
    return await _faqsStore.count(_sembastClient.database);
  }

  Future<List<Faq>> getAllSortedByFilter({List<Filter>? filters}) async {
    final finder = Finder(
        filter: filters != null ? Filter.and(filters) : null,
        sortOrders: [SortOrder(DBConstants.FIELD_ID)]);

    final recordSnapshots = await _faqsStore.find(
      _sembastClient.database,
      finder: finder,
    );

    return recordSnapshots.map((snapshot) {
      final faq = Faq.fromMap(snapshot.value);
      faq.faqIdx = snapshot.key.toString();
      return faq;
    }).toList();
  }

  Future<FaqList> getFaqsFromDb() async {
    print('Loading from database');

    var faqsList;

    // fetching data
    final recordSnapshots = await _faqsStore.find(
      _sembastClient.database,
    );

    if(recordSnapshots.length > 0) {
      faqsList = FaqList(
          faqs: recordSnapshots.map((snapshot) {
            final faq = Faq.fromMap(snapshot.value);
            faq.faqIdx = snapshot.key.toString();
            return faq;
          }).toList());
    }

    return faqsList;
  }

  Future<int> update(Faq faq) async {
    final finder = Finder(filter: Filter.byKey(faq.faqIdx));
    return await _faqsStore.update(
      _sembastClient.database,
      faq.toMap(),
      finder: finder,
    );
  }

  Future<int> delete(Faq faq) async {
    final finder = Finder(filter: Filter.byKey(faq.faqIdx));
    return await _faqsStore.delete(
      _sembastClient.database,
      finder: finder,
    );
  }

  Future deleteAll() async {
    await _faqsStore.drop(
      _sembastClient.database,
    );
  }

}
