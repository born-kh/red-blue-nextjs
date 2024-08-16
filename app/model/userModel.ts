import { models, model, Schema } from 'mongoose';

const UserSchema: Schema = new Schema({
	username: String,
	first_name: String,
	last_name: String,
	photo_url: String,
	parent_id: Number,
	chat_id: Number,
});

const UserModel = models.User || model('User', UserSchema);

export default UserModel;
