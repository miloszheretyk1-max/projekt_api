<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$data = read_json();

$login = trim((string) ($data['login'] ?? ''));
$password = (string) ($data['password'] ?? '');
$confirmPassword = (string) ($data['confirmPassword'] ?? '');

if ($login === '' || $password === '' || $confirmPassword === '') {
    json_error('Wypełnij wszystkie pola.');
}

if ($password !== $confirmPassword) {
    json_error('Hasła nie są takie same.');
}

if (mb_strlen($login) < 3) {
    json_error('Login musi mieć co najmniej 3 znaki.');
}

$conn = db();
$conn->query("ALTER TABLE users MODIFY password VARCHAR(255) NOT NULL");

$stmt = $conn->prepare('SELECT id FROM users WHERE login = ?');
$stmt->bind_param('s', $login);
$stmt->execute();
$result = $stmt->get_result();
$exists = $result->fetch_assoc();
$stmt->close();

if ($exists) {
    json_error('Taki login już istnieje.');
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare('INSERT INTO users (login, password) VALUES (?, ?)');
$stmt->bind_param('ss', $login, $hash);
$stmt->execute();
$userId = $stmt->insert_id;
$stmt->close();

json_response([
    'success' => true,
    'message' => 'User created',
    'user' => [
        'id' => $userId,
        'login' => $login,
    ],
], 201);
