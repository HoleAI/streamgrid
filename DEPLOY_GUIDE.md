# Guida al Deploy (GitHub -> Vercel)

Dato che il progetto è collegato a Vercel tramite **GitHub**, il processo di deploy è completamente automatizzato. 

Non è necessario utilizzare la CLI di Vercel locale (`npx vercel`), ma basta inviare (push) le modifiche al repository GitHub. Vercel intercetterà il caricamento e avvierà la build in automatico.

## Come effettuare il Deploy

Ogni volta che fai una modifica al codice (es. aggiungere nuovi canali, cambiare gli stili CSS), segui questi 3 passaggi nel terminale:

1. **Aggiungi i file modificati:**
   ```bash
   git add .
   ```
   *(Questo preparerà tutte le tue modifiche per essere salvate)*

2. **Crea un salvataggio (Commit):**
   ```bash
   git commit -m "Descrizione di cosa hai modificato (es: Aggiunti canali sportivi)"
   ```

3. **Invia le modifiche a GitHub (Push):**
   ```bash
   git push origin main
   ```

## Cosa succede dopo?
Appena il comando `git push` termina con successo, Vercel rileva automaticamente il caricamento sulla branch `main` e inizia a distribuire la nuova versione del sito.
Di solito ci mette pochi secondi. Puoi vedere il sito aggiornato visitando direttamente il link di produzione.
