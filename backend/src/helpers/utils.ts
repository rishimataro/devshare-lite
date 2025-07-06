import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? '10', 10);

export const hashPasswordHelper = async (plainPassword: string): Promise<string> => {
    try{
        return await bcrypt.hash(plainPassword, SALT_ROUNDS);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Failed to hash password');
    }
}