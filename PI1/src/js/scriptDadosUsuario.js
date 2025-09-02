// Open registration modal
function abrirPopupCadastroEndereco() {
    document.getElementById("popupCadastroEndereco").style.display = "flex";
}

// Close registration modal
function fecharPopupCadastroEndereco() {
    document.getElementById("popupCadastroEndereco").style.display = "none";
}

const formCadastroEndereco = document.getElementById('formCadastroEndereco');
const mensagem = document.getElementById('mensagemRetorno');

//PRECISA INCLUIR API DO CEP PARA O ENDEREÇO FUNCIONAR
document.getElementById('cep').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '');

    // Sempre limpar os campos antes de tentar preencher
    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';


    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(res => {
                if (!res.erro) {
                    document.getElementById('rua').value = res.logradouro;
                    document.getElementById('bairro').value = res.bairro;
                    document.getElementById('cidade').value = res.localidade;
                    document.getElementById('estado').value = res.uf;

                } else {
                    exibirMensagem('CEP não encontrado.', 'erro');
                }
            })
            .catch(() => {
                exibirMensagem('Erro ao buscar o CEP.', 'erro');
            });
    } else {
        exibirMensagem('CEP inválido.', 'erro');
    }
});

let viaCepPronto = false; // indica se o CEP já preencheu os campos

// Função genérica para aplicar API ViaCEP
function aplicarBuscaCEP(campoCepId, campoRuaId, campoBairroId, campoCidadeId, campoEstadoId) {
    const cepInput = document.getElementById(campoCepId);
    const ruaInput = document.getElementById(campoRuaId);
    const bairroInput = document.getElementById(campoBairroId);
    const cidadeInput = document.getElementById(campoCidadeId);
    const estadoInput = document.getElementById(campoEstadoId);

    cepInput.addEventListener('blur', function () {
        const cep = this.value.replace(/\D/g, '');

        // Limpa os campos antes de buscar
        ruaInput.value = '';
        bairroInput.value = '';
        cidadeInput.value = '';
        estadoInput.value = '';

        viaCepPronto = false; // reset enquanto busca

        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(res => {
                    if (!res.erro) {
                        ruaInput.value = res.logradouro;
                        bairroInput.value = res.bairro;
                        cidadeInput.value = res.localidade;
                        estadoInput.value = res.uf;
                        viaCepPronto = true; // preenchimento concluído
                    } else {
                        exibirMensagem('CEP não encontrado.', 'erro');
                    }
                })
                .catch(() => {
                    exibirMensagem('Erro ao buscar o CEP.', 'erro');
                });
        } else {
            exibirMensagem('CEP inválido.', 'erro');
        }
    });
}

// Chama a função para seu formulário
aplicarBuscaCEP('cep', 'rua', 'bairro', 'cidade', 'estado');
// Chama a função para o formulário de edição
aplicarBuscaCEP('editar_cep', 'editar_rua', 'editar_bairro', 'editar_cidade', 'editar_estado'); // edição

formCadastroEndereco.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('id_usuario', formCadastroEndereco.id_usuario.value);
    formData.append('cep', formCadastroEndereco.cep.value);
    formData.append('rua', formCadastroEndereco.rua.value);
    formData.append('numero', formCadastroEndereco.numero.value);
    formData.append('bairro', formCadastroEndereco.bairro.value);
    formData.append('cidade', formCadastroEndereco.cidade.value);
    formData.append('estado', formCadastroEndereco.estado.value);
    formData.append('complemento', formCadastroEndereco.complemento.value);

    fetch(formCadastroEndereco.action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
    .then(response => response.json())
    .then(res => {
        console.log(res);
        if (res.status === 'ok') {
            exibirMensagem(res.message || 'Endereço cadastrado com sucesso!');
            formCadastroEndereco.reset();

            // Aguarda 2 segundos e recarrega a página
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            exibirMensagem(res.message || 'Erro ao cadastrar endereço.', 'erro');
        }
    })
    .catch(() => {
        exibirMensagem('Erro ao enviar os dados.', 'erro');
    });
});

// Abre o popup e seta o id no input hidden
function abrirPopupConfirmacaoExcluirEndereco(id_endereco) {
    console.log("ID recebido no modal:", id_endereco);
    document.getElementById('enderecoIdExcluir').value = id_endereco;
    document.getElementById('popupConfirmExcluirEndereco').style.display = 'flex';
}

// Fecha o popup
function fecharPopupConfirmacaoExcluirEndereco() {
    document.getElementById('popupConfirmExcluirEndereco').style.display = 'none';
}

// Listener para o form de exclusão
const formExcluir = document.getElementById('confirmExcluirEndereco');

formExcluir.addEventListener('submit', function (e) {
    e.preventDefault();

    const id = document.getElementById('enderecoIdExcluir').value;
    if (!id) {
        exibirMensagem('ID do endereço não informado.', 'erro');
        return;
    }
    console.log('Excluindo endereço ID:', id);

    const formData = new URLSearchParams();
    formData.append('id_endereco', id);

    fetch(formExcluir.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    })
    .then(r => r.json())
    .then(res => {
        if (res.status === 'ok') {
        exibirMensagem(res.message || 'Endereço excluído com sucesso!');
        fecharPopupConfirmacaoExcluirEndereco();
        setTimeout(() => location.reload(), 1200);
        } else {
        exibirMensagem(res.message || 'Erro ao excluir o endereço', 'erro');
        }
    })
    .catch(() => exibirMensagem('Erro ao excluir o endereço', 'erro'));
});

function abrirPopupEditarDadosEndereco(endereco) {
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

// Fechar modal
function fecharPopupEditarDadosEndereco() {
    document.getElementById("popupEditarDadosEndereco").style.display = "none";
}


const formEditarEndereco = document.getElementById('formEditarDadosEndereco');

if (formEditarEndereco) {

    // Função para enviar os dados do endereço via fetch
    function enviarDadosEndereco() {
        const formData = new URLSearchParams();
        formData.append('id_endereco', formEditarEndereco.id_endereco.value);
        formData.append('id_usuario', formEditarEndereco.id_usuario.value);
        formData.append('cep', formEditarEndereco.cep.value);
        formData.append('numero', formEditarEndereco.numero.value);
        formData.append('rua', formEditarEndereco.rua.value);
        formData.append('bairro', formEditarEndereco.bairro.value);
        formData.append('cidade', formEditarEndereco.cidade.value);
        formData.append('estado', formEditarEndereco.estado.value);
        formData.append('complemento', formEditarEndereco.complemento.value);

        fetch(formEditarEndereco.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        })
        .then(response => response.json())
        .then(res => {
            if (res.status === 'ok') {
                exibirMensagem(res.message || 'Endereço atualizado com sucesso!');
                fecharPopupEditarDadosEndereco();
                setTimeout(() => { location.reload(); }, 1500);
            } else {
                exibirMensagem(res.message || 'Erro ao atualizar endereço.', 'erro');
            }
        })
        .catch(() => {
            exibirMensagem('Erro ao enviar os dados.', 'erro');
        });
    }

    // Previne submit padrão do form
    formEditarEndereco.addEventListener('submit', function(e) {
        e.preventDefault();
    });

    // Função para buscar CEP via ViaCEP
    function buscarCEP() {
        const cepInput = document.getElementById('cep');
        const ruaInput = document.getElementById('rua');
        const bairroInput = document.getElementById('bairro');
        const cidadeInput = document.getElementById('cidade');
        const estadoInput = document.getElementById('estado');

        function preencherEndereco() {
            const cep = cepInput.value.replace(/\D/g, '');
            ruaInput.value = '';
            bairroInput.value = '';
            cidadeInput.value = '';
            estadoInput.value = '';

            if (cep.length === 8) {
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(res => res.json())
                    .then(data => {
                        if (!data.erro) {
                            ruaInput.value = data.logradouro;
                            bairroInput.value = data.bairro;
                            cidadeInput.value = data.localidade;
                            estadoInput.value = data.uf;
                        } else {
                            exibirMensagem('CEP não encontrado.', 'erro');
                        }
                    })
                    .catch(() => {
                        exibirMensagem('Erro ao buscar o CEP.', 'erro');
                    });
            } else {
                exibirMensagem('CEP inválido.', 'erro');
            }
        }

        // Blur normal
        cepInput.addEventListener('blur', preencherEndereco);

        // Enter no campo CEP preenche sem enviar
        cepInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                preencherEndereco();
                // Move para o próximo campo após preencher
                const inputs = Array.from(formEditarEndereco.querySelectorAll('input'));
                const index = inputs.indexOf(cepInput);
                if (index < inputs.length - 1) inputs[index + 1].focus();
            }
        });
    }

    buscarCEP();

    // Enter funciona como Tab em todos os inputs
    const inputs = Array.from(formEditarEndereco.querySelectorAll('input'));
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Foca no próximo input ou no botão salvar se for o último
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    formEditarEndereco.querySelector('button[type="submit"]').focus();
                }
            }
        });
    });

    // Envio apenas com botão Salvar
    const btnSalvar = formEditarEndereco.querySelector('button[type="submit"]');
    btnSalvar.addEventListener('click', function(e) {
        e.preventDefault();
        enviarDadosEndereco();
    });

}



function tornarPadrao(id_endereco) {
    const formData = new URLSearchParams();
    formData.append('id_endereco', id_endereco);

    fetch('../../php/controllers/tornarPadrao.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
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


function exibirMensagem(texto, tipo = 'success') {
    mensagem.innerHTML = texto;
    mensagem.style.display = 'block';
    mensagem.className = tipo === 'success' ? 'mensagem-sucesso' : 'mensagem-erro';
    setTimeout(() => {
        mensagem.style.display = 'none';
    }, 2000);
}

const cepInput = document.getElementById('cep');
const cepMask = IMask(cepInput, {
    mask: '00000-000',
});