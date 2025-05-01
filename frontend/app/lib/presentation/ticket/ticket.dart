import 'package:flutter/material.dart';

class AuthorList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    List<Quotes> quotesList = [];
    quotesList.add(Quotes(Colors.amber, 'Amelia Brown',
        'Life would be a great deal easier if dead things had the decency to remain dead.'));
    quotesList.add(Quotes(Colors.orange, 'Olivia Smith',
        'That proves you are unusual," returned the Scarecrow'));
    quotesList.add(Quotes(Colors.deepOrange, 'Sophia Jones',
        'Her name badge read: Hello! My name is DIE, DEMIGOD SCUM!'));
    quotesList.add(Quotes(Colors.red, 'Isabella Johnson',
        'I am about as intimidating as a butterfly.'));
    quotesList.add(Quotes(Colors.purple, 'Emily Taylor',
        'Never ask an elf for help; they might decide your better off dead, eh?'));
    quotesList
        .add(Quotes(Colors.green, 'Maya Thomas', 'Act first, explain later'));

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10),
      child: ListView.separated(
          scrollDirection: Axis.vertical,
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
          itemBuilder: (builder, index) {
            return LimitedBox(
              maxHeight: 150,
              child: Container(
                decoration: BoxDecoration(
                    color: quotesList[index].color,
                    borderRadius: const BorderRadius.all(
                      Radius.circular(10.0),
                    )),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.all(12),
                      child: Text(
                        quotesList[index].author,
                        style: const TextStyle(
                            fontFamily: 'BalsamiqSans_Blod',
                            fontSize: 30,
                            color: Colors.white),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(10),
                      child: Text(
                        quotesList[index].quote,
                        style: const TextStyle(
                            fontFamily: 'BalsamiqSans_Regular',
                            fontSize: 15,
                            color: Colors.white),
                      ),
                    )
                  ],
                ),
              ),
            );
          },
          separatorBuilder: (builder, index) {
            return const Divider(
              height: 10,
              thickness: 0,
            );
          },
          itemCount: quotesList.length),
    );
  }
}

class Quotes {
  final MaterialColor color;
  final String author;
  final String quote;

  Quotes(this.color, this.author, this.quote);
}