import React, { Component } from "react";
import HeaderComponent from "./components/HeaderComponent";
import {
  TextArea,
  Button,
  Content,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
} from "@carbon/react";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        cubeName: 'cube1',
        orderDate: 'date',
        outletCode: 'outletcode1',
        productCode: 'pcode1',
      },
      value: 0,
      formSubmitted: false,
      tableData: [],
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    // let data = this.state.formData

    try {
      console.log("made it")
      const response = await fetch('http://localhost:8000/singleDateQuery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.formData)
      });
      
      const data = await response.json()
      this.setState({ value: data.value })

      // const todos = await response.json()
      // console.log(todos)

      // if (!response.ok) {
      //   throw new Error('Problem...')
      // }
    } catch (error) {
      console.error('There was an error with the request:', error);
    }

    // if (this.state.formData.trim() !== "") {
    //   const newRow = {
    //     id: "a",
    //     answer: "answer 1",
    //     score: "0.9",
    //   };

    //   const newRow2 = {
    //     id: "b",
    //     answer: this.state.formData,
    //     score: "0.8",
    //   };

    //   this.setState({ formSubmitted: true });
    //   this.setState({ tableData: [newRow, newRow2] });
    // } else {
    //   alert("Please enter valid input before submitting.");
    // }
  };

  render() {
    const { formData, formSubmitted, tableData, value } = this.state;

    const headers = [
      {
        key: "answer",
        header: "Answer",
      },
      {
        key: "score",
        header: "Score",
      },
    ];

    const expandedContentMap = {
      a: "Additional details",
      b: "Additional details 2",
    };

    return (
      <>
        <HeaderComponent />

        <Content>
          <div className="app-container">
            <div className="form-container">
              <TextArea
                labelText="Enter input:"
                value={formData}
                onChange={(e) => this.setState({ formData: e.target.value })}
              />
              <Button onClick={this.handleSubmit}>Submit</Button>
            </div>

            <h1>{value}</h1>
            
          </div>
        </Content>
      </>
    );
  }
}

export default App;
