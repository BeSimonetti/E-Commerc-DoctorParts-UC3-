<?php
session_start();
include 'phpClass/cadastroUsuario.class.php';

// Verifica se o usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    // Redireciona para a tela principal se não estiver logado
    header('Location: index.php');
    exit;
}

$usuarioLogadoId = $_SESSION['usuario_id'];

$a = new Usuario();
$usuario = $a->selectUsuarioId($usuarioLogadoId);

?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Seus Dados</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/styleAreaUsuario.css">

</head>
<body>
    <header>
        <nav class="menu">
            <!-- Company logo -->
            <div class="logo">
                <img src="../../assets/images/logo.png" alt="Company logo" id="logo" />
            </div>

            <!-- Navigation links -->
            <ul class="nav-links">
                <li><a href="#">Início</a></li>
                <li><a href="#">Sobre</a></li>
                <li><a href="#">Serviços</a></li>
                <li><a href="#">Contato</a></li>
            </ul>

            <!-- Search bar -->
            <div id="divBusca">
                <input type="text" id="txtBusca" placeholder="Buscar..." />
                <img src="../../assets/images/lupa.jpg" width="20px" height="20px" id="btnBusca" alt="Search" />
            </div>

            <!-- User login/register -->
            <div class="user-access">
                <?php if ($usuario): ?>
                    <span>Bem-vindo, <a href="dadosUsuario.php"><?= htmlspecialchars($usuario['nome']) ?></a>!</span> | 
                    <a href="logout.php">Sair</a>
                <?php else: ?>
                    <a href="javascript:void(0)" onclick="abrirPopupLogin()">Entre</a> ou 
                    <a href="javascript:void(0)" onclick="abrirPopupCadastro()">Cadastre-se</a>
                <?php endif; ?>
            </div>

            <!-- Shopping cart icon -->
            <div id="divCarrinho">
                <img src="../../assets/images/carrinho.jpg" width="30px" height="30px" alt="Cart" />
            </div>
        </nav>
    </header>
    <div class="container">
        <div class="mini-menu">
            <div class="item-mini-menu">
                <a href="dadosUsuario.php">Meus Dados</a>
            </div>
            <div class="item-mini-menu">
                <a href="historicoComprasUsuario.php">Pedidos</a>
            </div>
        </div> 
    </div>
    <!-- Website footer -->
    <footer>
        <div class="footer">
            <!-- Contact section -->
            <div class="contato">
                <p><img src="../../assets/images/whatsapp.png" alt="" id="imagem-contato" />WhatsApp: 54 99269-0769</p>
                <p><img src="../../assets/images/telefone.png" alt="" id="imagem-contato" />Phone: 54 99262-0769</p>
            </div>

            <!-- Social media -->
            <div class="contato">
                <p><img src="../../assets/images/intagram.png" alt="" id="imagem-contato" />Instagram: DoctorParts</p>
                <p><img src="../../assets/images/facebook.png" alt="" id="imagem-contato" />Facebook: DoctorParts</p>
            </div>

            <!-- About section -->
            <div class="footer-descricao">
                <h2>About Us</h2>
                <p>180 years delivering the wrong parts, experts at late delivery with a small variety of brands.</p>
                <p>&copy; 2025 Company Name | All rights reserved</p>
            </div>
        </div>
    </footer>
</body>
</html>
