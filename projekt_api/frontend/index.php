<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jaguar</title>
    <link rel="shortcut icon" href="img/logo-white.png" type="image/x-icon">
    <link rel="stylesheet" href="style1.css">
    <link rel="stylesheet" href="app.css">
</head>
<body>
    <header><img src="img/logo-black.png" alt="logo"><h1>Jaguar</h1></header>
    <nav>
        <a href="index.php">Home</a>
        <form id="filter-form">
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
    <div id="loading" class="loading hidden">Ładowanie produktów...</div>
    <main id="products"></main>

    <script src="js/config.js"></script>
    <script type="module" src="js/index.js"></script>
</body>
</html>
