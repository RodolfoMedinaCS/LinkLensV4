import uvicorn

if __name__ == "__main__":
    print("Starting server...")
    uvicorn.run("main:app", host="127.0.0.1", port=8001, log_level="debug") 