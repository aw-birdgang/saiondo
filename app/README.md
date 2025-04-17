# build
````
fvm flutter pub run build_runner build
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
firebase deploy --only hosting
````