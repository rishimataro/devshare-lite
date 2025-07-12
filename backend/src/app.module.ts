import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { User, UserSchema } from './modules/users/schemas/user.schema';
import { Post, PostSchema } from './modules/posts/schemas/post.schema';
import { Comment, CommentSchema } from './modules/comments/schemas/comment.schema';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

@Module({
    imports: [
        UsersModule,
        PostsModule,
        CommentsModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('MAILDEV_INCOMING_HOST'),
                    port: configService.get<number>('MAILDEV_INCOMING_PORT'),
                    // ignoreTLS: true,
                    secure: true,
                    auth: {
                        user: configService.get<string>('MAILDEV_INCOMING_USER'),
                        pass: configService.get<string>('MAILDEV_INCOMING_PASS'),
                    },
                },
                defaults: {
                    from: '"No Reply" <no-reply@localhost>',
                },
                // preview: true,
                template: {
                    dir: process.cwd() + '/src/mail/templates/',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule { }
