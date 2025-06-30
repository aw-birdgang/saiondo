import 'flavor_config.dart';
import 'main.dart' as app_main;

void main() {
  FlavorConfig(
    flavor: Flavor.dev,
    name: "DEV",
  );
  app_main.main();
}