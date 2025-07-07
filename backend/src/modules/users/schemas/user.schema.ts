import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @ApiProperty()
    @Prop({ required: true, unique: true })
    username: string;

    @ApiProperty()
    @Prop({ required: true, unique: true })
    email: string;

    @Exclude()
    @Prop({ required: true })
    password: string;

    @ApiProperty({ enum: ['user', 'admin'], default: 'user' })
    @Prop({ type: String, enum: ['user', 'admin'], default: 'user' })
    role: string;

    @ApiProperty({ type: Boolean, required: false, default: true })
    @Prop({ type: Boolean, default: true })
    isActive?: boolean;

    @ApiProperty({ type: Object, required: false })
    @Prop({
        type: {
            bio: { type: String, default: '' },
            avatar: { type: String, default: '' },
        },
    })
    profile?: {
        bio: string;
        avatar: string;
    };

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
    updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
