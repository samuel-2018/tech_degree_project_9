# Project 9: REST API (Tech Degree)

## Description

This API provides for managing a school’s database of courses. After creating an account, users can create, modify and delete courses as well as view courses created by others.

Technologies used in this project include Node.js, Express, and Sequelize.

(This project utilized some provided boilerplate starter files. All files in the folder ‘seed’ were provided.)

## "Extra Credit" Features

- GET /api/users route and /api/courses route filter out uneeded properties.
- Only the owner of a course can modify or delete that course.
- Only valid, unique email addresses can be used to create a user account.
- User input is sanitized.

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install
```

Second, seed the SQLite database.

```
npm run seed
```

And lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).

You can also use [Postman](https://www.getpostman.com/) for testing, using the file `RESTAPI.postman_collection.json`. The database can be viewed using [DB Browser for SQLite](https://sqlitebrowser.org/).

## API Reference (HTTP METHOD Route)

Note: All course ids must be supplied via the URL parameter.

### Get currently authenticated user

`GET /api/users`

### Create a user account

`POST /api/users`

```
{
    "firstName": "John",
    "lastName": "Smith",
    "emailAddress": "john1@smith.com",
    "password": "password"
}
```

### Get all courses

`GET /api/courses`

### Get one course

`GET /api/courses/:id`

### Create a course

`POST /api/courses`

```
{
    "title": "New Course",
    "description": "My course description",
    "estimatedTime": “6 hours”,
    "estimatedTime": “* Notebook computer running Mac OS X or Windows * Text editor”,
}
```

### Update a course

`PUT /api/courses/:id`

```
{
    "title": "New Course Updated4 Again Hello",
    "description": "My course description. And again.",
    "estimatedTime": “6 hours”,
    "estimatedTime": “* Notebook computer running Mac OS X or Windows * Text editor”,
}
```

### Delete a course

`DELETE /api/courses/:id`
