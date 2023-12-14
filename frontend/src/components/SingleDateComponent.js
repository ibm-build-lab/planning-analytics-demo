import React, { Component } from "react";
import {
  Content,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Select,
  TextInput,
  SelectItem
} from "@carbon/react";

class SingleDateComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        formData: {
          cubeName: 'smartfren_cube',
          orderDate: '01/02/2023',
          outletCode: 'OUTLETBKS1',
          productCode: 'PRODUCTA1',
        },
        outlets: ["OUTLETBKS1", "OUTLETBKS2", "OUTLETBKS3", "OUTLETBKS4"],
        products: ["PRODUCTA1", "PRODUCTA2","PRODUCTB1","PRODUCTB2","PRODUCTC0"],
        rows:[
          {
            srcExistingQty: 800,
            qtyToTransfer: 0,
            destExistingQty: 400,
            srcAfterTransferQty: 400,
            destAfterTransferQty: 800,
            product: 'PRODUCTA1'
          },
          {
            srcExistingQty: 650,
            qtyToTransfer: 0,
            destExistingQty: 200,
            srcAfterTransferQty: 650,
            destAfterTransferQty: 200,
            product: 'PRODUCTA2'
          },
          {
            srcExistingQty: 200,
            qtyToTransfer: 0,
            destExistingQty: 100,
            srcAfterTransferQty: 200,
            destAfterTransferQty: 100,
            product: 'PRODUCTB1'
          }
        ]
      };
    }
    
    // On page load, fetch data
    componentDidMount() {
      this.fetchQtyToTransferData();
    }
  
    // This function obtains all the information based on the state's row
    // to populate and fill the table on page load.
    fetchQtyToTransferData = async () => {
      try {
        const { rows } = this.state;
        const updatedRows = await Promise.all(
          rows.map(async (row) => {
            const response = await fetch('http://localhost:8000/singleDateQuery', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                ...this.state.formData,
                productCode: row.product
              })
            });
            // Assume the fetched data has a 'qtyToTransfer' property
            const rowData = await response.json();

            // Update the 'qtyToTransfer' property in the row
            return { 
              ...row, 
              qtyToTransfer: rowData.value === null ? 0 : rowData.value 
            };
          })
        );
  
        this.setState({ rows: updatedRows }, () => {
          // Call updateValues after the state has been updated
          updatedRows.forEach((_, index) => {
            this.updateValues(index);
          });
        });
      } catch (error) {
        console.error('There was an error with the request:', error);
      }
    }
  
    // This takes a product, updates the row value and then calls the API
    // to grab its value from the DB. It then updates the values in the table
    // based on the value obtained.
    handleSingleQueryPOST = async (product, index) => {
      const { formData, rows } = this.state;
    
      const selectedProductCode = product;

      // Update the formData object with the selected product code
      const updatedFormData = {
        ...formData,
        productCode: selectedProductCode,
      };

      try {
        const response = await fetch('http://localhost:8000/singleDateQuery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedFormData),
        });

        const data = await response.json();
        
        const updatedRows = [...rows];

        updatedRows[index] = {
          ...updatedRows[index],
          qtyToTransfer: data.value === null ? 0 : data.value
        };
    
        // Update the state with the modified row
        this.setState({
          rows: updatedRows,
        }, () => {
          this.updateValues(index);
        });
      } catch (error) {
        console.error('There was an error with the request:', error);
      }
    };
  
    // This function handles the warehouse/outlet code to the API body
    handleWarehouseSelect = (event) => {
      const { formData } = this.state;
      this.setState({
        formData: {
          ...formData,
          outletCode: event.target.value,
        },
        },
        () => {
          this.fetchQtyToTransferData();
        }
      );
    };
  
    // function to handle the product select within the table. This will also call the 
    // API to update the fields based on the product selected
    handleProductSelect = (event, index) => {
      const selectedProduct = event.target.value; // Assuming the selected product is in the event.target.value
  
      this.setState(
        (prevState) => {
          const updatedRows = [...prevState.rows];
          updatedRows[index] = {
            ...updatedRows[index],
            product: selectedProduct,
          };
          return { rows: updatedRows };
        },
        () => {
          // After updating the state, call the API or perform any other actions
          this.handleSingleQueryPOST(selectedProduct, index);
        }
      );
    }
  
    // Function to handle changes in the qty to transfer input for a specific row
    handleQtyChange = (index, event) => {
      const updatedRows = [...this.state.rows]; 
      
      updatedRows[index] = {
        ...updatedRows[index], 
        qtyToTransfer: isNaN(event.target.value) ? 0 : event.target.value,
      };
    
      this.setState({ rows: updatedRows }, () => {
        this.updateValues(index);
      });
    };
  
    // Function to update values based on the qty to transfer
    updateValues = (index) => {
      const { rows } = this.state;
      const row = rows[index];
      const srcAfterTransferQty = Number(row.srcExistingQty) - Number(row.qtyToTransfer);
      const destAfterTransferQty = Number(row.destExistingQty) + Number(row.qtyToTransfer);
  
      // Update the row values
      row.srcAfterTransferQty = srcAfterTransferQty;
      row.destAfterTransferQty = destAfterTransferQty;
  
      // Update the state with the modified row
      this.setState({ rows: [...rows] });
    };
  
    render() {
      const { formData, outlets, products, rows } = this.state;
      return (
        <>
          <Content style={{flex: 1}}>
            <div className="app-container">
              <div className="form-container">
                <h3>Instructions: Change the Product Code in the table to update the values.</h3>
                <br />
                <div style={{display:'flex'}}>
                  <Select id="inline" labelText="Warehouse List:" inline onChange={this.handleWarehouseSelect} value={formData.outletCode}>
                    {outlets.map((outlet, index) => (
                      <SelectItem key={index} value={outlet} text={outlet}/>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="conditional-render">
                <Table aria-label="sample table" >
                  <TableHead>
                    <TableRow>
                      <TableHeader>
                        No
                      </TableHeader>
                      <TableHeader>
                        Product details
                      </TableHeader>
                      <TableHeader>
                        Src Existing QTY
                      </TableHeader>
                      <TableHeader>
                        Src After Transfer QTY
                      </TableHeader>
                      <TableHeader>
                        QTY to Transfer
                      </TableHeader>
                      <TableHeader>
                        Dest Existing QTY
                      </TableHeader>
                      <TableHeader>
                        Dest After Transfer QTY
                      </TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                        <Select
                          id={`inline${index}`}
                          labelText=""
                          inline
                          onChange={(event) => this.handleProductSelect(event, index)}
                          value={row.product}
                        >
                          {products.map((product, productIndex) => (
                            <SelectItem key={productIndex} value={product} text={product} />
                          ))}
                        </Select>
                        </TableCell>
                        <TableCell>{row.srcExistingQty}</TableCell>
                        <TableCell>{row.srcAfterTransferQty}</TableCell>
                        <TableCell>
                          <TextInput labelText="" id={`text-input-${index}`} type="text" placeholder={row.qtyToTransfer.toString()} value={row.qtyToTransfer} onChange={(event) => this.handleQtyChange(index, event)} />
                        </TableCell>
                        <TableCell>{row.destExistingQty}</TableCell>
                        <TableCell>{row.destAfterTransferQty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
          </Content>
        </>
      );
    }
  }
  
  export default SingleDateComponent;