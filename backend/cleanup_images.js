const mongoose = require('mongoose');

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect('mongodb://localhost:27017/cinemaai');
  console.log('Connected.');

  // Sadece ihtiyacımız olan şemayı tanımlıyoruz, böylece db/index.js'i çağırmaya gerek kalmıyor
  const userSchema = new mongoose.Schema({
    avatar_url: String,
    banner_url: String
  }, { strict: false });
  
  const User = mongoose.model('User', userSchema);

  const users = await User.find({});
  let avatarCount = 0;
  let bannerCount = 0;

  for (const user of users) {
    let changed = false;
    if (user.avatar_url && user.avatar_url.startsWith('data:image/')) {
      user.avatar_url = '';
      avatarCount++;
      changed = true;
    }
    if (user.banner_url && user.banner_url.startsWith('data:image/')) {
      user.banner_url = '';
      bannerCount++;
      changed = true;
    }
    if (changed) {
      await user.save();
    }
  }

  console.log(`Cleaned up ${avatarCount} avatars and ${bannerCount} banners.`);
  await mongoose.disconnect();
  console.log('Disconnected.');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
