FROM nginx:alpine

#création du dossier css s'il n'existe pas
RUN mkdir -p /usr/share/nginx/html/css

#copie du contenu du frontend
COPY . /usr/share/nginx/html




#expose le port 80 pour l'accès HTTP
EXPOSE 80
