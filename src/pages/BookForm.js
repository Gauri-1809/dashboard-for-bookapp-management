import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField, Button, MenuItem, Paper, CircularProgress
} from "@mui/material";
import axios from "axios";
import { toast } from 'react-toastify';

const API_URL = "https://crudcrud.com/api/abbb4daa5d304216bd4aa40285f6cac7/books";

const BookForm = () => {
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`${API_URL}/${id}`).then((res) => {
        const fields = ["title", "author", "genre", "year", "status"];
        fields.forEach((field) => setValue(field, res.data[field]));
        setLoading(false);
      });
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await axios.put(`${API_URL}/${id}`, data);
        toast("Book updated successfully", { variant: "success" });
      } else {
        await axios.post(API_URL, data);
        toast("Book added successfully", { variant: "success" });
      }
      navigate("/");
    } catch (error) {
      toast("Operation failed", { variant: "error" });
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper className="p-4 max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Title" fullWidth margin="normal" {...register("title", { required: true })} error={!!errors.title} />
        <TextField label="Author" fullWidth margin="normal" {...register("author", { required: true })} error={!!errors.author} />
        <TextField label="Genre" fullWidth margin="normal" {...register("genre", { required: true })} error={!!errors.genre} />
        <TextField label="Published Year" type="number" fullWidth margin="normal" {...register("year", { required: true })} error={!!errors.year} />
        <TextField label="Status" select fullWidth margin="normal" defaultValue="Available" {...register("status", { required: true })}>
          <MenuItem value="Available">Available</MenuItem>
          <MenuItem value="Issued">Issued</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {id ? "Update" : "Save"}
        </Button>
      </form>
    </Paper>
  );
};

export default BookForm;
