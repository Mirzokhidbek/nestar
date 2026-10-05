export enum Message {
	SOMETHING_WENT_WRONG = 'Error: Something went wrong!',
	NO_DATA_FOUND = 'No data is found!',
	CREATE_FAILED = 'Create is failed!',
	UPDATE_FAILED = 'Update is failed!',
	REMOVE_FAILED = 'Remove is failed!',
	UPLOAD_FAILED = 'Upload is failed!',
	BAD_REQUEST = 'Bad request!',

	USED_MEMBER_NICK_OR_PHONE = 'Already used member nick or phone!',
	NO_MEMBER_NICK = 'No member with that member nick!',
	BLOCKED_USER = 'You have been blocked, contact admin!',
	WRONG_PASSWORD = 'Wrong password, please try again!',
	NOT_AUTHENTICATED = 'You are not authenticated, please login first!',
	TOKEN_NOT_EXIST = 'Bearer token is not provided!',
	ONLY_SPECIFIC_ROLES_ALLOWED = 'Allowed only for members with specific role!',
	NOT_ALLOWED_REQUEST = 'Not allowed request!',
	PROVIDE_VALID_CHOICE = 'Please provide valid choice!',
}
