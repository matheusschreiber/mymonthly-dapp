# MyMonthly

## Ideia

Factory de contrato para gerenciamento pagamentos e datas de expiração/vencimento de serviços por assinatura.

## Descrição

### Domínio e motivação

O domínio da aplicação é o setor de gerenciamento de serviços por assinatura. O problema a ser resolvido aqui, é a complexa rede de gerenciamento de pagamentos recorrentes e controle de acessos, que atualmente depende de intermediários centralizados e processos manuais. A DApp propõe uma solução descentralizada baseada em contratos inteligentes, automatizando pagamentos, renovações e revogações de acesso sem a necessidade de confiança em terceiros. Utilizando Chainlink Automation, NFTs como credenciais e pagamentos em criptomoedas, a plataforma garante transparência, segurança e eficiência para vendedores e assinantes.

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

### Comprador

- [ ] O contrato filho deve gerenciar pagamentos e datas e expiração. Isso deve ser visível para o comprador (identificado pela chave publica). O comprador deve conseguir:
    - [x] Contratar nova assinatura
    - [x] Pagar a assinatura existente
    - [x] Cancelar a assinatura
    - [ ] (BONUS) Reembolso parcial ao cancelar

- [ ] Os pagamentos são feitos em cryptomoedas (Seria apenas ETH por ser sepolia?).
- usar tokens inicialmente

- [ ] Caso o comprador não pague o serviço até a data de expiração, o acesso ao serviço é revogado. 
    - Events
    - [Chainlink Automations](https://chain.link/automation) ou outros serviços automatizados.
    - A atualização da permissão do comprador acontece quando ele acessa alguma página (alguma dashboard)

- [ ] O acesso ao serviço só é disponibilizado para o comprador mediante o pagamento do contrato. (Talvez usar NFTs aqui, que seria como uma credencial - ERC721)?

- [ ] (BONUS) Permitir reembolsos quando cancelada a assinatura ou descontos para pagamentos antecipados.

### Visualização Global

- [ ] (BONUS) Utilizar The Graph ou APIs blockchain para visualizar contratos de assinatura sem centralização.