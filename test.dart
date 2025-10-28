import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'YourName\'s Comic Books',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: ComicListScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class Comic {
  final String title;
  final String category;
  final String description;
  final Color color;

  Comic({
    required this.title,
    required this.category,
    required this.description,
    required this.color,
  });
}

class ComicListScreen extends StatelessWidget {
  final List<Comic> comics = [
    Comic(
      title: 'Boku no Hero Academia',
      category: 'Manga',
      description:
          'Boku no Hero Academia adalah manga shōnen Jepang karya Kohei Horikoshi '
          'yang menceritakan tentang Izuku Midoriya, seorang anak tanpa kekuatan di dunia '
          'di mana hampir semua orang memilikinya. Ia kemudian bertemu All Might dan memulai '
          'perjalanan menjadi pahlawan.',
      color: Colors.yellow,
    ),
    Comic(
      title: 'Jujutsu Kaisen',
      category: 'Manga',
      description:
          'Jujutsu Kaisen adalah manga shōnen Jepang karya Gege Akutami. '
          'Bercerita tentang Yuji Itadori yang terlibat dalam dunia kutukan '
          'setelah menelan salah satu jari Ryomen Sukuna. Manga ini terbit di Weekly Shonen Jump '
          'sejak 2018 dan telah diadaptasi menjadi anime populer.',
      color: Colors.blue,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("YourName's Comic Books"),
        backgroundColor: Colors.blue,
      ),
      body: ListView.builder(
        itemCount: comics.length,
        itemBuilder: (context, index) {
          final comic = comics[index];
          return ListTile(
            leading: CircleAvatar(backgroundColor: comic.color),
            title: Text(
              comic.title,
              style: TextStyle(color: comic.color, fontWeight: FontWeight.bold),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ComicDetailScreen(comic: comic),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class ComicDetailScreen extends StatelessWidget {
  final Comic comic;

  ComicDetailScreen({required this.comic});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(comic.title), backgroundColor: comic.color),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              comic.title,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: comic.color,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              comic.category,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: SingleChildScrollView(
                child: Text(
                  comic.description,
                  style: const TextStyle(fontSize: 16),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Center(
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('KEMBALI'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
