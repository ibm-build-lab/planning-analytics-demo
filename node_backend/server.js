// Import the framework and instantiate it
import Fastify from 'fastify'
import cors from '@fastify/cors'
import Tm1Client from './lib/tm1Client.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Setup auth
const base64Encoded = btoa(`${process.env.USERNAME}:${process.env.PASSWORD}:${process.env.NAMESPACE}`);
const token = "CAMNamespace "+ base64Encoded;
const url = "http://"+process.env.ADDRESS+":"+process.env.PORT;
// Create connection to Client
const tm1Client = new Tm1Client(url, token);

const fastify = Fastify({
    logger: true
})

await fastify.register(cors, { 
    origin: ['*'],
    credentials: true,
    methods: ['*'],
    allowedHeaders: ['*']
})

// Declare a route
fastify.get('/', async function handler (request, reply) {
    return { hello: 'world' }
})

fastify.post('/singleDateQuery', async function handler (request, reply) {
    // const single_mdx_query = "SELECT {([orderdate].[01/02/2023], [outletcode].[OUTLETBKS1], [productcode].[PRODUCTB1])} ON 0 FROM [SmartfrenCube]"
    
    // UNCOMMENT THE TWO LINES BELOW WHEN CUBE IS UP
    const { orderDate, outletCode, productCode, cubeName } = request.body;
    // const singleDateMDXQuery = `SELECT { {([orderdate].[${orderDate}], [outletcode].[${outletCode}], [productcode].[${productCode}])} } ON 0 FROM [${cubeName}]`;

    // REMOVE THE SELECT BELOW WHEN THE CUBE IS UP
    const mdxQuery = 'SELECT {TM1SubsetToSet([Capital].[Capital],"Default","public")} ON 0, {[CapitalList].[CapitalList].[1], [CapitalList].[CapitalList].[2], [CapitalList].[CapitalList].[3], [CapitalList].[CapitalList].[4], [CapitalList].[CapitalList].[5], [CapitalList].[CapitalList].[6], [CapitalList].[CapitalList].[7], [CapitalList].[CapitalList].[8], [CapitalList].[CapitalList].[9], [CapitalList].[CapitalList].[10], [CapitalList].[CapitalList].[Total]} ON 1 FROM [Capital] WHERE ([organization].[organization].[101], [Asset Types].[Asset Types].[1200], [Year].[Year].[Y2], [Version].[Version].[Version 1])'
    const dataResult = await tm1Client.executeMDXQuery(mdxQuery);

    // REMOVE AFTER TM1 CONNECTION HAS BEEN ESTABLISHED. For a time being returning dummy values
    let value;
    if (productCode === "PRODUCTA1") {
        value = parseFloat(50);
    } else if (productCode === "PRODUCTB1") {
        value = parseFloat(25);
    } else {
        value = parseFloat(110);
    }

    return {value: value}
})

fastify.post('/multiDateQuery', async function handler (request, reply) {
    // multi_mdx_query = "SELECT {[orderdate].[01/02/2023], [orderdate].[01/03/2023], [orderdate].[01/04/2023], [orderdate].[01/08/2023]} ON 0, {[outletcode].[OUTLETBKS1]} ON 1, {[productcode].[PRODUCTB1]} ON 2 FROM [SmartfrenCube]"
    
    // UNCOMMENT THE THREE LINES BELOW WHEN CUBE IS UP
    const { orderDates, outletCode, productCode, cubeName } = request.body;
    // const orderDatesList = orderDates.map(date => `[orderdate].[${date.orderDate}]`).join(', ');
    // const multiDateMDXQuery = `SELECT {${orderDatesList}} ON 0, {[outletcode].[${outletCode}]} ON 1, {[productcode].[${productCode}]} ON 2 FROM [${cubeName}]`;
        

    const mdxQuery = 'SELECT {TM1SubsetToSet([Capital].[Capital],"Default","public")} ON 0, {[CapitalList].[CapitalList].[1], [CapitalList].[CapitalList].[2], [CapitalList].[CapitalList].[3], [CapitalList].[CapitalList].[4], [CapitalList].[CapitalList].[5], [CapitalList].[CapitalList].[6], [CapitalList].[CapitalList].[7], [CapitalList].[CapitalList].[8], [CapitalList].[CapitalList].[9], [CapitalList].[CapitalList].[10], [CapitalList].[CapitalList].[Total]} ON 1 FROM [Capital] WHERE ([organization].[organization].[101], [Asset Types].[Asset Types].[1200], [Year].[Year].[Y2], [Version].[Version].[Version 1])'
    const dataResult = await tm1Client.executeMDXQuery(mdxQuery);

    // REMOVE AFTER TM1 CONNECTION HAS BEEN ESTABLISHED. For a time being returning dummy values
    let data;
    if (productCode == "PRODUCTA1"){
        data = [
            {'date' : "01/02/2023", 'value': 20},
            {'date' : "01/03/2023", 'value': 30},
            {'date' : "01/04/2023", 'value': 40},
            {'date' : "01/08/2023", 'value': 80}
        ]
    } else if (productCode == "PRODUCTB1") {
        data = [
            {'date' : "01/02/2023", 'value': 100},
            {'date' : "01/03/2023", 'value': 50},
            {'date' : "01/04/2023", 'value': 80},
            {'date' : "01/08/2023", 'value': 30}
        ]
    } else {
        data = [
            {'date' : "01/02/2023", 'value': 5},
            {'date' : "01/03/2023", 'value': 10},
            {'date' : "01/04/2023", 'value': 15},
            {'date' : "01/08/2023", 'value': 20}
        ]
    }
    return {values: data, test: dataResult}
})

// Run the server!
try {
    await fastify.listen({ port: 8000 })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}