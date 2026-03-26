# Gotowy projekt: frontend + API

## Co jest w środku
- `frontend/` – osobna aplikacja frontowa (`fetch` + `localStorage`)
- `api/` – osobna aplikacja PHP zwracająca JSON

## Jak uruchomić na XAMPP
1. Skopiuj folder `frontend` np. do:
   `C:\xampp\htdocs\jaguar-front`
2. Skopiuj folder `api` np. do:
   `C:\xampp\htdocs\jaguar-api`
3. Zaimportuj plik:
   `api/schema.sql`
4. Sprawdź konfigurację bazy w:
   `api/config.php`
5. Sprawdź adres API w:
   `frontend/js/config.js`

Domyślnie ustawione jest:
- API: `http://localhost/jaguar-api`
- baza: `localhost`, `root`, puste hasło, baza `shop`

## Najważniejsze założenia
- frontend nie korzysta z `include` ani z połączenia z bazą
- frontend komunikuje się wyłącznie przez API
- koszyk i zalogowany użytkownik są trzymani w `localStorage`
- składanie zamówienia zapisuje dane do bazy przez `api/order.php`

## Endpointy
- `GET /products.php`
- `GET /product.php?id=...`
- `GET /categories.php`
- `POST /register.php`
- `POST /login.php`
- `POST /create-product.php`
- `POST /order.php`

## Uwaga
Jeżeli masz już starą bazę z hasłami zapisanymi jako zwykły tekst, logowanie nadal będzie działało.
Nowe rejestracje zapisują hasło jako hash.
