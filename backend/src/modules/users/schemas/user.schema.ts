import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export type UserDocument = HydratedDocument<User> & {
    isCodeExpired(): boolean;
    isCodeValid(code: string): boolean;
};

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

    @ApiProperty({ description: 'Trạng thái kích hoạt tài khoản', default: false })
    @Prop({ default: false, index: true })
    isActive: boolean;

    @ApiProperty({ description: 'Mã xác thực tài khoản', required: false })
    @Prop({ type: String, sparse: true })
    codeId: string;

    @ApiProperty({ description: 'Thời gian hết hạn mã xác thực', required: false })
    @Prop({ type: Date, sparse: true })
    codeExpired: Date;

    // kiểm tra mã có hết hạn không
    isCodeExpired(): boolean {
        if (!this.codeExpired) return true;
        return new Date() > this.codeExpired;
    }

    // kiểm tra mã có hợp lệ không
    isCodeValid(code: string): boolean {
        return this.codeId === code && !this.isCodeExpired();
    }

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.isCodeExpired = function(): boolean {
    if (!this.codeExpired) return true;
    return new Date() > this.codeExpired;
};

UserSchema.methods.isCodeValid = function(code: string): boolean {
    return this.codeId === code && !this.isCodeExpired();
};

UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ codeId: 1, codeExpired: 1 });
