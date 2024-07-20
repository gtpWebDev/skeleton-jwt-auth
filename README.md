# skeleton-jwt-auth

A skeleton for a JSON web token strategy applied using passport.
Applies local strategy equivalent to generate salt and hash at registration
and check the password at login.
Then issues a JWT for the user, using private-public keys.
Currently set up to output JSON to a front-end application.

A step-by-step guide which would set-up much of the project is described below, but in using this template, none of the steps need to be carried out, other than:

1. npm install
2. create .env, the public and private keys, and add the db strings

## Install the express-generator

It is assumed that the express generator has been installed globally. If not, do so:

```bash
$ npm install -g express-generator
```

## Create the express project and git repository

Create the express project, initialise the git repository locally, then add the repository to github...

### Option 1 - create the express project first:

Create the project with the projectname, from the general repo directory
(Note, this supports the ejs web templates but its likely I won't use these)

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

## Setting up .env

Create **.env** and add the following environment variables:

```js
PORT = 3000;
NODE_ENV = "production";
DB_STRING_DEV = "";
DB_STRING_PROD = "";
RSA_PUBLIC_KEY = "";
RSA_PRIVATE_KEY = "";
```

The db strings should be the following format:

```bash
mongodb+srv://admin:<password>@cluster0.fcjfpao.mongodb.net/<database>?retryWrites=true&w=majority&appName=Cluster0
```

Then generate the public and private keys with the following command:

```bash
node lib/generateKeyPair
```

Then copy the keys generated in the lib subdirectory into .env, format:

```js
RSA_PUBLIC_KEY="-----BEGIN RSA PUBLIC KEY-----
MIICCgKCAgEApZ3krY0pIX+xGt0VryRqpdEWZaNJsgT5Ea8T/T4jGT85FasNJKRG
...
6V827vuqQ3uL38lxrYV6la1RQWwmxfYW4rjyVi9bn+mSNuuW4nAhNo0CAwEAAQ==
-----END RSA PUBLIC KEY-----"
```

**Don't forget to delete the generated .pem files!**

## Install Mongoose

Installing mongoose installs all its dependencies and the MongoDB database driver, but not MongoDB itself.

```bash
npm install mongoose
```

## Install cors

Allows requests to be carried out from other domain names - e.g. separate react front end.

```bash
npm install cors
```

## Install Async Error Handler

express-async-handler is a simplifying library that gives a short hand for error catching, replacing a try catch structure which sends the error to the next middleware on error

express-ejs-layouts - update once know

```bash
npm install express-async-handler
npm install express-ejs-layouts
```

## Add directory structure

1. **config** directory for database and passport configuration
2. **models** directory for data models
3. **controllers** directory for controllers
4. (**views** and **routes** directories already exist)
5. **lib** for general utility functions
6. **constants** for constants with scalability

## Authentication

Install **express-session** to enable session management.
Install **connect-mongo** to enable the session information to be stored in a mongo db.
Install **passport** and **passport-jwt** for the application of authenticaition using JWT
Install **crypto** to generate the salt and hash at registration, and to validate at login

```bash
npm install express-session
npm install connect-mongo
npm install passport
npm install passport-local
npm install crypto
```

Note, authentication content is substantial.
