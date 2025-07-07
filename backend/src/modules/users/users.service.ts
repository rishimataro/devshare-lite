import { BadRequestException, Injectable, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from './../../helpers/utils';
import { isEmail } from 'class-validator';
import aqp from 'api-query-params';

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
    const { username, email, password, role, profile } = createUserDto;

    // check email existence
    const emailExists = await this.isEmailExist(email);
    if (emailExists === true) {
      throw new BadRequestException(`Email: ${email} đã tồn tại. Vui lòng sử dụng email khác.`);
    }

    // check username existence
    const usernameExists = await this.isUsernameExist(username);
    if (usernameExists === true) {
      throw new BadRequestException(`Username: ${username} đã tồn tại. Vui lòng sử dụng username khác.`);
    }

    // hashPassword
    const hashPassword = await hashPasswordHelper(password);
    const newUser = await this.userModel.create({
      username,
      email,
      password: hashPassword,
      role: role || 'user',
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

