import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { isNil } from "lodash";

@Injectable()
export class ApiConfigService {
    constructor(private configService: ConfigService) {}

    get isDevelopment(): boolean {
        return this.nodeEnv === "development";
    }

    get isProduction(): boolean {
        return this.nodeEnv === "production";
    }

    get isTest(): boolean {
        return this.nodeEnv === "test";
    }

    private getNumber(key: string): number {
        const value = this.get(key);

        try {
            return Number(value);
        } catch {
            throw new Error(key + " environment variable is not a number");
        }
    }

    private getBoolean(key: string): boolean {
        const value = this.get(key);

        try {
            return Boolean(JSON.parse(value));
        } catch {
            throw new Error(key + " env var is not a boolean");
        }
    }

    private getString(key: string): string {
        const value = this.get(key);

        return value.replace(/\\n/g, "\n");
    }

    get nodeEnv(): string {
        return this.getString("NODE_ENV");
    }

    get fallbackLanguage(): string {
        return this.getString("FALLBACK_LANGUAGE");
    }

    get databaseConfig(): TypeOrmModuleOptions {
        const entities = [
            __dirname + "/../../modules/**/*.entity{.ts,.js}",
            __dirname + "/../../modules/**/*.view-entity{.ts,.js}",
        ];
        const migrations = [__dirname + "/../../database/migrations/*{.ts,.js}"];

        return {
            entities,
            migrations,
            type: "mysql",
            name: "default",
            host: this.getString("DB_HOST"),
            port: this.getNumber("DB_PORT"),
            username: this.getString("DB_USERNAME"),
            password: this.getString("DB_PASSWORD"),
            database: this.getString("DB_DATABASE"),
            migrationsRun: false,
            logging: this.getBoolean("ENABLE_ORM_LOGS"),
            synchronize: false,
        };
    }

    get awsS3Config() {
        return {
            accessKey: this.getString("AWS_S3_ACCESS_KEY_ID"),
            secretAccessKey: this.getString("AWS_S3_SECRET_ACCESS_KEY"),
            bucketRegion: this.getString("AWS_S3_BUCKET_REGION"),
            bucketApiVersion: this.getString("AWS_S3_API_VERSION"),
            bucketName: this.getString("AWS_S3_BUCKET_NAME"),
            bucketStorageURL: this.getString("AWS_S3_BUCKET_STORAGE_URL"),
        };
    }
    get chS3Config() {
        return {
            accessKey: this.getString("CH_S3_ACCESS_KEY_ID"),
            secretAccessKey: this.getString("CH_S3_SECRET_ACCESS_KEY"),
            bucketName: this.getString("CH_S3_BUCKET_NAME"),
            bucketStorageURL: this.getString("CH_S3_BUCKET_STORAGE_URL"),
        };
    }

    get documentationEnabled(): boolean {
        return this.getBoolean("ENABLE_DOCUMENTATION");
    }

    get natsEnabled(): boolean {
        return this.getBoolean("NATS_ENABLED");
    }

    get natsConfig() {
        return {
            host: this.getString("NATS_HOST"),
            port: this.getNumber("NATS_PORT"),
        };
    }

    get rmqEnabled(): boolean {
        return this.getBoolean("RMQ_ENABLED");
    }

    get rmqConfig() {
        return {
            host: this.getString("RMQ_HOST"),
            port: this.getNumber("RMQ_PORT"),
            user: this.getString("RMQ_USER"),
            pass: this.getString("RMQ_PASS"),
        };
    }

    get redisConfig() {
        return {
            host: this.getString("REDIS_HOST"),
            port: this.getNumber("REDIS_PORT"),
            cache_ttl: this.getNumber("CACHE_TTL"),
        };
    }

    get authConfig() {
        return {
            privateKey: this.getString("JWT_PRIVATE_KEY"),
            publicKey: this.getString("JWT_PUBLIC_KEY"),
            jwtExpirationTime: this.getString("JWT_EXPIRATION_TIME"),
        };
    }

    get authLumenConfig() {
        return {
            publicKey: this.getString("JWT_PUBLIC_KEY_LUMEN"),
        };
    }

    get appConfig() {
        return {
            port: this.getString("PORT"),
            apiKey: this.getString("API_KEY"),
        };
    }

    private get(key: string): string {
        const value = this.configService.get<string>(key);

        if (isNil(value)) {
            throw new Error(key + " environment variable does not set"); // probably we should call process.exit() too to avoid locking the service
        }

        return value;
    }

    getPaymentSuccessRedirectUrl(instituteSlug: string): string {
        const url = this.getString("APP_MENU_URL");

        return `${url}/${instituteSlug}/topup/success`;
    }

    get otplessConfig() {
        return {
            client_id: this.getString("OTPLESS_CLIENT_ID"),
            client_secret: this.getString("OTPLESS_CLIENT_SECRET"),
        };
    }

    get passportConfig() {
        return {
            login_endpoint: this.getString("PASSPORT_LOGIN_ENDPOINT"),
            client_id: this.getString("PASSPORT_CLIENT_ID"),
            client_secret: this.getString("PASSPORT_CLIENT_SECRET"),
            default_password: this.getString("DEFAULT_PASSWORD"),
        };
    }
}
