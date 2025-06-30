import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { TagsModule } from './modules/tags/tags.module';
import { CommentsModule } from './modules/comments/comments.module';
import { User, UserSchema } from './modules/users/schemas/user.schema';
import { Post, PostSchema } from './modules/posts/schemas/post.schema';
import { Tag, TagSchema } from './modules/tags/schemas/tag.schema';
import { Comment, CommentSchema } from './modules/comments/schemas/comment.schema';

@Module({
    imports: [
        UsersModule,
        PostsModule,
        TagsModule,
        CommentsModule,
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
        MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
