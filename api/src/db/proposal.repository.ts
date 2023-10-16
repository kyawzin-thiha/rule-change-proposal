import {Injectable} from '@nestjs/common';
import {PrismaService} from '../helper/prisma.service';
import {ProposalDetailDto, ProposalDto, ProposalsDto} from '../types/data.dto';
import {ErrorDto} from '../types/error.dto';
import {STATUS} from '@prisma/client';

@Injectable()
export class ProposalRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(author: string, title: string, description: string): Promise<[ProposalDto, ErrorDto]> {
        try {
            const proposal = await this.prisma.proposal.create({
                data: {
                    title,
                    description,
                    author: {
                        connect: {
                            id: author
                        }
                    }
                },
                include: {
                    author: true,
                    comments: true
                }
            });

            return [proposal, null];
        } catch (error) {
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async get(id: string): Promise<[ProposalDetailDto, ErrorDto]> {
        try {
            const proposal = await this.prisma.proposal.findUnique({
                where: {
                    id
                },
                include: {
                    author: true,
                    comments: true,
                    likedBy: true
                }
            });

            if (!proposal) {
                return [null, {message: 'Proposal not found', status: 404}];
            }

            return [proposal, null];
        } catch (error) {
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async getAll(): Promise<[ProposalsDto, ErrorDto]> {
        try {
            const proposals = await this.prisma.proposal.findMany({
                orderBy: [
                    {
                        createdAt: 'desc'
                    },
                    {
                        likedBy: {
                            _count: 'desc'
                        }
                    }
                ],
                include: {
                    author: true,
                    comments: true
                }
            });

            return [proposals, null];
        } catch (error) {
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async getByStatus(status: STATUS): Promise<[ProposalsDto, ErrorDto]> {
        try {
            const proposals = await this.prisma.proposal.findMany({
                where: {
                    status
                },
                orderBy: [
                    {
                        createdAt: 'desc'
                    },
                    {
                        likedBy: {
                            _count: 'desc'
                        }
                    }
                ],
                include: {
                    author: true,
                    comments: true
                }
            });

            return [proposals, null];
        } catch (error) {
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async updateStatus(id: string, status: STATUS): Promise<ErrorDto> {
        try {
            await this.prisma.proposal.update({
                where: {
                    id
                },
                data: {
                    status
                }
            });

            return null;
        } catch (error) {
            return {message: 'Internal Server Error', status: 500};
        }
    }

    async delete(id: string): Promise<ErrorDto> {
        try {
            await this.prisma.proposal.delete({
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

