import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
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

const InventoryControl = ({ products, userId }) => {
  const [rows, setRows] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [newItem, setNewItem] = useState({ id: '', stock: '', expiryDate: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initialSelectedProducts = {};
    const initialRows = [];

    Object.keys(products).forEach(category => {
      products[category].forEach(product => {
        initialSelectedProducts[product.id] = product.purchased;
        initialRows.push({
          id: product.name,
          stock: product.quantity,
          expiryDate: product.expirationDate
        });
      });
    });

    setSelectedProducts(initialSelectedProducts);
    setRows(initialRows);
  }, [products]);

  const handleDelete = async () => {
    // 選択された行をフィルタリングして新しい行リストを作成
    const newRows = rows.filter((row) => !selectionModel.includes(row.id));
    setRows(newRows);
    setSelectionModel([]);

    const updatedProducts = { ...products };

    // 削除する商品のpurchasedをfalseに、stockを0に更新
    Object.keys(products).forEach(category => {
      products[category].forEach(product => {
        if (selectionModel.includes(product.name)) {
          product.purchased = false;
          product.quantity = 0;
        }
      });
    });

    // データベースを更新
    try {
      await updateDoc(doc(db, `userProductData/${userId}`), {
        products: updatedProducts
      });
      console.log("Products successfully updated!");
    } catch (error) {
      console.error("Error updating products: ", error);
    }
  };

  const handleUpdate = async () => {
    const updatedProducts = { ...products };

    // 行のデータを元にproductsを更新
    rows.forEach(row => {
      Object.keys(updatedProducts).forEach(category => {
        const productToUpdate = updatedProducts[category].find(product => product.name === row.id);
        if (productToUpdate) {
          productToUpdate.quantity = row.stock;
          productToUpdate.expirationDate = row.expiryDate;
        }
      });
    });

    // データベースを更新
    try {
      await updateDoc(doc(db, `userProductData/${userId}`), {
        products: updatedProducts
      });
      console.log("Products successfully updated!");
    } catch (error) {
      console.error("Error updating products: ", error);
    }
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
          setSelectionModel(newSelectionModel);
        }}
        onCellEditCommit={(params) => {
          const updatedRows = rows.map(row => {
            if (row.id === params.id) {
              return { ...row, [params.field]: params.value };
            }
            return row;
          });
          setRows(updatedRows);
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
          <Button variant="contained" color="primary" onClick={() => { /* handleAdd logic */ }}>
            追加
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            削除
          </Button>
          <Button variant="contained" color="success" onClick={handleUpdate}>
            更新
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default InventoryControl;
