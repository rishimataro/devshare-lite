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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
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

  async update(updateUserDto: UpdateUserDto) {
    try {
      return await this.userModel.updateOne(
        { _id: updateUserDto._id },
        {...updateUserDto }
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
    const newUser = await this.userModel.create({
      username,
      email,
      password: hashPassword,
      role: 'user',
      isActive: false,
      codeId: uuidv4(),
      codeExpired: dayjs().add(1, 'h'),
    });

    // trả về thông tin người dùng đã đăng ký
    return {
      _id: newUser._id,
    }

    // gửi email xác nhận đăng ký 
  
  }

  async verifyActivationCode(codeId: string): Promise<{ success: boolean; message: string; user?: any }> {
    const user = await this.userModel.findOne({ codeId });
    
    if (!user) {
      return {
        success: false,
        message: 'Mã xác thực không hợp lệ'
      };
    }

    if (user.isActive) {
      return {
        success: false,
        message: 'Tài khoản đã được kích hoạt trước đó'
      };
    }

    if (user.isCodeExpired()) {
      return {
        success: false,
        message: 'Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới'
      };
    }

    // Activate user account
    await this.userModel.updateOne(
      { _id: user._id },
      { 
        $set: { isActive: true },
        $unset: { codeId: "", codeExpired: "" }
      }
    );

    return {
      success: true,
      message: 'Kích hoạt tài khoản thành công',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    };
  }

  async resendActivationCode(email: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findOne({ email });
    
    if (!user) {
      return {
        success: false,
        message: 'Email không tồn tại trong hệ thống'
      };
    }

    if (user.isActive) {
      return {
        success: false,
        message: 'Tài khoản đã được kích hoạt'
      };
    }

    // Generate new code
    const newCodeId = uuidv4();
    const newCodeExpired = dayjs().add(1, 'h').toDate();

    await this.userModel.updateOne(
      { _id: user._id },
      {
        codeId: newCodeId,
        codeExpired: newCodeExpired
      }
    );

    return {
      success: true,
      message: 'Mã xác thực mới đã được gửi đến email của bạn'
    };
  }
}

