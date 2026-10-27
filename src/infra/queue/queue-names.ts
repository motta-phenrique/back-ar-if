/**
 * Nome da fila que leva um comando (ligar/desligar) até o controlador da sala.
 * Fica isolado num arquivo porque é usado tanto por quem enfileira (o planner)
 * quanto por quem consome (o worker), e um typo entre os dois não daria erro de
 * compilação — só uma fila silenciosamente vazia.
 */
export const SCHEDULE_DISPATCH_QUEUE = "schedule-dispatch";
