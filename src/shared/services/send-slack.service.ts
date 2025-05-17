import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiConfigService } from "./api-config.service";
import { SlackPayloadDto } from "../dtos/slack.dto";

@Injectable()
export class SendSlackService {
    constructor(
        @Inject('LOGGER_SERVICE') private readonly slackClient: ClientProxy,
        private readonly apiConfigSvc: ApiConfigService
    ) {}


    private push(payload: SlackPayloadDto) {
        try {
            this.slackClient.emit('slackLogger', payload)
        } catch (error) {
            console.log("===========================");
            console.log("Failed Sync Openbill")
            console.log("===========================");
            console.error('Failed to push Slack Info:', error);
            console.log("===========================");

        }
    }
    
    public async info(channel: string, title: string, body: string) {
        const payload: SlackPayloadDto = {
            channel: `#${channel}`,
            from: 'API-CORE',
            env: this.apiConfigSvc.nodeEnv,
            level: 'INFO',
            message: {
                title,
                body
            }
        }

        console.log("===========================");
        console.log("Slack Sync Openbill")
        console.log("===========================");
        console.log(payload);
        console.log("===========================");

        this.push(payload)
    }
}
