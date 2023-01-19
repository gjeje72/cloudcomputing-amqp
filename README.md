Execution depuis Windows :

démarrer Docker Desktop

démarrer 2 terminaux WSL2 : 
  - le premier démarrera un conteneur docker avec une instance rabbitmp :  
    docker run -it --rm --name rabbitmq -p  5672:5672 -p 15672:15672 rabbitmq:3.11-management  
      l'instance rabbitmq est visible à l'adresse : http://localhost:15672/   
      l'identifiant de connection est : guest  
      le mot de passe est             : guest  
      un graphique de suivi des messages est disponible sous l'onglet 'Queues'  

  - le second démarrera un conteneur docker avec une instance reddis qui nous sert de base de donnée :     
    docker run -p 6379:6379 redis/redis-stack:latest  

Ouvrir le projet avec Visual Studio Code : CloudComputing_AMQP  
Démarrer l'api depuis le terminal du projet : npm run start:api  
Démarrer le worker depuis un second terminal : npm run start:worker  
  
L'api est disponible sur l'adresse 'http://localhost:8080' et propose trois points d'entrées :   
  - Une methode Get avec la route : http://localhost:8080/orders/{orderId}/status  
	Permet de récupérer le statut d'une commande depuis sont Id.

  - Une methode Put avec la route :   
  http://localhost:8080/orders  
      Prend en body (JSON): 
      {
          "ref": 1,
          "status": "InProgress"
      }
      Permet de créer une commande dans la base Redis, d'envoyer l'Id créé en message vers la queue 'commandes' du rabbitmq.
      Retourne l'Id de la commande créée.


Documentations utilisés  
https://www.npmjs.com/package/amqplib  

https://github.com/amqp-node/amqplib/tree/main/examples/tutorials                  