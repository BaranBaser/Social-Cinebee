const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cinemaai';

mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB baglantisi basarili.'))
.catch(err => console.error('MongoDB baglanti hatasi:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  bio: { type: String, default: '' },
  avatar_url: { type: String, default: '' },
  role: { type: String, default: 'user' },
  is_banned: { type: Boolean, default: false },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friend_requests: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    created_at: { type: Date, default: Date.now }
  }],
  created_at: { type: Date, default: Date.now }
});

const ratingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content_key: { type: String, required: true },
  content_title: String,
  content_poster: String,
  content_type: String,
  score: { type: Number, required: true, min: 1, max: 10 },
  created_at: { type: Date, default: Date.now }
});
ratingSchema.index({ user_id: 1, content_key: 1 }, { unique: true });
ratingSchema.index({ content_key: 1 });

const commentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content_key: { type: String, required: true },
  content_title: String,
  content_type: String,
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  body: { type: String, required: true },
  is_removed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});
commentSchema.index({ content_key: 1 });

const chatRoomSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  content_key: String,
  created_at: { type: Date, default: Date.now }
});

const roomMessageSchema = new mongoose.Schema({
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});
roomMessageSchema.index({ room_id: 1 });

const dmMessageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});
dmMessageSchema.index({ sender_id: 1, receiver_id: 1 });

const librarySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content_key: { type: String, required: true },
  content_title: String,
  content_poster: String,
  content_type: String,
  status: { type: String, default: 'watched' },
  created_at: { type: Date, default: Date.now }
});
librarySchema.index({ user_id: 1, content_key: 1 }, { unique: true });
librarySchema.index({ user_id: 1, status: 1 });

const contentCacheSchema = new mongoose.Schema({
  content_key: { type: String, unique: true, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  original_title: String,
  overview: String,
  poster: String,
  backdrop: String,
  rating: { type: Number, default: 0 },
  year: String,
  duration: Number,
  genres: String,
  status: String,
  number_of_seasons: Number,
  number_of_episodes: Number,
  mal_id: Number,
  tmdb_id: Number,
  source: { type: String, default: 'tmdb' },
  category: { type: String, default: 'popular' },
  synced_at: { type: Date, default: Date.now }
});
contentCacheSchema.index({ type: 1, category: 1 });
contentCacheSchema.index({ source: 1 });

const postSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content_key: String,
  content_type: String,
  content_title: String,
  content_poster: String,
  body: { type: String, default: '' },
  score: Number,
  status: String,
  created_at: { type: Date, default: Date.now }
});
postSchema.index({ user_id: 1 });
postSchema.index({ created_at: -1 });

const postLikeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  created_at: { type: Date, default: Date.now }
});
postLikeSchema.index({ user_id: 1, post_id: 1 }, { unique: true });
postLikeSchema.index({ post_id: 1 });

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true, enum: ['message', 'comment', 'like', 'friend_request', 'friend_accept'] },
  title: { type: String, required: true },
  body: { type: String, default: '' },
  link: { type: String, default: '' },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});
notificationSchema.index({ user_id: 1, is_read: 1 });
notificationSchema.index({ user_id: 1, created_at: -1 });

const postCommentSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});
postCommentSchema.index({ post_id: 1 });

const postVoteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  value: { type: Number, required: true, enum: [1, -1] },
  created_at: { type: Date, default: Date.now }
});
postVoteSchema.index({ user_id: 1, post_id: 1 }, { unique: true });
postVoteSchema.index({ post_id: 1 });

const User = mongoose.model('User', userSchema);
const Rating = mongoose.model('Rating', ratingSchema);
const Comment = mongoose.model('Comment', commentSchema);
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
const RoomMessage = mongoose.model('RoomMessage', roomMessageSchema);
const DmMessage = mongoose.model('DmMessage', dmMessageSchema);
const Library = mongoose.model('Library', librarySchema);
const ContentCache = mongoose.model('ContentCache', contentCacheSchema);
const Post = mongoose.model('Post', postSchema);
const PostLike = mongoose.model('PostLike', postLikeSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const PostComment = mongoose.model('PostComment', postCommentSchema);
const PostVote = mongoose.model('PostVote', postVoteSchema);

// Ensure General Chat Room and Admin
mongoose.connection.once('open', async () => {
  try {
    const generalRoom = await ChatRoom.findOne({ name: 'Genel Sohbet' });
    if (!generalRoom) {
      await ChatRoom.create({ name: 'Genel Sohbet' });
    }

    const email = process.env.ADMIN_EMAIL || 'admin@cinemaai.local';
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'Admin123!';

    const existingAdmin = await User.findOne({ email });
    if (!existingAdmin) {
      const hash = bcrypt.hashSync(password, 10);
      await User.create({ username, email, password_hash: hash, role: 'admin' });
      console.log(`Yonetici hesabi olusturuldu -> email: ${email} / sifre: ${password}`);
    }
  } catch (err) {
    console.error('Initial setup error:', err);
  }
});

module.exports = {
  mongoose,
  User,
  Rating,
  Comment,
  ChatRoom,
  RoomMessage,
  DmMessage,
  Library,
  ContentCache,
  Post,
  PostLike,
  Notification,
  PostComment,
  PostVote
};
