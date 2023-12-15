package com.example.request;

import java.util.List;

public class MultiDateQueryRequest {

    private String cubeName;
    private List<OrderDate> orderDates;
    private String outletCode;
    private String productCode;

    // getters and setters

    public String getCubeName() {
        return cubeName;
    }

    public void setCubeName(String cubeName) {
        this.cubeName = cubeName;
    }

    public List<OrderDate> getOrderDates() {
        return orderDates;
    }

    public void setOrderDates(List<OrderDate> orderDates) {
        this.orderDates = orderDates;
    }

    public String getOutletCode() {
        return outletCode;
    }

    public void setOutletCode(String outletCode) {
        this.outletCode = outletCode;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public static class OrderDate {
        private String orderDate;

        // getters and setters for OrderDate
        public String getOrderDate() {
            return orderDate;
        }

        public void setOrderDate(String orderDate) {
            this.orderDate = orderDate;
        }
    }
}