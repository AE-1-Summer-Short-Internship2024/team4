import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// カラム定義を更新しました
const columns = [
  { field: 'id', headerName: '商品名', flex: 1 },
  { field: 'stock', headerName: '在庫数', flex: 1, editable: true },
  { field: 'expiryDate', headerName: '賞味期限', flex: 1, editable: true },
];

// 初期データ
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

  const handleDelete = () => {
    // 選択された行をフィルタリングして削除
    const newRows = rows.filter((row) => !selectionModel.includes(row.id));
    setRows(newRows);
    setSelectionModel([]);
  };

  const handleAdd = () => {
    if (newItem.id && newItem.stock && newItem.expiryDate) {
      setRows([...rows, { ...newItem, id: newItem.id }]);
      setNewItem({ id: '', stock: '', expiryDate: '' });
    }
  };

  const [newItem, setNewItem] = useState({ id: '', stock: '', expiryDate: '' });

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
        onSelectionModelChange={(newSelection) => {
          setSelectionModel(newSelection);
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
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
        <Button variant="contained" color="primary" onClick={handleAdd}>
          追加
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDelete}>
          削除
        </Button>
      </Box>
    </Box>
  );
}
