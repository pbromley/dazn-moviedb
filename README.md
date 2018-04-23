# MovieDB UI

A small web application to provide a browser based user interface to the moviedb
The server is written in node using expressjs, the ui is written with Reactjs.

I have also used the client library https://github.com/cavestri/themoviedb-javascript-library for themoviedb as suggested (this is not included in my testing scope)


## Pre-requisites

Required node version is `8.11.1` is if you use nvm there is a .nvmrc file, just run the below at the root directory to install the correct version of node

```
nvm install
```

To setup up the project and its dependencies please run from the node directory

```
npm install
```

Now you can build and run the code

## Building the code

The project uses gulp to transpile the javascript and organise files.
If you have gulp installed you can run `gulp build` or if not

```
npm run-script build
```

## Tests and coverage

To run the tests and coverage use the below commands, this will run the tests and test coverage which provides a table showing how well the tests cover the source code

```
npm run-script test
npm run-script test-coverage
```

## Running the server

To run the built code, just run the following command in the node directory

```
nom run-script start
```