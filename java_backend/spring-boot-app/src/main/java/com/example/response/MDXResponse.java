package com.example.response;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MDXResponse {

    private List<Cell> value;

    public List<Cell> getValue() {
        return value;
    }

    public void setValue(List<Cell> value) {
        this.value = value;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Cell {
        @JsonProperty("Ordinal")
        private int ordinal;
        
        @JsonProperty("Value")
        private Float value;

        @JsonProperty("FormattedValue")
        private String formattedValue;

        public String formattedValue() {
            return formattedValue;
        }

        public void formattedValue(String formattedValue) {
            this.formattedValue = formattedValue;
        }

        public Float getValue() {
            return value;
        }

        public void setValue(Float value) {
            this.value = value;
        }

        public int getOrdinal() {
            return ordinal;
        }

        public void setordinal(int ordinal) {
            this.ordinal = ordinal;
        }
    }
}