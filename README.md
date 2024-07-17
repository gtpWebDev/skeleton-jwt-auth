# dogami-app

An application including as yet to be confirmed uses related to the Dogami universe.
Developed in parallel with learning on the Odin Project nodjs module, initially covering:

- authentication

A step-by-step guide for the general project set-up is described below...

## Install the express-generator

It is assumed that the express generator has been installed globally. If not, do so:

```bash
$ npm install -g express-generator
```

## Create the express project and git repository

Create the express project, initialise the git repository locally, then add the repository to github...

### Option 1 - create the express project first:

Create the project with the projectname, from the general repo directory

```bash
 express projectname --view=ejs
```

In the directory, install the dependencies

```bash
 npm install
```

Add **gitignore** and remove node_modules and .env

```js
node_modules;
.env
```

Initialise the git repo, setting the name of the default branch.
Add and commit the new files.

```git
git init -b main
git add .
git commit -m "Initial commit"
```

Create the repository on github as usual, with no readme file or gitignore.
Then follow the instructions for
"…or push an existing repository from the command line"
which are more or less...

```bash
git remote add origin insertSSHhere
git branch -M main
git push -u origin main
```

A note: the default express files still use "var" syntax. Ideally these should be replaced with const or let as appropriate. This will presumably be tidied up with the next version.

## Install nodemon to enable live updates of the server

(If nodemon is installed globally, this is not necessary.)
Nodemon ensures that on any update to the server, it is refreshed.
Note though, a page refresh is still necessary to see any changes created by the server.

```bash
npm install --save-dev nodemon
```

## Add npm scripts for ease

Note the serverstart option enables console logging

```js
  "scripts": {
    "devstart": "nodemon ./bin/www",
    "serverstart": "DEBUG=projectname:* npm run devstart"
  },
```

## Bring the dependency versions up to date, and update them

**package.json**

```js
  "dependencies": {
    "cookie-parser": "^1.4.6",
    "debug": "^4.3.5",
    "express": "^4.19.2",
    "http-errors": "~2.0.0",
    "morgan": "^1.10.0",
    "ejs": "^3.1.10"
  },
```

```bash
npm install
```

## Install dotenv

Install dotenv for environment variable handling, in dev stage at least.

```bash
npm install dotenv
```

## Install Mongoose

Installing mongoose installs all its dependencies and the MongoDB database driver, but not MongoDB itself.

```bash
npm install mongoose
```

## Install Async Error Handler

express-async-handler is a simplifying library that gives a short hand for error catching, replacing a try catch structure which sends the error to the next middleware on error

express-ejs-layouts - update once know

```bash
npm install express-async-handler
npm install express-ejs-layouts
```

## Add directory structure

**models** directory for data models
**controllers** directory for controllers
(**views** and **routes** directories already exist)
**lib** for general utility functions
**constants** for constants with scalability

## Authentication

Install **express-session** to enable session management.
Install **connect-mongo** to enable the session information to be stored in a mongo db.
Install **passport** and **passport-local** to...
Install **crypto** to...

```bash
npm install express-session
npm install connect-mongo
npm install passport
npm install passport-local
npm install crypto
```

## Methodology Development

Design:

1. Skeleton page structure and high level function
2. Detailed Data structure
