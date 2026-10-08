import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from './Member.model';
import PropertySchema from './Property.model';
import BoardArticleSchema from './BoardArticle.model';
import CommentSchema from './Comment.model';
import FollowSchema from './Follow.model';
import LikeSchema from './Like.model';
import NoticeSchema from './Notice.model';
import NotificationSchema from './Notification.model';
import ViewSchema from './View.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Member', schema: MemberSchema },
			{ name: 'Property', schema: PropertySchema },
			{ name: 'BoardArticle', schema: BoardArticleSchema },
			{ name: 'Comment', schema: CommentSchema },
			{ name: 'Follow', schema: FollowSchema },
			{ name: 'Like', schema: LikeSchema },
			{ name: 'Notice', schema: NoticeSchema },
			{ name: 'Notification', schema: NotificationSchema },
			{ name: 'View', schema: ViewSchema },
		]),
	],
	exports: [MongooseModule],
})
export class SchemaModule {}
