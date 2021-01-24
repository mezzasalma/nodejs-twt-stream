# Workshop NodeJS & Twitter API
###Maëva Mezzasalma BDDI 3 - Gobelins

Application NodeJS qui permet de voir les images postées en temps réel sur Twitter sur un mot-clé.
L'application demande à l'utilisateur de renseigner un mot-clé ou plusieurs mots-clés (par défaut keyword = Ghibli).

Pour l'instant, on peut récupérer dans la console côté serveur un tableau associatif du nombre d'images obtenu pour chaque mot-clés et le total des tweets récupérés contenant des images.

## Installation & Lancement :
- Récupérer le code source de l'application NodeJS.
- Lancer ```npm install``` pour récupérer les modules dont dépend l'application.
- Créer un fichier ```.env``` à la racine du projet et ajouter votre ```TWT_BEARER_TOKEN```.
- Lancer ```npm start``` ou ```node index.js```.
- Ouvrir ```localhost:3000```.

## Récupération et affichage des données
Un WebSocket sever a été mis en place pendant le cours afin de permettre au serveur et au client de communiquer.
Notamment à l'aide de la méthode ```.send()```

Lorsque l'utilisateur soumet sa requête, le client récupère la valeur contenue dans l'input et la renvoie au serveur.
Ce dernier va la récupérer et l'envoyer dans les paramètres de la méthode ```resetRules()```, qui va récupérer les règles déjà existantes, les supprimer et ajouter les nouvelles.

A l'aide des streams ```Transform``` j'ai pu parser mes données en JSON puis en extraire l'url des images pour les renvoyer ensuite au client.
Le client récupère la valeur et crée les balises nécessaires pour l'affichage des images.
Le stream TweetCounter permet de compter le nombre total de tweet récupérer et pour chaque règle.

## Difficultés rencontrées
J'ai, au départ, eu du mal à comprendre le fonctionnement de l'application commencée en cours et donc comment agir dessus.
Le second problème a été de trouver quoi faire de ses données.

## Soucis mineurs
Il y a un temps de latence conséquent entre le moment où l'utilisateur soumet ses mots-clés à l'application et le moment où ils sont pris en compte.
Par rapport à la connexion de plusieurs clients, la modifications des règles chez l'un engendre la modification chez l'autre (même token).