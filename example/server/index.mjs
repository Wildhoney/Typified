import path from 'path';
import express from 'express';

const app = express();
const example = path.resolve('./example');
const vendor = path.resolve('./src');
const media = path.resolve('./media');

app.use('/vendor', express.static(vendor));
app.use('/media', express.static(media));
app.use(express.static(example));
app.listen(process.env.PORT || 3000);
