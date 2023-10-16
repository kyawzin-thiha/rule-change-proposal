import {Account, Comment, Proposal, User} from '@prisma/client';

export type AccountDto = Account | null;
export type AccountDetailDto = Account & { user: User } | null;
export type AccountDetailsDto = (Account & { user: User })[] | null;

export type UserDto = User | null;
export type UsersDto = User[] | null;

export type ProposalDto = Proposal & { comments: Comment[], author: User } | null;
export type ProposalDetailDto = Proposal & { comments: Comment[], author: User, likedBy: User[] } | null;
export type ProposalsDto = (Proposal & { comments: Comment[], author: User })[] | null;

export type CommentDto = Comment & { author: User } | null;
export type CommentsDto = (Comment & { author: User })[] | null;