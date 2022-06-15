# CDK × Prisma auto migrate example project

This project is example of CDK × Prisma.  
If you modify `prisma.schema` and `prisma generate`,
this project will auto detect and execute migrate every schema changes.

## Quickstart

You can open in Visual Studio Code and use Remote Contaier extension,
then you get develop container and mysql container.

### Initial deploy

```bash
yarn install
yarn prisma migrate dev --name init
yarn cdk deploy
```

### Modify schema

Please edit `prisma/schema.prisma`.

### Redeploy

```bash
yarn prisma migrate dev --name second
yarn cdk deploy
```

You will get migrated tables!!

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
