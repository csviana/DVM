## Objetivo:

Criar um ambiente virtual e tridimensional onde o usuário interaja por meio de seu Smartphone com os produtos disponíveis fisicamente próximos à sua localização, podendo ele explorar diversos recursos até que adquira o produto ofertado, como apresentações em fotos e vídeos, disponibilidade física dos produtos com o fornecedor, tempo médio para entrega, relato de compradores anteriores, preços e formas de pagamento.

<br />


### Produção do Front-end > [aqui](http://csviana.ddns.net)

>`
A produção do Front-end está em constante atualização e caso perceba algum erro, basta clicar no botão "Limpar", localizado na parte inferior esquerda da página.
`

<br />

### Produção da aplicação Android > [aqui](http://csviana.ddns.net/apk/remote.apk)

> `
Como a aplicação está sob desenvolvimento, ainda não foi publicada no Google Play Store, com isso é necessário habilitar a opção para instalar aplicativos de fontes desconhecidas.
`

<br />

### Repositório do desenvolvimento > [aqui](https://github.com/csviana/DVM)


<br />

### Desenvolvimento Back-end:

1. [X] Definir a plataforma de desenvolvimento: [NodeJS]()
2. [X] Definir o banco de dados a ser usado: [MongoDB]()
3. [X] Definir a API de comunicação Realtime: [Socket.IO]()
4. [X] Definir as rotas principais: [usuários](), [lojas](), [vendas](), [produtos]() e [funcões]()
5. [X] Desenvolver as funcionalidades básicas de acesso: [index.js]()
6. [ ] Definir o servidor de propagandas visuais

...

<br>

### Desenvolvimento Front-end:
1. [X] Definir as bibliotecas utilizadas: [Jquery]()
2. [X] Definir os frameworks utilizados: [Bootstrap]()
3. [X] Definir o método de armazenamento web: [localStorage]()
4. [X] Definir o CSS do Bootstrap: [routes/func/1.html]()
5. [X] Definir o CSS personalizado: [routes/func/2.html]()
6. [X] Definir a estrutura HTML5 da Homepage: [routes/func/3.html]()
7. [X] Definir a estrutura HTML5 do Root: [routes/func/4.html]()
8. [X] Definir as functions do Jquery: [routes/func/5.html]()
9. [X] Definir as functions do WebSocket: [routes/func/6.html]()
10. [X] Definir as functions do Bootstrap: [routes/func/7.html]()
11. [X] Definir as functions personalizadas: [routes/func/8.html]()
12. [ ] Definir o formulário para o cadastramento de usuários
13. [ ] Definir o formulário para o cadastramento de lojas
14. [ ] Definir o formulário para o cadastramento de vendas
15. [ ] Definir o formulário para o cadastramento de produtos
16. [ ] Definir o formulário para o cadastramento de funções
17. [ ] Definir o layout para o login de usuários via web
18. [X] Definir o layout para o mensageiro Realtime
19. [ ] Definir o mapa para geolocalização das rotas de entrega
20. [ ] Definir os métodos para pagamentos online

...

<br>

### Desenvolvimento Mobile:
1. [X] Scripts de comunicação com WebSocket
2. [X] Definir os controles de movimentação tridimensional
3. [X] Definir a função de mensageiro Realtime
4. [X] Configurar a interação de usuários Mobile com usuários Web
5. [ ] Ferramenta para estilização da loja: [Em desenvolvimento]()
6. [ ] Ferramenta para importação de produtos em 3D
7. [ ] Ferramenta para identificar usuários online dentro da loja
8. [ ] Ferramenta para expulsar/banir usuários das lojas
9. [ ] Ferramenta para mover usuário de ambiente
10. [ ] Ferramenta para realizar pagamento online
11. [ ] Ferramenta para visualizar compras realizadas
12. [ ] Ferramenta para visualizar vendas realizadas/pendentes
13. [ ] Ferramenta para visualizar rotas para entregas

...

<br>

#### **[Veja os Colaboradores](https://github.com/csviana/DVM/settings/collaboration)**

### Licença: MIT

<br />

### Política de Privacidade:
Para a funcionalidade do sistema, será necessário o armazenamento de informações pessoais, seguem abaixo as funções e os dados que serão necessariamente coletados:

#### Cadastro:
* Nome completo >  Apenas para utilização do mensageiro e serviço de entrega
* Definição do apelido único > Apenas para o acesso
* Definição da senha > Apenas para o acesso
* Endereço de e-mail > Apenas para a recuperação de acesso
* Endereço residencial > Apenas para o serviço de entrega
* Contato móvel > Apenas para validar o cadastro e confirmar o serviço de entrega
* Contato fixo > Apenas para validar o serviço de vendas
* Momento do cadastro > Apenas para aplicar bonificação
* IP do último acesso > Apenas para proteção de ataque hacker
* Momento do último acesso > Apenas para proteção de ataque hacker e geração relatórios de utilização.

`É fortemente recomendado que informações de cadastro não sejam repassadas a terceiros, exceto em caso de ação judicial, assim fortalecerá a credibilidade dos usuários com o sistema`

#### Compras:
* Produtos comprados
* Valores dos produtos
* Geolocalização > Importante para automatizar a validação do serviço de entrega
* Momento da compra
* Momento da entrega
* Classificação do serviço de entrega > Opcional
* Relato sobre a entrega > Opcional

`Apenas a classificação do serviço de entrega e relato sobre a entrega serão compartilhados com terceiros, com a finalidade de aprimorar os produtos e serviços ofertados no sistema. Já os dados dos cartões e contas bancárias não passarão sequer por este sistema, pois as validações de compras serão feitas pelas próprias operadoras de crédito. É extremamente importante informar que os usuários NUNCA forneçam dados pessoais fora do cadastro e dados de cartões só deverão ser fornecidos na ferramenta apropriada`


#### Conversas:
* Nenhuma conversa será armazenada em banco de dados, pois recomendamos a expressão individual nas comunicações e bloqueio automático de palavras de baixo calão.

`Contudo, se encontrado alguma mensagem ofensiva nas conversas, é recomendado o acionamento do suporte para a devida análise`

<br />

Achou algum problema na página?

Você pode checar a [documentação do GitHub](https://help.github.com/categories/github-pages-basics/) ou [entrar em contato comigo](https://www.facebook.com/cleirton.viana) para mais informações.