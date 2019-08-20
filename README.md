# Project 9: REST API (Tech Degree)

## Description

This API provides for managing a school’s database of courses. After creating an account, users can create, modify and delete courses as well as view courses created by others.

Technologies used in this project include Node.js, Express, and Sequelize.

(This project utilized some provided boilerplate starter files. All files in the folder ‘seed’ were provided.)

## "Extra Credit" Features

- GET /api/users route and /api/courses route filter out unneeded properties.
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

## API Reference

Note: All course ids must be supplied via the route parameter.

### Get currently authenticated user
#### HTTP METHOD Route
`GET /api/users`
#### Response body
```
{
    "user": {
        "id": 1,
        "firstName": "Joe",
        "lastName": "Smith",
        "emailAddress": "joe@smith.com"
    }
}
```

---
### Create a user account
#### HTTP METHOD Route
`POST /api/users`
#### Request body
```
{
    "firstName": "John",
    "lastName": "Smith",
    "emailAddress": "john1@smith.com",
    "password": "password"
}
```

---
### Get all courses
#### HTTP METHOD Route
`GET /api/courses`

---
### Get one course
#### HTTP METHOD Route
`GET /api/courses/:id`

#### Response body
```
{
    id: 1,
    title: "Learn How to Program",
    description: "In this course, you'll learn how to write code like a pro!",
    estimatedTime: "6 hours",
    materialsNeeded: "* Notebook computer running Mac OS X or Windows * Text editor",
    userId: 2
}
```

---
### Create a course
#### HTTP METHOD Route
`POST /api/courses`
#### Request body
```
{
    "title": "New Course",
    "description": "My course description",
    "estimatedTime": “6 hours”,
    "materialsNeeded": “* Notebook computer running Mac OS X or Windows * Text editor”,
}
```

---
### Update a course
#### HTTP METHOD Route
`PUT /api/courses/:id`

#### Request body
```
{
    "title": "New Course Updated4 Again Hello",
    "description": "My course description. And again.",
    "estimatedTime": “6 hours”,
    "materialsNeeded": “* Notebook computer running Mac OS X or Windows * Text editor”,
}
```

---
### Delete a course
#### HTTP METHOD Route
`DELETE /api/courses/:id`
