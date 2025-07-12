import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from './../../helpers/utils';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private readonly mailerService: MailerService
    ) { }

    isEmailExist = async (email: string): Promise<boolean> => {
        const user = await this.userModel.exists({ email });
        if (user) {
            return true;
        }
        return false;
    }

    isUsernameExist = async (username: string): Promise<boolean> => {
        const user = await this.userModel.exists({ username });
        if (user) {
            return true;
        }
        return false;
    }

    async create(createUserDto: CreateUserDto) {
        const { username, email, password, role, isActive, profile } = createUserDto;

        // check email existence
        const emailExists = await this.isEmailExist(email);
        if (emailExists === true) {
            throw new BadRequestException(`Email ${email} đã được sử dụng bởi tài khoản khác. Vui lòng sử dụng email khác.`);
        }

        // check username existence
        const usernameExists = await this.isUsernameExist(username);
        if (usernameExists === true) {
            throw new BadRequestException(`Tên tài khoản: ${username} đã tồn tại. Vui lòng sử dụng tên tài khoản khác.`);
        }

        // hashPassword
        const hashPassword = await hashPasswordHelper(password);
        const newUser = await this.userModel.create({
            username,
            email,
            password: hashPassword,
            role: role || 'user',
            isActive: isActive || false,
            profile,
        });

        return {
            _id: newUser._id,
        };
    }

    async findAll(query: string, currentPage: number, pageSize: number) {
        const { filter, sort } = aqp(query);

        if (filter.currentPage) delete filter.currentPage;
        if (filter.pageSize) delete filter.pageSize;

        const totalItems = (await this.userModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const skip = (currentPage - 1) * pageSize;

        const results = await this.userModel
            .find(filter)
            .limit(pageSize)
            .skip(skip)
            .select('-password -__v')
            .sort(sort as any);

        return {
            results,
            totalItems,
            totalPages,
            currentPage,
            pageSize,
        };
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    async findByUserName(username: string) {
        const user = await this.userModel.findOne({ username });
        if (!user) {
            throw new BadRequestException(`Người dùng với username: ${username} không tồn tại.`);
        }
        return user;
    }

    async findByEmail(email: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new BadRequestException(`Người dùng với email: ${email} không tồn tại.`);
        }
        return user;
    }

    async findById(_id: string) {
        const user = await this.userModel.findOne({ _id });
        if (!user) {
            throw new BadRequestException(`Người dùng với _id: ${_id} không tồn tại.`);
        }
        return user;
    }

    async activateAccount(userId: string) {
        try {
            const result = await this.userModel.updateOne(
                { _id: userId },
                { 
                    isActive: true,
                    $unset: { codeId: 1, codeExpired: 1 }
                }
            );
            
            if (result.modifiedCount === 0) {
                throw new BadRequestException('Không thể kích hoạt tài khoản');
            }
            
            return result;
        } catch (error) {
            throw new BadRequestException('Đã xảy ra lỗi khi kích hoạt tài khoản: ' + error.message);
        }
    }

    async resendVerificationCode(userId: string) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new BadRequestException('Người dùng không tồn tại');
            }

            const codeId = uuidv4();
            const codeExpired = dayjs().add(5, 'minutes');

            await this.userModel.updateOne(
                { _id: userId },
                { 
                    codeId: codeId,
                    codeExpired: codeExpired.toDate()
                }
            );

            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Kích hoạt tài khoản DevShare',
                template: "verify-code-email",
                context: {
                    username: user.username ?? user.email,
                    verificationCode: codeId,
                    app_name: "DevShare",
                    name: "Nguyễn Thái Ngọc Thảo",
                    currentYear: new Date().getFullYear(),
                    address: "154 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng",
                    supportEmail: "support@devshare.com",
                    supportPhone: "0123456789",
                    expiration_minutes: 5
                }
            });

            return {
                message: 'Mã xác thực mới đã được gửi đến email của bạn'
            };
        } catch (error) {
            throw new BadRequestException('Đã xảy ra lỗi khi gửi lại mã xác thực: ' + error.message);
        }
    }

    async update(updateUserDto: UpdateUserDto) {
        try {
            return await this.userModel.updateOne(
                { _id: updateUserDto._id },
                { ...updateUserDto }
            )
        } catch (error) {
            throw new BadRequestException('Đã xảy ra lỗi khi cập nhật người dùng: ' + error.message);
        }
    }

    async remove(id: string) {
        // check if id is a valid ObjectId
        if (!mongoose.isValidObjectId(id)) {
            throw new BadRequestException('ID không hợp lệ');
        }

        // check if user exists
        const userExists = this.userModel.exists({ _id: id });
        if (!userExists) {
            throw new BadRequestException('Người dùng không tồn tại');
        }

        // remove user
        return this.userModel.deleteOne(
            { _id: id }
        )
    }

    async handleRegister(registerDto: CreateAuthDto) {
        if (!registerDto) {
            throw new BadRequestException('Dữ liệu đăng ký không hợp lệ');
        }

        const { username, email, password } = registerDto;

        if (!username || !email || !password) {
            throw new BadRequestException('Tên đăng nhập, email và mật khẩu là bắt buộc');
        }

        // check email existence
        const emailExists = await this.isEmailExist(email);
        if (emailExists === true) {
            throw new BadRequestException(`Email ${email} đã được sử dụng bởi tài khoản khác. Vui lòng sử dụng email khác.`);
        }

        // check username existence
        const usernameExists = await this.isUsernameExist(username);
        if (usernameExists === true) {
            throw new BadRequestException(`Tên tài khoản: ${username} đã tồn tại. Vui lòng sử dụng tên tài khoản khác.`);
        }

        // hashPassword
        const hashPassword = await hashPasswordHelper(password);
        const codeId = uuidv4();
        const newUser = await this.userModel.create({
            username,
            email,
            password: hashPassword,
            role: 'user',
            isActive: false,
            codeId: codeId,
            codeExpired: dayjs().add(5, 'minutes'),
        });

        // gửi email xác nhận đăng ký
        try{
            await this.mailerService
            .sendMail({
                to: newUser.email,
                subject: 'Kích hoạt tài khoản DevShare',
                template: "verify-code-email",
                context: {
                    username: newUser.username ?? newUser.email,
                    verificationCode: codeId,
                    app_name: "DevShare",
                    name: "Nguyễn Thái Ngọc Thảo",
                    currentYear: new Date().getFullYear(),
                    address: "154 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng",
                    supportEmail: "support@devshare.com",
                    supportPhone: "0123456789",
                    expiration_minutes: 5
                }
            })
        } catch (error) {
            throw new BadRequestException('Đã xảy ra lỗi khi gửi email xác nhận: ' + error.message);
        }

        // trả về thông tin người dùng đã đăng ký
        return {
            message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản.',
            _id: newUser._id
        }
    }

    async followUser(followerId: string, followingId: string) {
        if (followerId === followingId) {
            throw new BadRequestException('Bạn không thể follow chính mình');
        }

        const follower = await this.userModel.findById(followerId);
        const following = await this.userModel.findById(followingId);

        if (!follower || !following) {
            throw new BadRequestException('Người dùng không tồn tại');
        }

        // Kiểm tra xem đã follow chưa
        const isAlreadyFollowing = follower.following.includes(new mongoose.Types.ObjectId(followingId));
        if (isAlreadyFollowing) {
            throw new BadRequestException('Bạn đã follow người dùng này');
        }

        // Thêm vào danh sách following và followers
        follower.following.push(new mongoose.Types.ObjectId(followingId));
        following.followers.push(new mongoose.Types.ObjectId(followerId));

        await follower.save();
        await following.save();

        return {
            message: 'Follow thành công',
            followingCount: follower.following.length,
            followerCount: following.followers.length
        };
    }

    async unfollowUser(followerId: string, followingId: string) {
        if (followerId === followingId) {
            throw new BadRequestException('Bạn không thể unfollow chính mình');
        }

        const follower = await this.userModel.findById(followerId);
        const following = await this.userModel.findById(followingId);

        if (!follower || !following) {
            throw new BadRequestException('Người dùng không tồn tại');
        }

        // Kiểm tra xem có follow không
        const isFollowing = follower.following.includes(new mongoose.Types.ObjectId(followingId));
        if (!isFollowing) {
            throw new BadRequestException('Bạn chưa follow người dùng này');
        }

        // Xóa khỏi danh sách following và followers
        follower.following = follower.following.filter(id => id.toString() !== followingId);
        following.followers = following.followers.filter(id => id.toString() !== followerId);

        await follower.save();
        await following.save();

        return {
            message: 'Unfollow thành công',
            followingCount: follower.following.length,
            followerCount: following.followers.length
        };
    }

    async getUserProfile(identifier: string) {
        let user;
        
        // Kiểm tra xem identifier có phải là ObjectId không
        if (mongoose.isValidObjectId(identifier)) {
            user = await this.userModel
                .findById(identifier)
                .populate('following', 'username email profile')
                .populate('followers', 'username email profile')
                .select('-password -codeId -codeExpired')
                .exec();
        } else {
            // Nếu không phải ObjectId thì tìm theo username
            user = await this.userModel
                .findOne({ username: identifier })
                .populate('following', 'username email profile')
                .populate('followers', 'username email profile')
                .select('-password -codeId -codeExpired')
                .exec();
        }

        if (!user) {
            throw new BadRequestException('Người dùng không tồn tại');
        }

        return {
            ...user.toObject(),
            followingCount: user.following.length,
            followerCount: user.followers.length
        };
    }
}
