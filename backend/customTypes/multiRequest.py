from pydantic import BaseModel
from typing import List

class OrderDateObject(BaseModel):
    orderDate: str

class MultiRequest(BaseModel):
    cubeName: str
    outletCode: str
    productCode: str
    orderDates: List[OrderDateObject]