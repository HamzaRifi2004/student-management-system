const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Building Student Management System...\n');

try {
  // Build frontend
  console.log('📦 Building frontend...');
  process.chdir(path.join(__dirname, 'frontend'));
  execSync('npm install', { stdio: 'inherit' });
  execSync('npm run build', { stdio: 'inherit' });
  
  // Install backend dependencies
  console.log('\n📦 Installing backend dependencies...');
  process.chdir(path.join(__dirname, 'backend'));
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n✅ Build completed successfully!');
  console.log('\n🌐 Ready for deployment!');
  console.log('\nNext steps:');
  console.log('1. Push to GitHub');
  console.log('2. Deploy to Vercel/Netlify');
  console.log('3. Share the URL with your brother!');
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}