import express from "express";
import dotenv from "dotenv";
import participants from "./controllers/participantController.js";
import movies from "./controllers/movieController.js";
import user from "./controllers/userController.js";
import { DB_NAME } from "./constants.js";
import connect from "./config/db.js";
import { removeHeaders } from "./middleware/moveResponseHeaders.js";
import { connectRabbitMQ } from "./config/rabbitMQ.js";
import uid from "tiny-uid";
import { logMsg } from "./lib/logProducer.js";
import { checkHealthStatus } from "./services/healthService.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./swagger.yml");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(removeHeaders);
app.use((req, res, next) => {
  req.logId = uid(7);
  next();
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/healthCheck", checkHealthStatus);

app.get("/ping", (req, res) => {
  const logId = req.logId ?? "";
  logMsg(logId, "inside ping method route handler", { test: "ping" });
  res.status(200).json({ message: "pong", logId: req.logId });
});

app.use("/participants", participants);
app.use("/movies", movies);
app.use("/auth", user);

await connect(DB_NAME);
await connectRabbitMQ();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
