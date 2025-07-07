import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? '10', 10);

export const hashPasswordHelper = async (plainPassword: string): Promise<string> => {
    try{
        return await bcrypt.hash(plainPassword, SALT_ROUNDS);
    } catch (error) {
        console.error('Lỗi mã hóa mật khẩu:', error);
        throw new Error('Lỗi khi mã hóa mật khẩu');
    }
}

export const comparePasswordHelper = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        console.error('Lỗi so sánh mật khẩu:', error);
        throw new Error('Lỗi khi so sánh mật khẩu');
    }
}