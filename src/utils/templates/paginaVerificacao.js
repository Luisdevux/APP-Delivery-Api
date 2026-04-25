export const templateSucessoVerificacao = (urlApp) => `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verificado</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f3f4f6;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      text-align: center;
    }
    .container {
      background-color: #ffffff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      width: 90%;
      max-width: 400px;
    }
    h1 {
      color: #10b981;
      margin-bottom: 20px;
    }
    p {
      color: #6b7280;
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 30px;
    }
    .btn {
      display: inline-block;
      background-color: #ef4444;
      color: white;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      transition: background-color 0.3s;
    }
    .btn:hover {
      background-color: #dc2626;
    }
    .icon {
      width: 64px;
      height: 64px;
      background-color: #d1fae5;
      color: #10b981;
      border-radius: 50%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">✓</div>
    <h1>Email Verificado!</h1>
    <p>Sua conta foi ativada com sucesso. Você já pode retornar ao aplicativo e fazer o login.</p>
    <a href="${urlApp}" class="btn">Voltar para o Aplicativo</a>
  </div>
</body>
</html>
`;

export const templateErroVerificacao = (mensagemErro, urlApp) => `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Falha na Verificação</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f3f4f6;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      text-align: center;
    }
    .container {
      background-color: #ffffff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      width: 90%;
      max-width: 400px;
    }
    h1 {
      color: #ef4444;
      margin-bottom: 20px;
    }
    p {
      color: #6b7280;
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 30px;
    }
    .btn {
      display: inline-block;
      background-color: #6b7280;
      color: white;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      transition: background-color 0.3s;
    }
    .btn:hover {
      background-color: #4b5563;
    }
    .icon {
      width: 64px;
      height: 64px;
      background-color: #fee2e2;
      color: #ef4444;
      border-radius: 50%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">✕</div>
    <h1>Ops, falha na verificação</h1>
    <p>${mensagemErro}</p>
    <a href="${urlApp}" class="btn">Retornar ao Aplicativo</a>
  </div>
</body>
</html>
`;