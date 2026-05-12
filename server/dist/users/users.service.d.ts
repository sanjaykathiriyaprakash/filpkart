import { Repository, DeepPartial } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: DeepPartial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findOne(id: string): Promise<User | null>;
}
