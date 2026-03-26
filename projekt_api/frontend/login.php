<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="shortcut icon" href="img/logo-white.png" type="image/x-icon">
    <link rel="stylesheet" href="style3.css">
    <link rel="stylesheet" href="app.css">
</head>
<body>
    <header><img src="img/logo-black.png" alt="logo"><h1>Jaguar</h1></header>
    <main>
        <section class="login">
            <div>
                <h2>Log in</h2>
                <p>New user? <a href="register.php">Create account</a></p>
            </div>
            <hr>
            <div id="page-message" class="message hidden"></div>
            <form id="login-form">
                <input type="text" name="login" id="login" placeholder="Login" required>
                <input type="password" name="password" id="password" placeholder="Password" required>
                <button type="submit">Log in</button>
            </form>
        </section>
    </main>
    <script src="js/config.js"></script>
    <script type="module" src="js/login.js"></script>
</body>
</html>
