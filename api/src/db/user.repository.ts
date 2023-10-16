import {Injectable} from '@nestjs/common';
import {PrismaService} from '../helper/prisma.service';
import {UserDto, UsersDto} from '../types/data.dto';
import {ErrorDto} from '../types/error.dto';
import {ROLE} from '@prisma/client';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(account: string, name: string, profile: string): Promise<[UserDto, ErrorDto]> {
        try {
            const user = await this.prisma.user.create({
                data: {
                    name,
                    profile,
                    account: {
                        connect: {
                            id: account
                        }
                    }
                }
            });
            return [user, null];
        } catch (error) {
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async get(id: string): Promise<[UserDto, ErrorDto]> {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    id
                }
            });
            if (!user) {
                return [null, {message: 'User not found', status: 404}];
            }
            return [user, null];
        } catch (error) {
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async getAll(): Promise<[UsersDto, ErrorDto]> {
        try {
            const users = await this.prisma.user.findMany({
                orderBy: {
                    name: 'asc'
                }
            });
            return [users, null];
        } catch (error) {
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async searchByRole(role: ROLE): Promise<[UsersDto, ErrorDto]> {
        try {
            const users = await this.prisma.user.findMany({
                where: {
                    role
                }
            });
            return [users, null];
        } catch (error) {
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async updateRole(id: string, role: ROLE): Promise<ErrorDto> {
        try {
            await this.prisma.user.update({
                where: {
                    id
                },
                data: {
                    role
                }
            });
            return null;
        } catch (error) {
            return {message: 'Internal Server Error', status: 500};
        }
    }
}