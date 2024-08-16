import { models, model, Schema } from 'mongoose';

const UserSchema: Schema = new Schema({
  userId: String,
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Friend',
    },
  ],
});

const UserModel = models.User || model('User', UserSchema);

export default UserModel;
