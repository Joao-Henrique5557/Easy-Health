import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./env";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";
import { firstAidRouter } from "./modules/firstAid/firstAid.routes";
import { establishmentsRouter, specialtiesRouter } from "./modules/establishments/establishments.routes";
import { emergencyRouter } from "./modules/emergency/emergency.routes";
import { bookingsRouter } from "./modules/bookings/bookings.routes";
import { historyRouter } from "./modules/history/history.routes";
import { favoritesRouter } from "./modules/favorites/favorites.routes";
import { notificationsRouter } from "./modules/notifications/notifications.routes";
import { locationRouter } from "./modules/location/location.routes";
import { assistantRouter } from "./modules/assistant/assistant.routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin === "*" ? true : env.corsOrigin.split(",") }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Usado pelo Docker Compose (healthcheck do serviço) e para checar
// rapidamente se a API está de pé.
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Mapeamento 1:1 com a seção 21 do readme do projeto.
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/primeiros-socorros", firstAidRouter);
app.use("/api/estabelecimentos", establishmentsRouter);
app.use("/api/especialidades", specialtiesRouter);
app.use("/api/emergencia", emergencyRouter);
app.use("/api/agendamentos", bookingsRouter);
app.use("/api/historico", historyRouter);
app.use("/api/favoritos", favoritesRouter);
app.use("/api/notificacoes", notificationsRouter);
app.use("/api/localizacao", locationRouter);
app.use("/api/assistant", assistantRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
});

// Precisa vir por último — Express identifica middlewares de erro pela
// aridade de 4 parâmetros (err, req, res, next).
app.use(errorHandler);
