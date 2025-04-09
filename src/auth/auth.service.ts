// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(body: any) {
        const { name, email, password, role } = body;
        const userExists = await this.userRepo.findOne({ where: { email } });
        if (userExists) {
            return { error: 'user already exist' };
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = this.userRepo.create({
            name,
            email,
            password: hashed,
            role,
        });

        await this.userRepo.save(newUser);
        return { statusText: 'User registered successfully' };
    }

    async login(body: any) {
        const { email, password } = body;
        const user = await this.userRepo.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return { error: 'email or password wrong' };
        }

        const token = this.jwtService.sign({
            email: user.email,
            role: user.role,
        });

        return {
            access_token: token,
            statusText: 'Login success',
        };
    }
}
