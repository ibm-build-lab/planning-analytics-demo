#Necessary libraries
import time
import re
import uvicorn
import sys
import subprocess
import os, getpass
import pandas as pd
import json

from fastapi import FastAPI, Form, BackgroundTasks, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
from customTypes.singleRequest import SingleRequest
from customTypes.analyzedSingleRequest import AnalyzedSingleRequest
from customTypes.multiRequest import MultiRequest
from customTypes.analyzedMultiRequest import AnalyzedMultiRequest

from TM1py.Services import TM1Service
from TM1py.Services import CubeService
from TM1py.Services import ViewService
from TM1py.Utils.Utils import build_pandas_dataframe_from_cellset
from TM1py.Exceptions.Exceptions import TM1pyRestException

from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Iterable, List
from io import StringIO


load_dotenv()

# Credentials
tm1_credentials = {
    "address": os.environ.get("ADDRESS"),
    "port": os.environ.get("PORT"),
    "user": os.environ.get("USERNAME"),
    "password": os.environ.get("PASSWORD"),
    "ssl":False,
	"namespace":"Harmony LDAP"
}

print(tm1_credentials)

app = FastAPI()

# Set up CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# #Initializing Fast API
# app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/singleDateQuery")
async def execute_singleDate_mdx(request :SingleRequest)->AnalyzedSingleRequest: #
    userCubeName = request.cubeName
    userOrderDate = request.orderDate
    userOutletCode = request.outletCode
    userProductCode = request.productCode
    
    # Hardcode Example    
    # single_mdx_query = "SELECT {([orderdate].[01/02/2023], [outletcode].[OUTLETBKS1], [productcode].[PRODUCTB1])} ON 0 FROM [SmartfrenCube]"
    single_mdx_query = "SELECT {{([orderdate].[{}], [outletcode].[{}], [productcode].[{}])}} ON 0 FROM [{}]".format(
        userOrderDate, userOutletCode, userProductCode, userCubeName
    )

    print(single_mdx_query)
    # UNCOMMENT AFTER TM1 CONNECTION HAS BEEN ESTABLISHED
    # result = tm1.cubes.cells.execute_mdx_dataframe_pivot(single_mdx_query, cube_name)

    # Hardcode Example    
    # value = result.loc[('Values', ('01/02/2023', 'OUTLETBKS1', 'PRODUCTB1'))]

    # UNCOMMENT AFTER TM1 CONNECTION HAS BEEN ESTABLISHED
    # value = result.loc[('Values', (userOrderDate, userOutletCode, userProductCode))]

    # REMOVE AFTER TM1 CONNECTION HAS BEEN ESTABLISHED
    value = float(50)
    
    return AnalyzedSingleRequest(value=value)

@app.post("/multiDateQuery")
async def execute_multiDate_mdx(request :MultiRequest)->AnalyzedMultiRequest:
    userCubeName = request.cubeName
    userOrderDates = request.orderDates
    userOutletCode = request.outletCode
    userProductCode = request.productCode

    print(request)

    multi_mdx_query = "SELECT {[orderdate].[01/02/2023], [orderdate].[01/03/2023], [orderdate].[01/04/2023], [orderdate].[01/08/2023]} ON 0, {[outletcode].[OUTLETBKS1]} ON 1, {[productcode].[PRODUCTB1]} ON 2 FROM [SmartfrenCube]"
    result = tm1.cubes.cells.execute_mdx_dataframe_pivot(multi_mdx_query, cube_name)

    outlet_row = result.loc['OUTLETBKS1']
    data = []
    for (category, date), value in outlet_row.items():
        date_value_obj = {"date": date, "value": value}
        print(f"Value for {date}: {value}")
        data.append(date_value_obj)

    return AnalyzedMultiRequest(values=data)



# running the application
if __name__ == '__main__' or 'uvicorn' in sys.argv[0]:

    
    try:
        # UNCOMMENT AFTER TM1 CONNECTION HAS BEEN ESTABLISHED
        # with TM1Service(address=tm1_credentials["address"], port=tm1_credentials["port"], user=tm1_credentials["user"], password=tm1_credentials["password"], ssl=tm1_credentials["ssl"], namespace=tm1_credentials["namespace"]) as tm1:
        #     cube_name = 'SmartfrenCube'
        #     cubeService = tm1.cubes.cells.get_cube_service()
        #     cubeData = cubeService.get(cube_name='SmartfrenCube')
        #     viewData = tm1.views.get_all(cube_name)
        #     dimensionData = cubeService.get_dimension_names(cube_name='SmartfrenCube')
        #     data = tm1.cubes.cells.execute_view_dataframe_pivot(cube_name, view_name='SmartfrenCube', private=False)


            # print(dir(tm1))
            # print(dir(tm1.cubes))
            # print(dir(tm1.cubes.cells))

            # Trying mdx
            # multi_mdx_query = "SELECT {[orderdate].[01/02/2023], [orderdate].[01/03/2023], [orderdate].[01/04/2023], [orderdate].[01/08/2023]} ON 0, {[outletcode].[OUTLETBKS1]} ON 1, {[productcode].[PRODUCTB1]} ON 2 FROM [SmartfrenCube]"
            # single_mdx_query = "SELECT {([orderdate].[01/02/2023], [outletcode].[OUTLETBKS1], [productcode].[PRODUCTB1])} ON 0 FROM [SmartfrenCube]"
            # # Execute MDX query
            # result1 = tm1.cubes.cells.execute_mdx_dataframe_pivot(multi_mdx_query, cube_name)
            # result2 = tm1.cubes.cells.execute_mdx_dataframe_pivot(single_mdx_query, cube_name)
            
        if'uvicorn' not in sys.argv[0]:
            uvicorn.run(app, host='0.0.0.0', port=8000)

    except Exception as e:
        print(f"Error connecting to TM1 API: {e}")
    
