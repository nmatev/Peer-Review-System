# Peer Review System

Following these instructions you will be able to run this project on your local machine.

## Prerequisites

The technologies below must be installed in order to run this application:

#### Front End:

* Typescript
* Angular 7+
* Angular CLI

#### Back End:

* MySQL/MariaDB client
* NodeJS
* NPM
* NestJS
* Type ORM

## Installation

To run the project:

#### Back End:

* Create new DB schema - testdb - root // root
* Go to /api

```bash
npm install
npm run typeorm -- migration:generate -n initial
npm run typeorm -- migration:run
npm run seed
npm run start:dev
```
 
#### Front End:
Go to /client

```bash
npm install
ng s
```

#### Login with full access:

User: admin@abv.bg
Password: admin

## Home Page

![alt text](https://i.imgur.com/Ipm4F7M.png)

## License
[MIT](https://choosealicense.com/licenses/mit/)