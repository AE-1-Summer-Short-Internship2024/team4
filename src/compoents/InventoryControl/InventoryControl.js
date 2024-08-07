import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const columns = [
  { field: 'id', headerName: '商品名', flex: 1 },
  { field: 'stock', headerName: '在庫数', flex: 1, editable: true },
  { field: 'expiryDate', headerName: '賞味期限', flex: 1, editable: true },
];

const initialRows = [
  { id: '水2L', stock: 10, expiryDate: '2024-12-01' },
  { id: '缶詰', stock: 15, expiryDate: '2025-06-15' },
  { id: 'インスタントラーメン', stock: 20, expiryDate: '2023-11-10' },
  { id: '乾燥野菜', stock: 5, expiryDate: '2023-09-05' },
  { id: '非常食ビスケット', stock: 30, expiryDate: '2024-03-20' },
  { id: 'ミネラルウォーター500ml', stock: 50, expiryDate: '2023-12-31' },
  { id: 'アルファ米', stock: 25, expiryDate: '2024-05-10' },
  { id: 'カロリーメイト', stock: 40, expiryDate: '2023-10-15' },
  { id: '栄養ドリンク', stock: 35, expiryDate: '2023-08-20' },
];

export default function DataGridDemo() {
  const [rows, setRows] = useState(initialRows);
  const [selectionModel, setSelectionModel] = useState([]);
  const [newItem, setNewItem] = useState({ id: '', stock: '', expiryDate: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = () => {
    const newRows = rows.filter((row) => !selectionModel.includes(row.id));
    setRows(newRows);
    setSelectionModel([]);
  };

  const handleAdd = () => {
    if (newItem.id && newItem.stock && newItem.expiryDate) {
      setRows([...rows, { id: newItem.id, stock: newItem.stock, expiryDate: newItem.expiryDate }]);
      setNewItem({ id: '', stock: '', expiryDate: '' });
      setErrorMessage('');
    } else {
      setErrorMessage('データを全て入力してください');
    }
  };

  const getSelectedItems = () => {
    return rows.filter((row) => selectionModel.includes(row.id)).map((row) => row.id);
  };

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: 'expiryDate', sort: 'asc' }],
          },
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
        }}
        pageSizeOptions={[50]}
        checkboxSelection
        disableRowSelectionOnClick
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel.map((id) => String(id))); 
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
          <TextField
            label="商品名"
            value={newItem.id}
            onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
          />
          <TextField
            label="在庫数"
            value={newItem.stock}
            onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
            type="number"
          />
          <TextField
            label="賞味期限"
            value={newItem.expiryDate}
            onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        {errorMessage && (
          <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            追加
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            削除
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
