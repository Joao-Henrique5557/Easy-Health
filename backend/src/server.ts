import { app } from "./app";
import { env } from "./env";

app.listen(env.port, () => {
  console.log(`Easy Health API rodando em http://localhost:${env.port}`);
});
