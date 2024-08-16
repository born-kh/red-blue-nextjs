import { models, model, Schema } from 'mongoose';

const FriendSchema: Schema = new Schema({
  username: String,
  photoUrl: String,
  name: String,
});

const FriendModel = models.Friend || model('Friend', FriendSchema);

export default FriendModel;
