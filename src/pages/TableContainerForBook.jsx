import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Pagination
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const BOOKS_PER_PAGE = 1;

const TableContainerForBook = ({ data, search, genre, status, setDeleteId }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const filteredBooks = data?.filter(
        (book) =>
            (book.title.toLowerCase().includes(search.toLowerCase()) ||
                book.author.toLowerCase().includes(search.toLowerCase())) &&
            (genre ? book.genre === genre : true) &&
            (status ? book.status === status : true)
    );

    const paginatedBooks = filteredBooks?.slice(
        (page - 1) * BOOKS_PER_PAGE,
        page * BOOKS_PER_PAGE
    );

    const totalPages = Math.ceil((filteredBooks?.length || 0) / BOOKS_PER_PAGE);

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Genre</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedBooks?.map((book) => (
                            <TableRow key={book._id}>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.genre}</TableCell>
                                <TableCell>{book.year}</TableCell>
                                <TableCell>{book.status}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => navigate(`/edit/${book._id}`)}><Edit /></IconButton>
                                    <IconButton onClick={() => setDeleteId(book._id)}><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="flex justify-center mt-4">
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, val) => setPage(val)}
                    color="primary"
                />
            </div>
        </>
    )
}

export default TableContainerForBook;