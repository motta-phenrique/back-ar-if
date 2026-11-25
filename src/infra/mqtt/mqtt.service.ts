import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { connect, IClientPublishOptions, MqttClient } from "mqtt";

@Injectable()
export class MqttService implements OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  readonly client: MqttClient;

  constructor(configService: ConfigService) {
    const url = configService.getOrThrow<string>("MQTT_URL");

    this.client = connect(url, {
      username: configService.get("MQTT_USERNAME"),
      password: configService.get("MQTT_PASSWORD"),
      reconnectPeriod: 2000,
    });

    this.client.on("connect", () => this.logger.log(`conectado em ${url}`));
    this.client.on("offline", () => this.logger.warn("broker offline"));
    this.client.on("error", (err) => this.logger.error(err.message));
  }

  /**
   * Falha na hora se o broker estiver fora. Sem isso o mqtt.js guarda a
   * mensagem na fila offline e a promise nunca resolve — o job do BullMQ
   * ficaria pendurado em vez de cair no retry.
   */
  async publish(
    topic: string,
    payload: string,
    opts: IClientPublishOptions = { qos: 1 },
  ): Promise<void> {
    if (!this.client.connected) {
      throw new Error("broker MQTT desconectado");
    }

    await this.client.publishAsync(topic, payload, opts);
  }

  onModuleDestroy() {
    return this.client.endAsync();
  }
}
