window.onload = function () {
    const inputDescricao = document.getElementById('descricao');
    inputDescricao.value = '';
};

document.querySelector('.open-menu').addEventListener('click', e => {

    document.querySelector('header .menu').classList.add('open');

});

document.querySelector('.close-menu button').addEventListener('click', e => {

    document.querySelector('header .menu').classList.remove('open');

});

document.querySelector('.menu .backdrop').addEventListener('click', e => {

    document.querySelector('header .menu').classList.remove('open');

});


function enviar() {
    var modalAlerta = document.getElementById('modalAlerta');
    var tituloAlerta = document.getElementById('tituloAlerta');
    var mensagemAlerta = document.getElementById('mensagemAlerta');

    tituloAlerta.innerHTML = 'Atenção!';

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const descricao = document.getElementById('descricao').value;
    let inputRadio = null;

    if (nome == undefined || nome == null || nome == '') {
        mensagemAlerta.innerHTML = 'Por favor informe o nome.';
        modalAlerta.showModal();
        return;
    }
    if (email == undefined || email == null || email == '') {
        mensagemAlerta.innerHTML = 'Por favor informe o email.';
        modalAlerta.showModal();
        return;
    }
    if (descricao == undefined || descricao == null || descricao == '') {
        mensagemAlerta.innerHTML = 'Por favor informe a descrição.';
        modalAlerta.showModal();
        return;
    }

    var radios = document.getElementsByName('inputRadio');
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            inputRadio = (radios[i].value);
            break;
        }
    }

    if (inputRadio == undefined || inputRadio == null || inputRadio == '') {
        mensagemAlerta.innerHTML = 'Por favor informe escolha entre Desenvolvimento e Concultoria.';
        modalAlerta.showModal();
        return;
    }

    mensagemAlerta.innerHTML = 'Enviamos sua mensagem para o nosso time,<br> Em breve entraremos em contato com você.';
    modalAlerta.showModal();
}

function closeModalAlerta() {
    var modal = document.getElementById('modalAlerta');
    modal.close();
}