import {Module} from '@nestjs/common';
import {HelperModule} from '../helper/helper.module';
import {AccountRepository} from './account.repository';
import {UserRepository} from './user.repository';
import {ProposalRepository} from './proposal.repository';
import {CommentRepository} from './comment.repository';

@Module({
    imports: [HelperModule],
    providers: [AccountRepository, UserRepository, ProposalRepository, CommentRepository],
    exports: [AccountRepository, UserRepository, ProposalRepository, CommentRepository]
})
export class DbModule {}
