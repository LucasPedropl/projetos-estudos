import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: [
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
        credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
