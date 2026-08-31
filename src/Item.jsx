import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function readError(response) {
  try {
    const data = await response.json();
    return data.message || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export default function Item() {
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newItemCategory, setNewItemCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const newItemName = useRef(null);
  const newItemPrice = useRef(null);
  const newItemAmount = useRef(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/item`);
      if (!response.ok) throw new Error(await readError(response));

      const data = await response.json();
      setItems(data.itemList || []);
    } catch (requestError) {
      setError(requestError.message || "Cannot connect to the backend API");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadItems, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadItems]);

  const closeDialog = () => {
    if (newItemName.current) newItemName.current.value = "";
    if (newItemPrice.current) newItemPrice.current.value = "";
    if (newItemAmount.current) newItemAmount.current.value = "";
    setNewItemCategory("");
    setOpenDialog(false);
  };

  const onAddItem = async () => {
    const newItem = {
      name: newItemName.current?.value.trim(),
      category: newItemCategory,
      price: newItemPrice.current?.value.trim(),
      amount: newItemAmount.current?.value.trim(),
    };

    if (!newItem.name || !newItem.category || !newItem.price || !newItem.amount) {
      setError("Please complete all item fields.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) throw new Error(await readError(response));
      closeDialog();
      await loadItems();
    } catch (requestError) {
      setError(requestError.message || "Cannot add item");
    } finally {
      setSaving(false);
    }
  };

  const onItemDelete = useCallback(
    async (rowId) => {
      if (!window.confirm("Soft delete this item?")) return;

      setError("");
      try {
        const response = await fetch(`${API_URL}/api/item/${rowId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error(await readError(response));
        await loadItems();
      } catch (requestError) {
        setError(requestError.message || "Cannot delete item");
      }
    },
    [loadItems],
  );

  const columns = useMemo(
    () => [
      { field: "name", headerName: "Name", flex: 3, minWidth: 160 },
      { field: "category", headerName: "Category", flex: 2, minWidth: 140 },
      { field: "price", headerName: "Price", flex: 1, minWidth: 100 },
      { field: "amount", headerName: "Amount", flex: 1, minWidth: 100 },
      {
        field: "actions",
        headerName: "",
        sortable: false,
        filterable: false,
        width: 70,
        renderCell: (params) => (
          <IconButton
            aria-label={`Delete ${params.row.name}`}
            color="error"
            onClick={() => onItemDelete(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        ),
      },
    ],
    [onItemDelete],
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <Typography variant="h5">Items</Typography>
          <Typography variant="body2" color="text.secondary">
            Connected to {API_URL}
          </Typography>
        </div>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Add Item
        </Button>
      </div>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <div className="min-h-96 rounded-lg bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-96 items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <DataGrid
            rows={items}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
          />
        )}
      </div>

      <Dialog open={openDialog} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 pt-2">
            <TextField required label="Item Name" inputRef={newItemName} />
            <FormControl fullWidth required>
              <InputLabel id="label-item-category">Item Category</InputLabel>
              <Select
                labelId="label-item-category"
                value={newItemCategory}
                label="Item Category"
                onChange={(event) => setNewItemCategory(event.target.value)}
              >
                <MenuItem value="Appliance">Appliance</MenuItem>
                <MenuItem value="Gadget">Gadget</MenuItem>
                <MenuItem value="Headphone">Headphone</MenuItem>
                <MenuItem value="Stationary">Stationary</MenuItem>
              </Select>
            </FormControl>
            <TextField required label="Price" inputRef={newItemPrice} />
            <TextField required label="Amount" inputRef={newItemAmount} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onAddItem} disabled={saving}>
            {saving ? "Adding..." : "Add Item"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
