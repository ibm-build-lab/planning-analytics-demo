package com.example.request;

import java.util.List;

public class MultiResultOutput {

    private List<ValueEntry> values;

    public List<ValueEntry> getValues() {
        return values;
    }

    public void setValues(List<ValueEntry> values) {
        this.values = values;
    }

    public static class ValueEntry {
        private String date;
        private Float value;

        // Getters and setters

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Float getValue() {
            return value;
        }

        public void setValue(Float value) {
            this.value = value;
        }
    }
}