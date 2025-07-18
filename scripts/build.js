const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Smart Dashboard Build Process...');

// Create dist directory
console.log('📁 Creating dist directory...');
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Files and directories to copy
const filesToCopy = ['index.html', 'css', 'js', 'assets', 'LICENSE', 'README.md'];

console.log('📋 Copying files to dist...');
filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
        const dest = path.join('dist', file);
        try {
            if (fs.statSync(file).isDirectory()) {
                // Copy directory recursively
                fs.cpSync(file, dest, { recursive: true });
                console.log(`✅ Copied directory: ${file}`);
            } else {
                // Copy file
                fs.copyFileSync(file, dest);
                console.log(`✅ Copied file: ${file}`);
            }
        } catch (error) {
            console.log(`⚠️  Could not copy ${file}: ${error.message}`);
        }
    } else {
        console.log(`⚠️  ${file} not found, skipping...`);
    }
});

// Create build info file
console.log('📝 Creating build info file...');
const buildInfo = `Build Date: ${new Date().toISOString()}
Commit: ${process.env.GITHUB_SHA || 'local'}
Node Version: ${process.version}
Platform: ${process.platform}`;

fs.writeFileSync('dist/BUILD_INFO.txt', buildInfo);

console.log('✅ Build completed successfully!');
console.log('📦 Files are ready in the dist/ directory');

// List contents of dist directory
console.log('\n📁 Contents of dist directory:');
try {
    const distContents = fs.readdirSync('dist');
    distContents.forEach(item => {
        const itemPath = path.join('dist', item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        console.log(`  ${isDirectory ? '📁' : '📄'} ${item}`);
    });
} catch (error) {
    console.log('Error listing dist contents:', error.message);
}
