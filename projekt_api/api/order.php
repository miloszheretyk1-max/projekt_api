<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$data = read_json();

$firstName = trim((string) ($data['first_name'] ?? ''));
$lastName = trim((string) ($data['last_name'] ?? ''));
$address = trim((string) ($data['address'] ?? ''));
$city = trim((string) ($data['city'] ?? ''));
$postalCode = trim((string) ($data['postal_code'] ?? ''));
$userId = isset($data['user_id']) && $data['user_id'] !== null ? (int) $data['user_id'] : null;
$items = $data['items'] ?? null;

if ($firstName === '' || $lastName === '' || $address === '' || $city === '' || $postalCode === '') {
    json_error('Fill in shipping data');
}

if (!is_array($items) || !$items) {
    json_error('Cart is empty');
}

$normalizedItems = [];
foreach ($items as $item) {
    $productId = (int) ($item['id'] ?? 0);
    $quantity = (int) ($item['quantity'] ?? 0);

    if ($productId <= 0 || $quantity <= 0) {
        json_error('Nieprawidłowe dane koszyka.');
    }

    $normalizedItems[] = [
        'id' => $productId,
        'quantity' => $quantity,
    ];
}

$conn = db();
ensure_order_tables($conn);

$conn->begin_transaction();

try {
    $products = [];

    foreach ($normalizedItems as $item) {
        $stmt = $conn->prepare('SELECT id, name, price, quantity FROM products WHERE id = ? FOR UPDATE');
        $stmt->bind_param('i', $item['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $product = $result->fetch_assoc();
        $stmt->close();

        if (!$product || (int) $product['quantity'] < $item['quantity']) {
            throw new RuntimeException('One of the products is no longer available in selected quantity');
        }

        $products[] = [
            'id' => (int) $product['id'],
            'name' => (string) $product['name'],
            'price' => (float) $product['price'],
            'quantity' => $item['quantity'],
        ];
    }

    $stmt = $conn->prepare('INSERT INTO orders (user_id, first_name, last_name, address, city, postal_code) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('isssss', $userId, $firstName, $lastName, $address, $city, $postalCode);
    $stmt->execute();
    $orderId = $stmt->insert_id;
    $stmt->close();

    $itemStmt = $conn->prepare('INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)');
    $stockStmt = $conn->prepare('UPDATE products SET quantity = quantity - ? WHERE id = ?');

    foreach ($products as $product) {
        $itemStmt->bind_param('iisdi', $orderId, $product['id'], $product['name'], $product['price'], $product['quantity']);
        $itemStmt->execute();

        $stockStmt->bind_param('ii', $product['quantity'], $product['id']);
        $stockStmt->execute();
    }

    $itemStmt->close();
    $stockStmt->close();

    $conn->commit();

    json_response([
        'success' => true,
        'message' => 'Order placed',
        'order_id' => $orderId,
    ], 201);
} catch (Throwable $exception) {
    $conn->rollback();
    json_error($exception->getMessage(), 400);
}
