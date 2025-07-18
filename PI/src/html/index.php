<?php
session_start();
$usuarioLogado = $_SESSION['usuario_nome'] ?? null;
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <title>Carrossel com Descrições</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Link to external CSS and JavaScript -->
    <link rel="stylesheet" href="../css/style.css">
</head>

<body>
    <?php if (isset($_SESSION['usuario_nome'])): ?>
        <h2>Bem-vindo, <?= htmlspecialchars($_SESSION['usuario_nome']) ?>!</h2>
        <a href="php/logout.php">Sair</a>
    <?php else: ?>
        <h2>Login</h2>

        <?php if (isset($_GET['erro'])): ?>
            <p style="color:red;">Usuário ou senha incorretos!</p>
        <?php endif; ?>

        <form action="php/validarLogin.php" method="POST">
            <label for="emailLogin">Email:</label>
            <input type="email" name="emailLogin" id="emailLogin" required><br><br>

            <label for="senhaLogin">Senha:</label>
            <input type="password" name="senhaLogin" id="senhaLogin" required><br><br>

            <button type="submit">Entrar</button>
        </form>
    <?php endif; ?>
    <!-- Fixed header with navigation menu -->
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
                <a href="javascript:void(0)" onclick="abrirPopupLogin()">Entre</a> ou <a href="javascript:void(0)" onclick="abrirPopupCadastro()">Cadastre-se</a>
            </div>

            <!-- Shopping cart icon -->
            <div id="divCarrinho">
                <img src="../../assets/images/carrinho.jpg" width="30px" height="30px" alt="Cart" />
            </div>
        </nav>
    </header>

    <!-- Product carousel section -->
    <div class="carrossel">
        <div class="carrossel-wrapper" style="display: flex; align-items: center;">
            <!-- Left navigation button -->
            <div class="botoes">
                <button class="botao-carrosel esquerda" onclick="voltar()">←</button>
            </div>

            <!-- Carousel slides container -->
            <div style="overflow-x: hidden;">
                <div class="slides" id="slides">
                    <!-- Each product slide -->
                    <div class="slide">
                        <img src="../../assets/images/bauletoBraz5Adventure56LPreto.png" alt="Slide 1">
                        <div class="descricao">Produto 1 - R$ 29,90</div>
                        <button class="botao-carrinho">Adicionar ao carrinho</button>
                    </div>
                    <div class="slide">
                        <img src="../../assets/images/capaceteHJC.jpg" alt="Slide 2">
                        <div class="descricao">Produto 2 - R$ 39,90</div>
                        <button class="botao-carrinho">Adicionar ao carrinho</button>
                    </div>
                    <div class="slide">
                        <img src="../../assets/images/escapeGSX-R1000.jpg" alt="Slide 3">
                        <div class="descricao">Produto 3 - R$ 49,90</div>
                        <button class="botao-carrinho">Adicionar ao carrinho</button>
                    </div>
                    <div class="slide">
                        <img src="../../assets/images/espelhoRisomaTriangular.png" alt="Slide 4">
                        <div class="descricao">Produto 4 - R$ 59,90</div>
                        <button class="botao-carrinho">Adicionar ao carrinho</button>
                    </div>
                    <div class="slide">
                        <img src="../../assets/images/guidaoRenthal.jpg" alt="Slide 5">
                        <div class="descricao">Produto 5 - R$ 69,90</div>
                        <button class="botao-carrinho">Adicionar ao carrinho</button>
                    </div>
                    <div class="slide">
                        <img src="../../assets/images/jaquetaAlpineStar.png" alt="Slide 6">
                        <div class="descricao">Produto 6 - R$ 79,90</div>
                        <button class="botao-carrinho">Adicionar ao carrinho</button>
                    </div>
                </div>
            </div>

            <!-- Right navigation button -->
            <div class="botoes">
                <button class="botao-carrosel direita" onclick="avancar()">→</button>
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

    <!-- Registration modal PopUp-->
    <div id="popupCadastro" class="modal">
        <div class="modal-conteudo">
            <!-- Close button -->
            <span class="fechar" onclick="fecharPopupCadastro()">&times;</span>
            <h2>Cadastro</h2>
            <!-- Registration form -->
            <form id="formCadastro" action="../php/inserirCadastro.php" method="POST">
                <div class="input-modal">   
                    <input type="text" id="nome" name="nome" required placeholder="Insira seu nome completo">
                </div>
                <div class="input-modal">
                    <input type="email" id="email" name="email" required placeholder="Insira seu e-mail">
                </div>
                <div class="input-modal">
                    <input type="tel" id="contato" name="contato" required placeholder="(XX) XXXXX-XXXX">
                </div>
                <div class="input-modal">
                    <input type="password" id="senha" name="senha" required placeholder="Insira sua senha">
                </div>
                <button type="submit" >Register</button>
            </form>
        </div>
    </div>
    <!-- Login PopUp -->
    <div id="popupLogin" class="modal">
        <div class="modal-conteudo">
            <span class="fechar" onclick="fecharPopupLogin()">&times;</span>
            <h2>Login</h2>
            <form id="formLogin" action="../php/validarLogin.php" method="POST">
                <div class="input-modal">
                    <input type="email" id="emailLogin" name="emailLogin" required placeholder="Insira seu e-mail">
                </div>
                <div class="input-modal">
                    <input type="password" id="senhaLogin" name="senhaLogin" required placeholder="Insira sua senha">
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
    <!-- Successfully message -->
    <div id="mensagemRetorno" class="mensagem-sucesso" ></div>
    <script src="../js/script.js" defer></script>
    <script src="https://unpkg.com/imask"></script>
</body>

</html>
