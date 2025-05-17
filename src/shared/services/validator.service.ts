import { Injectable } from "@nestjs/common";

@Injectable()
export class ValidatorService {
    public isImage(mimeType: string): boolean {
        const imageMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/heic",
            "jpeg",
            "jpg",
            "png",
            "heic",
        ];

        return imageMimeTypes.includes(mimeType.toLowerCase());
    }
}
