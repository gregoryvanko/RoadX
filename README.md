# RoadX
A Node.js application for a hiking social network

## Installation
First, install the package using npm:
```bash
npm install @gregvanko/roadx --save
```

## Usage
Create a file "App.js" with this content:
```js
const Option = {
    Port:9000,
    Name:"RoadX",
    Debug: false,
    SplashScreenFilePath: __dirname + "/SplashScreen.html"
}
require('@gregvanko/roadx').Start(Option)
```

It is possible to start the application with default values (Port=9000, Name=NewApp, Debug=false, SplashScreenFilePath= default splach screen):
```js
require('@gregvanko/roadx').Start()
```

## Env variable
PORT and MONGOURL are available as env variables
