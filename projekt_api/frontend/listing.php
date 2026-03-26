<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create listing</title>
    <link rel="shortcut icon" href="img/logo-white.png" type="image/x-icon">
    <link rel="stylesheet" href="style5.css">
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
    <main>
        <form id="listing-form" enctype="multipart/form-data">
            <h1>List an Item</h1>
            <div id="page-message" class="message hidden"></div>

            <label for="name">Name:</label>
            <input type="text" name="name" id="name" required>

            <label for="description">Description:</label>
            <textarea name="description" id="description" cols="30" rows="3" required></textarea>

            <label for="price">Price:</label>
            <input type="number" name="price" id="price" min="1" value="1" required>

            <label for="quantity">Quantity:</label>
            <input type="number" name="quantity" id="quantity" min="1" value="1" required>

            <label for="type">Category:</label>
            <select name="type" id="type"></select>

            <label for="newtype">Or create new category:</label>
            <input type="text" name="newtype" id="newtype">

            <label for="img">Product Image:</label>
            <input type="file" name="img" id="img" accept="image/png, image/jpeg, image/jpg" required>

            <button type="submit">Confirm Listing</button>
        </form>
    </main>

    <script src="js/config.js"></script>
    <script type="module" src="js/listing.js"></script>
</body>
</html>
