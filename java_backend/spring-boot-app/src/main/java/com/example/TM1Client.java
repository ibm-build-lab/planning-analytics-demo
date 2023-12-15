package com.example;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class TM1Client {

    private final String apiUrl;
    private final String token;

    private final RestTemplate restTemplate;

    public TM1Client(
        @Value("${tm1.api.address}") String address,
        @Value("${tm1.api.port}") String port,
        @Value("${tm1.api.username}") String username,
        @Value("${tm1.api.password}") String password,
        @Value("${tm1.api.namespace}") String namespace
    ) {
        this.apiUrl = "http://" + address + ":" + port;

        String credentials = username + ":" + password + ":" + namespace;
        String base64Encoded = java.util.Base64.getEncoder().encodeToString(credentials.getBytes());
        this.token = "CAMNamespace " + base64Encoded;

        this.restTemplate = new RestTemplate();
    }

    public void logout() {
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl + "/api/logout",
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            // Handle the response if needed
            // String responseBody = response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error logging out: " + e.getMessage());
        }
    }

    public String executeMDXQuery(String mdxQuery) {
        try {
            HttpHeaders headers = createHeaders();
            headers.set("Content-Type", "application/json");

            String requestJson = "{\"MDX\": \"" + mdxQuery + "\"}";
            HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl + "/api/v1/ExecuteMDX",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String result = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(result);
            String cellsetId = jsonNode.get("ID").asText();

            // Call the next function to retrieve cell values
            String cellValues = retrieveCellValues(cellsetId);

            return cellValues;
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error executing MDX query: " + e.getMessage());
            return null;
        }
    }

    private String retrieveCellValues(String cellsetId) {
        try {
            HttpHeaders headers = createHeaders();
            headers.set("Content-Type", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> cellsetResponse = restTemplate.exchange(
                    apiUrl + "/api/v1/Cellsets('" + cellsetId + "')/Cells",
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            String cellsetResponseBody = cellsetResponse.getBody();

            return cellsetResponseBody;
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error retrieving cell values: " + e.getMessage());
            return null;
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("WWW-Authenticate", "Basic Realm=\"TM1\"");
        headers.set("Authorization", token);


        return headers;
    }
}