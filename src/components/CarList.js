import React, { useState, useEffect } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import Snackbar from '@material-ui/core/Snackbar';

import AddCar from './AddCar';
import EditCar from './EditCar';

function CarList() {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  //function to open snackbar
  const openSnackbar = () => {
    setOpen(true);
  }

  const closeSnackbar = () => {
    setOpen(false);
  }

  //fetch car list
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    fetch('https://carstockrest.herokuapp.com/cars')
      .then((response) => response.json())
      .then((data) => setCars(data._embedded.cars))
      .catch((err) => console.error(err));
  };

  const deleteCar = (url) => {
    if (window.confirm("Are you sure?")) {
      fetch(url, { method: 'DELETE' })
        .then((response) => {
          if (response.ok) {
            openSnackbar();
            fetchCars();
          }
          else {
            alert("Something went wrong in deleting car!")
          };
        })
        .catch((err) => console.error(err));
    }
  };

  const addCar = (newCar) => {
    fetch('https://carstockrest.herokuapp.com/cars', {
        method: 'POST',
        body: JSON.stringify(newCar),
        headers: { 'Content-type': 'application/json' }
    })
    .then(response => {
        if (response.ok)
            fetchCars();
        else
            alert('Something went wrong in adding car!')
    })
    .catch(err => console.error(err))
  }

  const editCar = (url, updatedCar) => {
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(updatedCar),
      headers: { 'Content-type': 'application/json' }
    })
    .then(response => {
      if (response.ok)
        fetchCars();
      else 
        alert('Something went wrong in update!')
    })
    .catch(err => console.error(err))

  }

  const columns = [
    { field: "brand", sortable: true, filter: true },
    { field: "model", sortable: true, filter: true },
    { field: "color", sortable: true, filter: true },
    { field: "fuel", sortable: true, filter: true },
    { field: "year", sortable: true, filter: true, width: 100 },
    { field: "price", sortable: true, filter: true, width: 100 },
    {
      headerName: '',
      width: 100,
      field: '_links.self.href',
      cellRendererFramework: params => <EditCar editCar={editCar} link={params.value} car={params.data} />
    },
    {
      headerName: '',
      width: 100,
      field: '_links.self.href',
      cellRendererFramework: params => 
        <IconButton color="secondary" onClick={() => deleteCar(params.value)}>
          <DeleteIcon />
        </IconButton>
    },
  ];

  return (
    <div>
      <AddCar addCar={addCar} />
      <div
        className="ag-theme-material"
        style={{ height: 600, width: "90%", margin: "auto" }}
      >
        <AgGridReact
          rowData={cars}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
          suppressCellSelection={true}
        />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        message={message}
        onClose={closeSnackbar}
        />
    </div>
  );
}

export default CarList;
