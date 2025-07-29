import 'flavor_config.dart';
import 'main.dart' as app_main;

void main() {
  FlavorConfig(
    flavor: Flavor.prod,
    name: "PROD",
  );
  app_main.main();
}
