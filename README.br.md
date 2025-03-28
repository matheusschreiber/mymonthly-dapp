
<p align="center">
    <img src="public/logo.png" height="100" alt="MyMonthly Logo">
    <br/><br/>
    <p align="center">
        Uma aplicação descentralizada para gerenciamento de serviços por assinatura como Netflix, Spotify e Disney+, utilizando contratos inteligentes para automatizar pagamentos, renovações e controle de acesso de forma segura e transparente.
    </p>
</p>

## Ideia

Factory de contratos para gerenciamento pagamentos e datas de expiração/vencimento de serviços por assinatura.

![diagram](public/diagram.png)

## Descrição

### Domínio e motivação

O domínio da aplicação é o setor de gerenciamento de serviços por assinatura. O problema abordado é a complexa rede de gerenciamento de pagamentos recorrentes e controle de acesso, que atualmente depende de intermediários centralizados e processos manuais. Alguns dos principais problemas desse procedimento incluem:

1. Contestações de Cobrança e Falta de Transparência
Os sistemas de pagamento tradicionais permitem que os usuários contestem cobranças, resultando em processos longos e custosos para as empresas. Com a blockchain, todas as transações são imutáveis e transparentes, fornecendo provas verificáveis de pagamento e reduzindo disputas.

2. Taxas Elevadas de Transação com Processadores Tradicionais
Empresas como Netflix e Spotify pagam altas taxas para processadores de pagamento como Visa e Mastercard. As transações em blockchain eliminam intermediários, reduzindo significativamente os custos e aumentando a lucratividade.

3. Complexidade e Custo de Pagamentos Internacionais
O processamento de pagamentos internacionais envolve conversões de moeda e tarifas bancárias, tornando o processo caro e complexo. As criptomoedas permitem pagamentos rápidos e sem fronteiras, com taxas mínimas, simplificando as assinaturas globais.

4. Privacidade e Segurança dos Dados Pessoais
Os pagamentos tradicionais exigem dados financeiros e pessoais sensíveis, aumentando o risco de fraudes e vazamentos de informações. Os pagamentos baseados em blockchain preservam a privacidade do usuário, eliminando a necessidade de fornecer informações pessoais e aumentando a segurança.

Com isso em mente, este projeto propõe uma solução descentralizada baseada em contratos inteligentes, automatizando pagamentos, renovações e revogações de acesso sem a necessidade de confiança em terceiros. Ao utilizar automações e pagamentos em criptomoedas, a plataforma garante transparência, segurança e eficiência para vendedores e assinantes.

### Contract Factory

O conceito de Contract Factory será utilizado para permitir que cada vendedor crie e gerencie múltiplos contratos de assinatura de forma eficiente e descentralizada. A Factory atuará como um contrato mestre responsável por implantar novos contratos filhos sempre que um vendedor registrar um novo serviço (Netflix, OpenAI, SmartFit, Jornais por assinatura, planos de saúde, seguros de vida, seguros de automóveis, etc).

Cada contrato filho pertencerá a um desses vendedores (Netflix por exemplo), e então neste contrato haverá o controle dos assinantes, das datas de vencimento e dos estados atuais de cada assinatura.

### Eventos

O conceito de Events será utilizado para registrar e monitorar ações importantes dentro dos contratos inteligentes, permitindo que interfaces e serviços externos, reajam automaticamente às mudanças no estado da assinatura. 

Por exemplo, se houver o pagamento, deve-se renovar a data de expiração da assinatura e então atualizar no front-end da aplicação. O mesmo acontece caso a assinatura seja cancelada ou sua data de vencimento seja extrapolada.

## Regras de negócio

### Vendedor

- [x] O vendedor deve poder criar contratos para inscrições feitas por clientes em algum de seus serviços. Ex.: Netflix, GYM, Heatlh, Insurance, Newspaper, OpenAI, etc.

- [x] Cada contrato filho é um serviço cadastrado por um vendedor, que contém os compradores que assinaram esse serviço.

- [x] O vendedor deve poder alterar o nome e a descrição do serviço após a sua criação.

- [x] Os nomes dos serviços devem ser únicos (sem repetição).

### Comprador

- [x] O contrato filho deve gerenciar pagamentos e datas de expiração. Isso deve ser visível para o comprador (identificado pela chave pública). O comprador deve conseguir:
    - [x] Contratar nova assinatura
    - [x] Pagar a assinatura existente
    - [x] Cancelar a assinatura
- [ ] (BÔNUS) Reembolso parcial ao cancelar

- [x] Os pagamentos são feitos em criptomoedas (ETH).

- [x] Caso o comprador não pague o serviço até a data de expiração, o acesso ao serviço é revogado.
    - Events

- [ ] (BÔNUS) Mecanismos para o update periódico
    - [Chainlink Automations](https://chain.link/automation) ou outros serviços automatizados.
    - A atualização da permissão do comprador acontece quando ele acessa alguma página (alguma dashboard).

- [ ] (BÔNUS) Permitir reembolsos quando a assinatura for cancelada ou descontos para pagamentos antecipados.

### Visualização Global

- [ ] (BÔNUS) Utilizar The Graph ou APIs blockchain para visualizar contratos de assinatura sem centralização.

## Configuração

Primeiramente, instale as dependências:
```
npm install
```

### Deploy local

Para realizar o deploy local do contrato, siga os passos:

**1. Altere o provider no `.env`**
```
VITE_LOCAL_PROVIDER_ENABLED='true'
```

**2. Limpe os artefatos do Hardhat e inicie o nó worker (mantenha-o em execução)**
```
npx hardhat clean && npx hardhat node
```

**3. Faça o deploy do contrato da fábrica localmente**
```
npx hardhat run --network localhost scripts/deploy.cjs
```
>Obs.: Salve o endereço do contrato

**4. Execute o servidor Vite**
```
npm run dev
```

**5. Conecte o contrato implantado**

Na página inicial (`http://localhost:5173/`) há um botão para isso

>Obs.: Para os ABIs, você pode inserir qualquer valor. Não importa no deploy local.

### Deploy com Metamask

Para o deploy real do contrato, siga:

**1. Altere o provider no `.env`**
```
VITE_LOCAL_PROVIDER_ENABLED='false'
```

**2. Faça o deploy do contrato da fábrica em qualquer plataforma**

Recomendação: [REMIX IDE](https://remix.ethereum.org/) 
>Obs.: Salve o endereço do contrato e os ABIs (Interface Binária de Aplicação) dos contratos ServiceFactory.sol e Service.sol

**3. Execute o servidor Vite**
```
npm run dev
```

**4. Conecte a carteira Metamask**

Na página inicial (`http://localhost:5173/`) há um botão para isso

**5. Use**

Aproveite o MyMonthly

## Testes

Para rodar os testes:

```
npx mocha 
```