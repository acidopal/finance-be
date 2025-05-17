export class SlackPayloadDto {
    channel: string;
    from: string;
    env: string;
    level: string;
    message: SlackPayloadMessageDto;
}

class SlackPayloadMessageDto {
    title: string;
    body: string;
}