from pydantic import BaseModel
from typing import List

class DateValueObject(BaseModel):
    date: str
    value: float

class AnalyzedMultiRequest(BaseModel):
    values: List[DateValueObject]