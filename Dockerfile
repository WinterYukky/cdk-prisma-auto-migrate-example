FROM public.ecr.aws/lambda/nodejs

COPY prisma lib/migrate/index.ts ${LAMBDA_TASK_ROOT}/
RUN npm i -g prisma typescript && npm i --save-dev @types/node @types/aws-lambda
RUN tsc index.ts && rm -Rf node_modules

CMD [ "index.handler" ]