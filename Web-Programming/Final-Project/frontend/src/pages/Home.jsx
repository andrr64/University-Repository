import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from '../components/Spinner';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:5555/books')
            .then((response) => {
                console.log(response);
                setBooks(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3x1 my-8">Book Lists</h1>
                <Link to="/books/create">
                    <MdOutlineAddBox className="text-sky-800 text-4x1"/>
                </Link>
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <table className="w-full border-seperate border-spacing-2">
                    <thead>
                        <tr>
                            <th className="border border-slate-600 rounded-md">No</th>
                            <th className="border border-slate-600 rounded-md">Title</th>
                            <th className="border border-slate-600 rounded-md max-md:hidden">Author</th>
                            <th className="border border-slate-600 rounded-md max-md:hidden">Publish Year</th>
                            <th className="border border-slate-600 rounded-md">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book, index) => (
                            <tr key={book._id}>
                                <td className="border border-slate-600 rounded-md">{index + 1}</td>
                                <td className="border border-slate-600 rounded-md">{book.title}</td>
                                <td className="border border-slate-600 rounded-md max-md:hidden">{book.author}</td>
                                <td className="border border-slate-600 rounded-md max-md:hidden">{book.publishYear}</td>
                                <td className="border border-slate-600 rounded-md">
                                    <div className="flex justify-center gap-x-4">
                                        <Link to={`/books/detail/${book._id}`}>
                                            <BsInfoCircle className="text-2x1 text-green-800" />
                                        </Link>
                                        <Link to={`/books/edit/${book._id}`}>
                                            <AiOutlineEdit className="text-2x1 text-yellow-600" />
                                        </Link>
                                        <Link to={`/books/delete/${book._id}`}>
                                            <MdOutlineDelete className="text-2x1 text-red-600" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Home;
