// src/admin/admin-auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminAuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async login({ email, password }: { email: string; password: string }) {
        const user = await this.userRepo.findOne({ where: { email } });
        console.log(user.role);

        if (!user || user.role !== 'Admin') {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const access_token = this.jwtService.sign({
            email: user.email,
            role: user.role,
        });

        return {
            access_token,
            role: user.role,
        };
    }
}
