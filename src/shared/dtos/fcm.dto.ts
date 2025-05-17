import type { ApplicationType } from "../../constants/application-type";
import type { FCMTemplates } from "../../constants/index";
import type { NotificationFcmBlastType } from "../../constants/notification-fcm-blast-type";

export class FcmMessageTemplate {}

export class INotification {
    title: string;
    body: string;
    imageUrl?: string | null;
}

class IData {
    title: string;
    body: string;
    type: FCMTemplates;
    click_action: string;
    payload: Record<string, unknown>;
}

export class FcmPayloadDto {
    recipients: string[];
    priority: "high" | "normal";
    timeToLive: number;
    notification: INotification;
    data?: IData;
}

export class FcmParamDTO {
    user_id: string;
    template: FCMTemplates;
    data: IData;
}

export class FcmBlastParamDTO {
    institute_id: string;
    app: ApplicationType;
    type: NotificationFcmBlastType;
    notification: INotification;
    data: IData;
    image: string;
    schedule?: Date | null;
}

export class FcmBlastTenantParamDTO {
    user_id: string;
    notification: INotification;
}


export class FcmBlastPayloadDto {
    recipients: string[];
    priority: "high" | "normal";
    timeToLive: number;
    notification: INotification;
    data?: IData;
    image?: string | null;
}
