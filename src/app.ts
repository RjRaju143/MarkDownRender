import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import * as middlewares from "./middlewares.js";
import api from "./api/index.js";

const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(api);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
