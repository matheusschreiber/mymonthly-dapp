# Ideia

Factory de contrato para gerenciar pagamentos e datas de expiração/vencimento de serviços por assinatura.

## Vendedor

- [ ] O vendedor deve poder criar contratos para inscrições feitas por clientes em algum de seus serviços. Ex.: Netflix, GYM, Heatlh, Insurance, Newspaper, OpenAI, etc.

- [ ] Cada contrato filho é um serviço cadastrado por um vendedor, que contém os compradores que assinaram esse serviço.

## Comprador

- [ ] O contrato filho deve gerenciar pagamentos e datas e expiração. Isso deve ser visível para o comprador (identificado pela chave publica). O comprador deve conseguir:
    - [ ] Contratar nova assinatura
    - [ ] Pagar a assinatura existente
    - [ ] (BONUS) Cancelar a assinatura, recebendo reembolso parcial

- [ ] Os pagamentos são feitos em cryptomoedas (Seria apenas ETH por ser sepolia?).
- usar tokens inicialmente

- [ ] Caso o comprador não pague o serviço até a data de expiração, o acesso ao serviço é revogado. 
    - Events
    - [Chainlink Automations](https://chain.link/automation) ou outros serviços automatizados.
    - A atualização da permissão do comprador acontece quando ele acessa alguma página (alguma dashboard)

- [ ] O acesso ao serviço só é disponibilizado para o comprador mediante o pagamento do contrato. (Talvez usar NFTs aqui, que seria como uma credencial - ERC721)?

- [ ] (BONUS) Permitir reembolsos quando cancelada a assinatura ou descontos para pagamentos antecipados.

## Visualização Global

- [ ] (BONUS) Utilizar The Graph ou APIs blockchain para visualizar contratos de assinatura sem centralização.