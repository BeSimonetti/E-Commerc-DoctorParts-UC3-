// ---------------------- MÁSCARAS ----------------------
const cepInput = document.getElementById('cep');
const cepMask = IMask(cepInput, {
    mask: '00000-000',
});

if (cepInput) {
  cepMaskInstance = IMask(cepInput, { mask: '00000-000' });
}

const editarCepInput = document.getElementById('editar_cep');
if (editarCepInput) {
  editarCepMaskInstance = IMask(editarCepInput, { mask: '00000-000' });
}

const contatoInput = document.getElementById('editar_contato');
const contatoMask = IMask(contatoInput, {
    mask: '(00) 00000-0000'
});

const cpfInput = document.getElementById('editar_cpf');
const cpfMask = IMask(cpfInput, {
    mask: '000.000.000-00',
});

// ---------------------- ENTER COMO TAB ----------------------
document.addEventListener("keydown", function (e) {
    // Se for Enter e não for textarea nem botão
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && e.target.type !== "submit" && e.target.type !== "button") {
        e.preventDefault(); // impede submit

        // pega todos os campos de texto/inputs/textarea/select
        const inputs = Array.from(document.querySelectorAll("input, select, textarea"))
            .filter(el => el.type !== "hidden" && !el.disabled && el.offsetParent !== null);

        const index = inputs.indexOf(e.target);
        if (index > -1 && index < inputs.length - 1) {
            inputs[index + 1].focus(); // foca no próximo
        }
    }
});

// ---------------------- MODAIS ----------------------
function abrirPopupCadastroEndereco() {
    document.getElementById("popupCadastroEndereco").style.display = "flex";
}
function fecharPopupCadastroEndereco() {
    document.getElementById("popupCadastroEndereco").style.display = "none";
}
function abrirPopupConfirmacaoExcluirEndereco(id_endereco) {
    document.getElementById('enderecoIdExcluir').value = id_endereco;
    document.getElementById('popupConfirmExcluirEndereco').style.display = 'flex';
}
function fecharPopupConfirmacaoExcluirEndereco() {
    document.getElementById('popupConfirmExcluirEndereco').style.display = 'none';
}
function abrirPopupEditarDadosEndereco(endereco) {

    if (editarCepMaskInstance) {
        // Garante formatação mesmo que venha "12345678"
        editarCepMaskInstance.unmaskedValue = (endereco.cep || '').replace(/\D/g, '');
    } else {
        document.getElementById("editar_cep").value = endereco.cep || '';
    }

    document.getElementById("editar_id_endereco").value = endereco.id_endereco;
    document.getElementById("editar_cep").value = endereco.cep;
    document.getElementById("editar_numero").value = endereco.numero;
    document.getElementById("editar_rua").value = endereco.rua;
    document.getElementById("editar_bairro").value = endereco.bairro;
    document.getElementById("editar_cidade").value = endereco.cidade;
    document.getElementById("editar_estado").value = endereco.estado;
    document.getElementById("editar_complemento").value = endereco.complemento;
    document.getElementById("popupEditarDadosEndereco").style.display = "flex";
}
function fecharPopupEditarDadosEndereco() {
    document.getElementById("popupEditarDadosEndereco").style.display = "none";
}
function abrirPopupEditarDadosUsuario(usuario) {
    document.getElementById("editar_id_usuario").value = usuario.id_usuario;
    document.getElementById("editar_nome").value = usuario.nome;
    document.getElementById("editar_email").value = usuario.email;
    document.getElementById("editar_cpf").value = usuario.cpf;
    document.getElementById("editar_contato").value = usuario.contato;
    document.getElementById("popupEditarDadosUsuario").style.display = "flex";
    
}
function fecharPopupEditarDadosUsuario() {
    document.getElementById("popupEditarDadosUsuario").style.display = "none";
}

// ---------------------- VARIÁVEIS ----------------------
const formCadastroEndereco = document.getElementById('formCadastroEndereco');
const formEditarEndereco = document.getElementById('formEditarDadosEndereco');
const formEditarUsuario = document.getElementById('formEditarDadosUsuario');
const formExcluir = document.getElementById('confirmExcluirEndereco');
const mensagem = document.getElementById('mensagemRetorno');
let viaCepPronto = false;

// ---------------------- FUNÇÃO MENSAGEM ----------------------
function exibirMensagem(texto, tipo = 'success') {
    mensagem.innerHTML = texto;
    mensagem.style.display = 'block';
    mensagem.className = tipo === 'success' ? 'mensagem-sucesso' : 'mensagem-erro';
    setTimeout(() => { mensagem.style.display = 'none'; }, 2000);
}

// ---------------------- VIA CEP ----------------------
function aplicarBuscaCEP(campoCepId, campoRuaId, campoBairroId, campoCidadeId, campoEstadoId) {
    const cepInput = document.getElementById(campoCepId);
    const ruaInput = document.getElementById(campoRuaId);
    const bairroInput = document.getElementById(campoBairroId);
    const cidadeInput = document.getElementById(campoCidadeId);
    const estadoInput = document.getElementById(campoEstadoId);

    cepInput.addEventListener('blur', function () {
        const cep = this.value.replace(/\D/g, '');
        viaCepPronto = false;

        ruaInput.value = '';
        bairroInput.value = '';
        cidadeInput.value = '';
        estadoInput.value = '';

        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(r => r.json())
                .then(res => {
                    if (!res.erro) {
                        ruaInput.value = res.logradouro;
                        bairroInput.value = res.bairro;
                        cidadeInput.value = res.localidade;
                        estadoInput.value = res.uf;
                        viaCepPronto = true;
                    } else {
                        exibirMensagem('CEP não encontrado.', 'erro');
                    }
                })
                .catch(() => exibirMensagem('Erro ao buscar o CEP.', 'erro'));
        } else {
            exibirMensagem('CEP inválido.', 'erro');
        }
    });
}
aplicarBuscaCEP('cep', 'rua', 'bairro', 'cidade', 'estado');
aplicarBuscaCEP('editar_cep', 'editar_rua', 'editar_bairro', 'editar_cidade', 'editar_estado');

// ---------------------- CADASTRAR ENDEREÇO ----------------------
if (formCadastroEndereco) {
    formCadastroEndereco.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!viaCepPronto) {
            exibirMensagem("Informe um CEP válido antes de cadastrar.", "erro");
            return;
        }

        const dados = new URLSearchParams(new FormData(formCadastroEndereco));

        fetch(formCadastroEndereco.action, {
            method: 'POST',
            body: dados
        })
        .then(r => r.json())
        .then(res => {
            if (res.status === 'ok') {
                exibirMensagem(res.message || 'Endereço cadastrado com sucesso!');
                formCadastroEndereco.reset();
                setTimeout(() => location.reload(), 1500);
            } else {
                exibirMensagem(res.message || 'Erro ao cadastrar endereço.', 'erro');
            }
        })
        .catch(() => exibirMensagem('Erro ao enviar os dados.', 'erro'));
    });
}

// ---------------------- EDITAR ENDEREÇO ----------------------
if (formEditarEndereco) {
    formEditarEndereco.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!viaCepPronto) {
            exibirMensagem("Informe um CEP válido antes de salvar.", "erro");
            return;
        }

        const dados = new URLSearchParams(new FormData(formEditarEndereco));

        fetch(formEditarEndereco.action, {
            method: 'POST',
            body: dados
        })
        .then(r => r.json())
        .then(res => {
            if (res.status === 'ok') {
                exibirMensagem(res.message || 'Endereço atualizado com sucesso!');
                fecharPopupEditarDadosEndereco();
                setTimeout(() => location.reload(), 1500);
            } else {
                exibirMensagem(res.message || 'Erro ao atualizar endereço.', 'erro');
            }
        })
        .catch(() => exibirMensagem('Erro ao enviar os dados.', 'erro'));
    });
}
// ---------------------- EDITAR USUÁRIO ----------------------
if (formEditarUsuario) {
    formEditarUsuario.addEventListener('submit', function (e) {
        e.preventDefault();

        const dados = new URLSearchParams(new FormData(formEditarUsuario));

        fetch(formEditarUsuario.action, {
            method: 'POST',
            body: dados
        })
        .then(r => r.json())
        .then(res => {
            if (res.status === 'ok') {
                exibirMensagem(res.message || 'Dados do usuário atualizado com sucesso!');
                fecharPopupEditarDadosUsuario();
                setTimeout(() => location.reload(), 1500);
            } else {
                exibirMensagem(res.message || 'Erro ao atualizar dados do usuário.', 'erro');
            }
        })
        .catch(() => exibirMensagem('Erro ao enviar os dados.', 'erro'));
    });
}

// ---------------------- EXCLUIR ENDEREÇO ----------------------
if (formExcluir) {
    formExcluir.addEventListener('submit', function (e) {
        e.preventDefault();

        const dados = new URLSearchParams(new FormData(formExcluir));

        fetch(formExcluir.action, {
            method: 'POST',
            body: dados
        })
        .then(r => r.json())
        .then(res => {
            if (res.status === 'ok') {
                exibirMensagem(res.message || 'Endereço excluído com sucesso!');
                fecharPopupConfirmacaoExcluirEndereco();
                setTimeout(() => location.reload(), 1200);
            } else {
                exibirMensagem(res.message || 'Erro ao excluir o endereço.', 'erro');
            }
        })
        .catch(() => exibirMensagem('Erro ao excluir o endereço.', 'erro'));
    });
}

// ---------------------- TORNAR PADRÃO ----------------------
function tornarPadrao(id_endereco) {
    const dados = new URLSearchParams();
    dados.append('id_endereco', id_endereco);

    fetch('../../php/controllers/tornarPadrao.php', {
        method: 'POST',
        body: dados
    })
    .then(r => r.json())
    .then(res => {
        if (res.status === "ok") {
            exibirMensagem(res.message || "Endereço definido como padrão!");
            setTimeout(() => location.reload(), 1200);
        } else {
            exibirMensagem(res.message || "Erro ao definir padrão", "erro");
        }
    })
    .catch(() => exibirMensagem("Erro na requisição.", "erro"));
}

