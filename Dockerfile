FROM node:16 AS builder

RUN yarn global add typescript && yarn add -D @types/node @types/aws-lambda
COPY lib/migrate/index.ts ./
RUN tsc index.ts

FROM public.ecr.aws/lambda/nodejs:16

COPY --from=builder index.js ${LAMBDA_TASK_ROOT}/
COPY prisma ${LAMBDA_TASK_ROOT}/
RUN npm i -g prisma

CMD [ "index.handler" ]