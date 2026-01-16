# Use a lightweight Python image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy your code into the container
COPY . .

# Install the libraries from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Cloud Run expects the app to listen on port 8080
ENV PORT=8080

# Run the app
CMD ["python", "main.py"]