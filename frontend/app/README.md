# build
````
fvm flutter build web

fvm flutter pub run build_runner build
fvm dart run build_runner build --delete-conflicting-outputs

````

## build for firebase hosting deploy
````
./build_web_env.sh
ex) flutter build web --dart-define=webApiKey=AIzaSyDxxxx --dart-define=webAppId=... ...
````

## build & run local
````
./run_web_with_env.sh
````

## deploy on firebase hosting
````
./build_web_env.sh
firebase deploy --only hosting
````


#
````
fvm flutter run -d chrome
````