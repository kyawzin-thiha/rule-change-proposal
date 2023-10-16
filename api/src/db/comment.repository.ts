import {Injectable} from '@nestjs/common';
import {PrismaService} from '../helper/prisma.service';
import {CommentDto, CommentsDto} from '../types/data.dto';
import {ErrorDto} from '../types/error.dto';

@Injectable()
export class CommentRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(author: string, proposal: string, text: string): Promise<[CommentDto, ErrorDto]> {
        try {
            const comment = await this.prisma.comment.create({
                data: {
                    text,
                    author: {
                        connect: {
                            id: author
                        }
                    },
                    proposal: {
                        connect: {
                            id: proposal
                        }
                    }
                },
                include: {
                    author: true
                }
            });

            return [comment, null];
        } catch (error) {
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async getAll(proposal: string): Promise<[CommentsDto, ErrorDto]> {
        try {
            const comments = await this.prisma.comment.findMany({
                where: {
                    proposal: {
                        id: proposal
                    }
                },
                include: {
                    author: true
                }
            });

            return [comments, null];
        } catch (error) {
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async delete(id: string): Promise<ErrorDto> {
        try {
            await this.prisma.comment.delete({
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