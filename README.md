# Workshop NodeJS & Twitter API
####Maëva Mezzasalma BDDI 3 - Gobelins
Application NodeJS qui permet de voir les images postées en temps réel sur Twitter sur un mots-clé.
L'application demande à l'utilisateur de renseigner un mot-clé ou plusieurs mots-clés (par défaut filtrer sur Ghibli).

## Installation & Lancement :
- Récupérer le code source de l'application NodeJS.
- Lancer ```npm install``` pour récupérer les modules dont dépend l'application.
- Créer un fichier ```.env``` à la racine du projet et ajouter votre ```TWT_BEARER_TOKEN```.
- Lancer ```npm start``` ou ```node index.js```.
- Ouvrir ```localhost:3000```.

## Récupération et affichage des données
Un WebSocket sever a été mis en place afin de permettre au serveur et au client de communiquer.
Notamment à l'aide de la méthode ```.send()```

Lorsque l'utilisateur soumet sa requête, le client récupère la valeur contenue dans l'input et la renvoie au serveur.
Ce dernier va la récupérer et l'envoyer dans les paramètres de la méthode ```resetRules()```, qui va récupérer les règles déjà existantes, les supprimer et ajouter les nouvelles.

Des streams ```Transform``` sont utilisés pour traiter les données : les parser puis extraire l'url des images du JSON pour les renvoyer ensuite au client.
Le client récupère la valeur et crée les balises nécessaires pour l'affichage des images.



## Difficultés rencontrées
J'ai, au départ, eu du mal à comprendre l'API Twitter, les données que je recevais et comment agir dessus.
Le second problème a été de trouver quoi faire de ses données (je ne suis pas très inventive).

## Soucis mineurs
Il y a un temps de latence conséquent entre le moment où l'utilisateur soumet ses mots-clés à l'application et le moment où ils sont pris en compte.