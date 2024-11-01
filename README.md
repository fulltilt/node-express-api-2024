# Example Node/Express API

## Notes

- [App created following this video series](https://www.youtube.com/watch?v=LlUZMYhRhOQ)
- Before running server, run: 'docker compose up' to bring up MongoDB, Redis and RabbitMQ instances
- To connect to Mongo Compass with the Docker Compose settings, I was able to connect through mongodb://localhost:27017
- When creating a new user, you will have to manually update the user role to Moderator or Admin
- You need to log in to get a token to make certain requests
- To test log flow, create a new Participant
- To play with API calls, go to the 'test.http' file in the root directory (assumes you have HTTP Rest Client in VSCode)
- When you shut down the container, Mongo data is removed
- `docker compose up --build` (you can access everything on localhost:3000)

## Topics this app covers

- Node and Express
- Mongo
- Redis
- Middlewares
- Authentication
- RBAC
- Rate Limiting
- Validation
- Logging
- Health Checks
- Swagger API documentation
- Dockerizing App
