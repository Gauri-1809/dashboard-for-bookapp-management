import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField, Button, Select, MenuItem, CircularProgress, IconButton, Dialog,
    DialogTitle, DialogActions, Pagination
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const API_URL = "https://crudcrud.com/api/1d19bba067d24e9599e3b998cd416a7d/books";
const BOOKS_PER_PAGE = 4;

const fetchBooks = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};

const Home = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");
    const [status, setStatus] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery("books", fetchBooks);

    const deleteMutation = useMutation(
        (id) => axios.delete(`${API_URL}/${id}`),
        {
            onSuccess: () => {
                toast("Book deleted successfully");
                queryClient.invalidateQueries("books");
                setDeleteId(null);
            },
            onError: () => {
                toast("Error deleting book");
            },
        }
    );

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
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Book Dashboard</h2>
            <div className="mb-4 flex gap-2">
                <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                <Select value={genre} onChange={(e) => setGenre(e.target.value)} displayEmpty>
                    <MenuItem value="">All Genres</MenuItem>
                    <MenuItem value="Fiction">Fiction</MenuItem>
                    <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
                </Select>
                <Select value={status} onChange={(e) => setStatus(e.target.value)} displayEmpty>
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Issued">Issued</MenuItem>
                </Select>
                <Button variant="contained" color="primary" onClick={() => navigate("/add")}>Add Book</Button>
            </div>
            {isLoading ? (
                <CircularProgress />
            ) : (
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
            )}
            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle>Confirm Delete?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button onClick={() => deleteMutation.mutate(deleteId)} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Home;
