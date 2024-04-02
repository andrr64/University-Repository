import {mongoose} from 'mongoose';

const _collectionName = 'books'; // Ini adalah nama koleksi yang akan dihubungkan ke aplikasi
const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
        },
        author: {
            type: String,
            require: true,
        },
        publishYear: {
            type: Number,
            required: true
        },
    },
    {
        timestamp: true,
    }
);

export const Book = mongoose.model(_collectionName, bookSchema);