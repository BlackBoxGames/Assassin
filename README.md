# Project Name

> Pithy project description

## Team

  - __Product Owner__: W1: Burk, Nathan
  - __Scrum Master__: W1: Nathan, David
  - __Producer__: W1: David, Burk

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Some usage instructions

## Requirements

- Node 7.7x
- MongoDB 9.1.x
- etc
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g yarn
yarn install / yarn (equivalent to npm install)

##Yarn cmds
-__Adding a dependency__-
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]

-__Upgrading a dependency__-
yarn upgrade [package]
yarn upgrade [package]@[version]
yarn upgrade [package]@[tag]

-__Removing a dependency__-
yarn remove [package]

```

To build the apk:

From within the client directory:
http://ionicframework.com/docs/v1/guide/publishing.html

```sh
cordova build --release android
*** Creates the unsigned apk ***

keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
*** Generates key for signing apk ***
### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)
If you have AAPT errors, try:

cordova platform remove android
cordova platform add android



## Contributing

See [CONTRIBUTING.md](CONTRIBUT