import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import {
    TextField, Button, Select, MenuItem, CircularProgress, Dialog,
    DialogTitle, DialogActions
} from "@mui/material";
import TableContainerForBook from "./TableContainerForBook";

const API_URL = "https://crudcrud.com/api/8822a86cba084d95b386d24d8a681eb3/books";

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
                <TableContainerForBook
                    data={data}
                    search={search}
                    genre={genre}
                    status={status}
                    setDeleteId={setDeleteId} />
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
