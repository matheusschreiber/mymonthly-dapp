# Idea

Factory de contrato para gerenciar pagamentos e datas de expiração de serviços por assinatura.

## Vendedor

- [ ] O vendedor deve poder criar contratos para inscrições feitas por clientes em algum de seus serviços. Ex.: Netflix, GYM, Heatlh, Insurance, Newspaper, OpenAI, etc.

- [ ] Cada contrato filho é um serviço cadastrado por um vendedor, que contém os compradores que assinaram esse serviço.

## Comprador

- [ ] O contrato filho deve gerenciar pagamentos e datas e expiração. Isso deve ser visível para o comprador (identificado pela chave publica). O comprador deve conseguir:
    - [ ] Comprar nova assinatura
    - [ ] Pagar a assinatura existente
    - [ ] Cancelar a assinatura, recebendo reembolso parcial
    - [ ] (BONUS) Calcular pagamentos atrasados usando juros

- [ ] Os pagamentos são feitos em cryptomoedas (Seria apenas ETH por ser sepolia?).

- [ ] Caso o comprador não pague o serviço até a data de expiração, o acesso ao serviço é revogado. (Chainlink Keepers ou Gelato? Outros serviços automatizados?)

- [ ] O acesso ao serviço só é disponibilizado para o comprador mediante o pagamento do contrato. (Talvez usar NTFs aqui, que seria como uma credencial) ERC721?

- [ ] (BONUS) Permitir reembolsos quando cancelada a assinatura ou descontos para pagamentos antecipados.

## Visualização Global

- [ ] Utilizar The Graph ou APIs blockchain para visualizar contratos de assinatura sem centralização.