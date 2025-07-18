<?php
include 'phpClass/cadastroUsuario.class.php';

function cors() {
    
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
    
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
        exit(0);
    }
    
}
cors();

$resposta = [
    'status' => 'error',
    'message' => 'Método não permitido.'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['emailLogin'] ?? '';
    $senha = $_POST['senhaLogin'] ?? '';


    if (!$email || !$senha) {
        $resposta['message'] = 'Email e senha obrigatórios.';
        echo json_encode($resposta);
        exit;
    }

    $cadastro = new Cadastro();
    $usuario = $cadastro->listarUsuarios($email, $senha);

    if ($usuario) {
        session_start();
        $_SESSION['usuario_id'] = $usuario['id_usuario'];
        $_SESSION['usuario_nome'] = $usuario['nome'];

        $resposta['status'] = 'ok';
    } else {
        $resposta['message'] = '<p>Usuário ou senha incorretos.</p>';
    }
    echo json_encode($resposta);
    exit;
}

echo json_encode($resposta);
