import fetch from "node-fetch";

class TM1ApiClient {
    constructor(apiUrl, token) {
        this.apiUrl = apiUrl;
        this.token = token;
    }

    async logout() {
        try {
            const response = await fetch(`${this.apiUrl}/api/logout`, {
            method: 'GET',
            headers: {
                'WWW-Authenticate': 'Basic Realm="TM1"',
                'Authorization': this.token
            }
            });
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }
  
    async executeMDXQuery(mdxQuery) {
        try {

            let reqData = {
                "MDX": mdxQuery
            }

            console.log("")
            console.log(JSON.stringify(reqData))
            console.log("")
            
            const response = await fetch(`${this.apiUrl}/api/v1/ExecuteMDX`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'WWW-Authenticate': 'Basic Realm="TM1"',
                'Authorization': this.token
            },
            body: JSON.stringify(reqData)
            });

            const result = await response.json();
            const cellsetId = result.ID;

            // Call the next function to retrieve cell values
            return await this.retrieveCellValues(cellsetId);
        } catch (error) {
            console.error('Error executing MDX query:', error);
        }
    }
    
    // Obtains an array of values from the database based on the cellsetID
    // from executeMDXQuery(query)
    async retrieveCellValues(cellsetId) {
        try {   
            const cellsetResponse = await fetch(`${this.apiUrl}/api/v1/Cellsets('${cellsetId}')/Cells`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'WWW-Authenticate': 'Basic Realm="TM1"',
                'Authorization': this.token
            },
            });
    
            const cellsetResult = await cellsetResponse.json();
    
            return cellsetResult
        } catch (error) {
            console.error('Error retrieving cell values:', error);
        }
    }
}

export default TM1ApiClient;