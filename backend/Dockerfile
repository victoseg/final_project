FROM python:3.10-slim

#répertoire de travail
WORKDIR /app

#copie des fichiers de l'application backend
COPY . .

#installation des dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

#expose le port 5000 pour flask
EXPOSE 5000

#commande pour lancer flask
CMD ["python", "app.py"]