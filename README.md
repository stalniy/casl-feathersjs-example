# Example of CASL integration in Feathersjs app

Read [CASL in Feathersjs app][casl-feathers-example] for details.

[CASL](https://stalniy.github.io/casl/) is an isomorphic authorization JavaScript library which restricts what resources a given user is allowed to access.

This is an example application which shows how to integrate CASL in blog application. There are 3 entities:
* User
* Post
* Comment

Application uses `jwt` tokens for authentication.
Permission logic (i.e., abilities) are define in `src/hooks/abilities.js`. Rules can be specified for authenticated and anonymous users, so potentially it's quite easy to give access anonymous users to leave comments in blog.

**Note**: refactored to use CASL 2.0. See [@casl/ability][casl-ability] and [@casl/mongoose][casl-mongoose] for details.

## Installation

```sh
git@github.com:stalniy/casl-feathersjs-example.git
cd casl-feathersjs-example
npm install
npm start # `npm run dev` to run in dev mode
```

Also you need mongodb database up and running. Application will connect to `mongodb://localhost:27017/blog`.
You can import few posts and users from `./db` folder:

```sh
mongorestore ./db
```


## Instruction to login

1. Create new user (if you haven't imported documents from `./db`)

```
POST http://localhost:3030/users
{
  "email": "casl@medium.com",
  "password": "password"
}
```

2. Create new session

```
POST http://localhost:3030/authentication
{
  "strategy": "local",
  "email": "casl@medium.com",
  "password": "password"
}

201 Created
{ "accessToken": "...." }
```

3. Put access token in `Authorization` header for all future requests


## Routes

* /posts
* /comments?post=<post id>
* /users
* /authentication

[casl-feathers-example]: https://medium.com/@sergiy.stotskiy/authorization-with-casl-in-feathersjs-app-fd6e24eefbff
[casl-ability]: https://github.com/stalniy/casl/tree/master/packages/casl-ability
[casl-mongoose]: https://github.com/stalniy/casl/tree/master/packages/casl-mongoose

