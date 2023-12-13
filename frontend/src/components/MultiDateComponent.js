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

class MultiDateComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        cubeName: 'SmartfrenCube',
        orderDates:
          [
            {
              orderDate: "01/02/2023",
            },
            {
              orderDate: "01/03/2023",
            },
            {
              orderDate: "01/04/2023",
            },
            {
              orderDate: "01/08/2023",
            }
          ],
        outletCode: 'OUTLETBKS1',
        productCode: 'PRODUCTA1',
      },
      outlets: ["OUTLETBKS1", "OUTLETBKS2", "OUTLETBKS3", "OUTLETBKS4"],
      products: ["PRODUCTA1", "PRODUCTA2", "PRODUCTB1", "PRODUCTB2", "PRODUCTC0"],
      rows: [
        {
          srcExistingQty: 800,
          qtyToTransfer: 0,
          destExistingQty: 400,
          srcAfterTransferQty: 400,
          destAfterTransferQty: 800,
          product: 'PRODUCTA1',
          date: '01/02/2023'
        },
        {
          srcExistingQty: 800,
          qtyToTransfer: 0,
          destExistingQty: 400,
          srcAfterTransferQty: 400,
          destAfterTransferQty: 800,
          product: 'PRODUCTA1',
          date: '01/02/2023'
        },
        {
          srcExistingQty: 800,
          qtyToTransfer: 0,
          destExistingQty: 400,
          srcAfterTransferQty: 400,
          destAfterTransferQty: 800,
          product: 'PRODUCTA1',
          date: '01/02/2023'
        },
        {
          srcExistingQty: 800,
          qtyToTransfer: 0,
          destExistingQty: 400,
          srcAfterTransferQty: 400,
          destAfterTransferQty: 800,
          product: 'PRODUCTA1',
          date: '01/02/2023'
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

      // Make a single API call to fetch all values
      const response = await fetch('http://localhost:8000/multiDateQuery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.formData)
      });

      const result = await response.json();

      if (result && result.values) {
        const updatedRows = rows.map((row, index) => {
          const rowData = result.values[index];

          // Update each row with the corresponding date and value
          return {
            ...row,
            product: this.state.formData.productCode,
            qtyToTransfer: rowData.value,
            date: rowData.date
          };
        });

        this.setState({ rows: updatedRows }, () => {
          // Call updateValues after the state has been updated
          updatedRows.forEach((_, index) => {
            this.updateValues(index);
          });
        });
      } else {
        console.error('Invalid API response:', result);
      }

      
    } catch (error) {
      console.error('There was an error with the request:', error);
    }
  }

  // This function handles the warehouse/outlet code to the API body
  handleWarehouseSelect = (event) => {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        outletCode: event.target.value,
      },
    });
  };

  // function to handle the product select within the table. This will also call the 
  // API to update the fields based on the product selected
  handleProductSelect = (event) => {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        productCode: event.target.value,
      },
      },
      () => {
        console.log("I'm happening")
        this.fetchQtyToTransferData();
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
        <Content style={{ flex: 1 }}>
          <div className="app-container">
            <div className="form-container">
              <h3>Instructions: Change the Product Code to update the table.</h3>
              <br />
              <div style={{ display: 'flex' }}>
                <Select 
                  id="inline" 
                  labelText="Warehouse List:" 
                  inline 
                  onChange={this.handleWarehouseSelect} 
                  value={formData.outletCode}
                >
                  {outlets.map((outlet, index) => (
                    <SelectItem key={index} value={outlet} text={outlet} />
                  ))}
                </Select>
                <Select
                  id="inlineProduct"
                  labelText="Product List:"
                  inline
                  onChange={this.handleProductSelect}
                  value={formData.productCode}
                >
                  {products.map((product, productIndex) => (
                    <SelectItem key={productIndex} value={product} text={product} />
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
                      Date
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
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.product}</TableCell>
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

export default MultiDateComponent;