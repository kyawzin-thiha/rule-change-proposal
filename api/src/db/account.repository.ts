import {Injectable} from '@nestjs/common';
import {PrismaService} from '../helper/prisma.service';
import {AccountDto} from '../types/data.dto';
import {ErrorDto} from '../types/error.dto';
import {Prisma} from '@prisma/client';

@Injectable()
export class AccountRepository {
    constructor(private readonly prisma: PrismaService) {
    }

    async create(name: string, username: string, password: string, profile: string): Promise<[AccountDto, ErrorDto]> {
        try {
            const account = await this.prisma.account.create({
                data: {
                    username,
                    password,
                    user: {
                        create: {
                            name,
                            profile
                        }
                    }
                }
            });

            return [account, null];
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                return [null, {message: 'Username already exists', status: 400}];
            }
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async get(idOrUsername: string): Promise<[AccountDto, ErrorDto]> {
        try {
            const account = await this.prisma.account.findFirst({
                where: {
                    OR: [
                        {
                            id: idOrUsername
                        },
                        {
                            username: idOrUsername
                        }
                    ]
                }
            });

            if (!account) {
                return [null, {message: 'Account not found', status: 404}];
            }

            return [account, null];
        } catch (error) {
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async update(id: string, username: string): Promise<ErrorDto> {
        try {
            await this.prisma.account.update({
                where: {
                    id
                },
                data: {
                    username
                }
            });
            return null;
        } catch (error) {
            return {message: 'Internal Server Error', status: 500};
        }
    }

    async delete(id: string): Promise<ErrorDto> {
        try {
            await this.prisma.account.delete({
                where: {
                    id
                }
            });
            return null;
        } catch (error) {
            return {message: 'Internal Server Error', status: 500};
        }
    }

}