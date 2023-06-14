FROM python:3.8-slim
RUN pip install --upgrade pip
RUN apt-get update

# Install dependencies for gcc module
RUN apt-get install build-essential libssl-dev libcurl4-openssl-dev -y
RUN apt-get install python3-dev -y

# Install dependencies for psycopg dependencies
RUN pip install psycopg2-binary
RUN apt-get install libpq-dev -y


COPY "./requirements.txt" "./"
COPY "./app/requirements.txt" "./app/"
COPY "./config.py" "./"
COPY "./tasks" "./tasks"

RUN pip install --no-cache-dir -r requirements.txt 
#RUN invoke app.dependencies.install

COPY "./" "./"

EXPOSE 5000

CMD [ "invoke", "app.run", "--no-install-dependencies", "--host", "0.0.0.0" ]
