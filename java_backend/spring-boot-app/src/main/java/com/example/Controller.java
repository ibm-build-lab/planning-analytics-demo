package com.example;

import com.example.request.MultiDateQueryRequest;
import com.example.request.MultiResultOutput;
import com.example.request.SingleDateQueryRequest;
import com.example.response.MDXResponse;

import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.stream.Collectors;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.HttpStatus;
import com.fasterxml.jackson.core.JsonProcessingException;


@RestController
@CrossOrigin
public class Controller {

    private TM1Client tm1Client;

    @Autowired
    public Controller(TM1Client tm1Client) {
        this.tm1Client = tm1Client;
    }

    @GetMapping("/greet")
    public String greet() {
        return "Greetings from Spring Boot!";
    }

    @PostMapping("/singleDateQuery")
    public ResponseEntity<String> singleDateQuery(@RequestBody SingleDateQueryRequest request) {
        String cubeName = request.getCubeName();
        String orderDate = request.getOrderDate();
        String outletCode = request.getOutletCode();
        String productCode = request.getProductCode();

            String mdxQuery = "SELECT {([order_date].[" + orderDate + "], " +
            "[outlet_code].[" + outletCode + "], " +
            "[product_code].[" + productCode + "])} ON 0 "+
            "FROM [" + cubeName + "]";

        
        String result = tm1Client.executeMDXQuery(mdxQuery);
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            MDXResponse mdxResponse = objectMapper.readValue(result, MDXResponse.class);
            String jsonOutput = "";
            for (MDXResponse.Cell cell : mdxResponse.getValue()) {
                jsonOutput = "{\"value\":" + cell.getValue() + "}";
            }
            
            // Return ResponseEntity with the JSON string
            return ResponseEntity.ok(jsonOutput);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing JSON");
        }
    }

    @PostMapping("/multiDateQuery")
    public ResponseEntity<String> multiDateQuery(@RequestBody MultiDateQueryRequest request) {
        String cubeName = request.getCubeName();
        List<MultiDateQueryRequest.OrderDate> orderDates = request.getOrderDates();
        String outletCode = request.getOutletCode();
        String productCode = request.getProductCode();

        
        StringBuilder mdxQueryBuilder = new StringBuilder();
        mdxQueryBuilder.append("SELECT {");

        String orderDatesList = orderDates.stream()
                .map(date -> "[order_date].[" + date.getOrderDate() + "]")
                .collect(Collectors.joining(", ", "", ""));

        mdxQueryBuilder.append(orderDatesList);
        mdxQueryBuilder.append("} ON COLUMNS, ");

        mdxQueryBuilder.append("{[outlet_code].[").append(outletCode).append("]} ON ROWS, ");
        mdxQueryBuilder.append("{[product_code].[").append(productCode).append("]} ON PAGES ");
        mdxQueryBuilder.append("FROM [").append(cubeName).append("]");


        // Call TM1Client method and return response
        String result = tm1Client.executeMDXQuery(mdxQueryBuilder.toString());

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            MDXResponse mdxResponse = objectMapper.readValue(result, MDXResponse.class);
            MultiResultOutput resultOutput = new MultiResultOutput();
            List<MultiResultOutput.ValueEntry> valueEntries = new ArrayList<>();
            
            int index = 0;
            for (MultiDateQueryRequest.OrderDate orderDate : orderDates) {
                MultiResultOutput.ValueEntry valueEntry = new MultiResultOutput.ValueEntry();
                valueEntry.setDate(orderDate.getOrderDate());

                // Find the corresponding value in the response
                for (MDXResponse.Cell cell : mdxResponse.getValue()) {
                    if (cell.getOrdinal() == index) {
                        valueEntry.setValue(cell.getValue());
                        break;
                    }
                }

                valueEntries.add(valueEntry);
                index++;
            }
            resultOutput.setValues(valueEntries);

            String jsonOutput = objectMapper.writeValueAsString(resultOutput);

            return ResponseEntity.ok(jsonOutput);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing JSON");
        }
    }
}