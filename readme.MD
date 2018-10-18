# Zupi - A NodeJS API 🚀

This project contains a NodeJS API using the followed technologies:

* 🔥 [`node`](https://nodejs.org/) - as web server
* 💨 [`express`](https://expressjs.com/) - the web framework
* 🎲 [`mongoose`](https://mongoosejs.com/) - a odm to interact with [`mongodb`](https://www.mongodb.com/)
* 🔑 [`jwt`](https://jwt.io/) - for authentication
* ⚗️ [`jest`](https://jestjs.io) - for automated testing
* 💪 [`supertest`](https://github.com/visionmedia/supertest) - for integration testing

## How to execute

To execute this project on your machine you'll need to follow the steps bellow.

### 1: Pre requisites

 * `node` and `npm` must be previously installed
 * you'll also need of the `mongodb` installed and running

### 2. Clone this repository

In order to execute this project, you'll need a copy of his files. Clone this repository to get all project files.

### 3. Set the environment variables

Copy the `.env.example` file, paste at the root project folder and rename it to `.env` and fill the **all** the asked fields.

### 4. Run automated tests

Open a terminal at the root project folder and run:

* `npm run test:unit` - for unit tests
* `npm run test:integration` - for integration tests
* `npm run test` - for all tests

### 5. Run the application

Open a terminal at the root project folder and run: `npm run dev`

## How to use

You can use a toll like [`postman`](https://www.getpostman.com/) or [`insomnia`](https://insomnia.rest/download/) to test the resources of this `api`. Make sure the server is running. Listed bellow are some resources avaliables.

***

* **POST** `/signin` - Return a token for use in private routes
* **POST** `/signout` - Return a token with `null` value

***

* **GET** `/users` - List all users
* **POST** `/users` - Create a new user
* **GET** `users/:id` - Retrive a user
* **PUT** `users/:id` - Update a user
* **DELETE** `users/:id` - Remove a user

***

* **GET** `/properties` - List all properties
* **POST** `/properties` - Create a new property
* **GET** `properties/:id` - Retrive a property
* **PUT** `properties/:id` - Update a property
* **DELETE** `properties/:id` - Remove a property

***

### Private routes

Except for `/signin` and `/signout`, all routes needs an authentication token. To get this is necessary make a request in `/signin` route passing in the body of the request a previusly registred `email` and `password`, and the response will be return a token. Use it in `x-access-token` *header* in next requests.

## Online example

Make a **POST** request at ` https://zupi.herokuapp.com/signin` passing in the body of the request the following JSON:

```JSON
{
  "email": "guest@email.com",
  "password": "barney"
}
```

The response will be something like this

```JSON
{
	"token": "eyJhbGciOiJIUzI1NiIsnR5cCI6IkpXVCJ9.eyJpZCI6IjViYTQwMD5N2I3YzU3MDAxNWRlMDYxNCIsImlhdCI6MTUzNzQ3NzkyNiwiZXhwIjoxNTM3NTY0Mz2fQ.7vTYl0R6zftTNVqjTJXgYRh2y4CDNndMCrTVpo6agU"
}
```

Explore others routes as described in the step **How to execute**.
