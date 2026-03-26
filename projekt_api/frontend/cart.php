<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cart</title>
    <link rel="shortcut icon" href="img/logo-white.png" type="image/x-icon">
    <link rel="stylesheet" href="style4.css">
    <link rel="stylesheet" href="app.css">
</head>
<body>
    <header><img src="img/logo-black.png" alt="logo"><h1>Jaguar</h1></header>
    <nav>
        <a href="index.php">Home</a>
        <form action="index.php" method="get">
            <select name="type" id="type-filter">
                <option value="all">All</option>
            </select>
            <input type="text" name="search" id="search-filter" placeholder="Search">
            <input type="submit" value="🔍">
        </form>
        <a href="listing.php">Create listing</a>
        <a href="cart.php" data-cart-count>🛒</a>
        <div class="spacer"></div>
        <div class="nav-user" data-user-area></div>
    </nav>

    <div id="page-message" class="message hidden"></div>

    <main id="cart-items"></main>
    <aside>
        <div class="summary-box">
            <h2>Price: <span id="cart-total">$0.00</span></h2>
            <form id="checkout-form">
                <input type="text" name="first_name" placeholder="First name" required>
                <br><br>
                <input type="text" name="last_name" placeholder="Last name" required>
                <br><br>
                <input type="text" name="address" placeholder="Address" required>
                <br><br>
                <input type="text" name="city" placeholder="City" required>
                <br><br>
                <input type="text" name="postal_code" placeholder="Postal code" required>
                <br><br>
                <button type="submit" class="primary">Buy</button>
            </form>
        </div>
    </aside>

    <script src="js/config.js"></script>
    <script type="module" src="js/cart.js"></script>
</body>
</html>
