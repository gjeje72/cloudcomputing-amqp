Nécéssite :  
  - Node avec npm  
  - Docker
  - Docker compose plugin
  - Avoir les ports 8080 (api), 6379 (redis), 5672 and 15672 (rabbitmq) librent

Démarrage avec la commande : ./start.sh  
Arrêt avec la commande : ./stop.sh  

L'api est disponible sur l'adresse 'http://localhost:8080' (cf. docs\CloudComputing_AMQP.postman_collection.json).  
Elle propose deux points d'entrées :   
  - Une methode Get avec la route : http://localhost:8080/orders/{orderId}/status  
	Permet de récupérer le statut d'une commande depuis sont Id.

  - Une methode Put avec la route :   
  http://localhost:8080/orders  
      Prend en body (JSON): 
      {
          "dish": "tiramisu",
          "status": "commande en cours de traitement"
      }
      Permet de créer une commande dans la base Redis, d'envoyer l'Id créé en message vers la queue 'commandes' du rabbitmq.
      Retourne l'Id de la commande créée.


Documentations utilisés  
https://www.npmjs.com/package/amqplib  

https://github.com/amqp-node/amqplib/tree/main/examples/tutorials                  