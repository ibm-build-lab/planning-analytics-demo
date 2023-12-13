from pydantic import BaseModel

class SingleRequest(BaseModel):
    cubeName: str
    orderDate: str
    outletCode: str
    productCode: str