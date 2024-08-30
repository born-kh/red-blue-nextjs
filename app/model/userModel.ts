import { models, model, Schema } from 'mongoose';

const UserSchema: Schema = new Schema({
  username: String,
  first_name: String,
  last_name: String,
  parent_id: Number,
  user_id: Number,
  active: Boolean,
});

const UserModel = models.User || model('User', UserSchema);

export default UserModel;
