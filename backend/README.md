# Development environment setup

## .env file setup

Copy the `.env.example` as `.env` and fill it with your own credentials.

## Installing requirements

To install all the necessary requirements run: `pip install -r requirements.txt`.

## Running the server locally

You can run the server with `uvicorn main:app --reload ` or with `python3 main.py`.

After running, the server should be listening on the port `8000`

`http://127.0.0.1:8000`

## Access Swagger

`http://127.0.0.1:8000/docs`