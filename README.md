# Assignment 2

Github Link: https://github.com/rmit-fsd-2024-s1/s3937118-s3937114-a2

Member 1: Ravel Tanjaya S3937118

Member 2: Arvin Lee S3937114

# Structure

The application is structured in the following ways:

- /application: react frontend/main website
- /api: the rest api for the react frontend (Express + Sequelize)
- /admin-fe: the admin frontend (graphql) - HD
- /admin-graphql: the admin graphql backend - HD
- README.md: this readme.md
- ER Diagram.png: ER diagram for the database structure

## Starting the application server

As the whole project is made with Javascript, we can just change into the subproject directory and run:

```bash
npm run dev
# OR
bun run dev
```

## Implementation Detail

- Password hasing is done using bcrypt algorithm (which is one of the standard used to secure password).
- To make sure that there is no redundant data or unnormalized data in the database, Standard and Special Product is stored on the same database table (Product table), the difference is special product will have the discount value of more than 0.
- The review system is separated into review and thread. Review represent a review and rating that is being given by a user. Thread is the reply (or discussion) that is attached on the review.

### Delete Review

// TODO:

### Live Dashboard

// TODO:
