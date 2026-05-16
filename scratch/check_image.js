const sizeOf = require('image-size');
const path = require('path');
const file = path.join(process.cwd(), 'public', 'hdri-demo.jpg');
try {
    const dimensions = sizeOf(file);
    console.log(JSON.stringify(dimensions));
} catch (err) {
    console.error(err);
}
