import { models, model, Schema } from 'mongoose';

const FriendSchema: Schema = new Schema({
	username: String,
	first_name: String,
	last_name: String,
	photoUrl: String,
	name: String,
});

const FriendModel = models.Friend || model('Friend', FriendSchema);

export default FriendModel;
