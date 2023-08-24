<?php
// Passando os dados obtidos pelo formulário para as variáveis abaixo

$email    = trim($_POST['email']);

$emaildestinatario = 'contato@autoescolalago.com.br, felipe@empresarialweb.com.br'; // Digite seu e-mail aqui, lembrando que o e-mail deve estar em seu servidor web

$curso       	= $_POST['curso'];

$data      	    = $_POST['data'];

$indicado            = $_POST['indicado'];

$conheceu          = $_POST['conheceu'];

$nome          = $_POST['nome'];

$telefone          = $_POST['telefone'];

if(empty($nome) || empty($telefone) || empty($email)){ 

// Página que será redirecionada caso os campos estejam em branco

echo "<script>location.href='erro.html'</script>"; 

}
else {

$assunto          = "CONTATO - SITE - LAGO";

 /* Montando a mensagem a ser enviada no corpo do e-mail. */

$mensagemHTML = "<P>CONTATO - SITE - LAGO</P>

<p><b>Nome:</b> $nome

<p><b>E-Mail:</b> $email

<p><b>Telefone:</b> $telefone

<p><b>Assunto:</b> $assunto

<p><b>Mensagem:</b> $nome</p> está interessado no curso de </b> $curso</p>, pretende começar no mês de $data e conheceu a autoescola por </b> $conheceu</p>.
Foi indicado? </b> $indicado</p>

<hr>";

// O remetente deve ser um e-mail do seu domínio conforme determina a RFC 822.

// O return-path deve ser ser o mesmo e-mail do remetente.

$headers = "MIME-Version: 1.1\r\n";

$headers .= "Content-type: text/html; charset=UTF-8\r\n";

$headers .= "From: $email\r\n"; // remetente

$headers .= "Return-Path: $emaildestinatario \r\n"; // return-path

$envio = mail($emaildestinatario, $assunto, $mensagemHTML, $headers); 
 

 if($envio)

echo "<script>location.href='sucesso.html'</script>"; // Página que será redirecionada

}
?>

