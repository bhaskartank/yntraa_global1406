FROM python:3

# Add and install Python modules
ADD requirements.txt /src/requirements.txt
RUN cd /src; pip install -r requirements.txt

# Bundle app source
ADD src /src

# Expose
EXPOSE  5000


CMD ["python", "src/app.py"]
