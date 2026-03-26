<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$data = read_json();

$login = trim((string) ($data['login'] ?? ''));
$password = (string) ($data['password'] ?? '');

if ($login === '' || $password === '') {
    json_error('Podaj login i hasło.');
}

$conn = db();
$stmt = $conn->prepare('SELECT id, login, password FROM users WHERE login = ?');
$stmt->bind_param('s', $login);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    json_error('Wrong login or password', 401);
}

$storedPassword = (string) $user['password'];
$valid = password_verify($password, $storedPassword) || hash_equals($storedPassword, $password);

if (!$valid) {
    json_error('Wrong login or password', 401);
}

json_response([
    'success' => true,
    'user' => [
        'id' => (int) $user['id'],
        'login' => (string) $user['login'],
    ],
]);
