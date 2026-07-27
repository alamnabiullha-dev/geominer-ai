import api from "./api";

export const sendChatMessage = (message, context) =>
  api.post("/chat", { message, context }).then((r) => r.data);
