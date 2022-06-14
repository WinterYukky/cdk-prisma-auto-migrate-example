import { CustomResource, Duration, Stack, StackProps } from "aws-cdk-lib";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { DockerImageCode, DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import { DatabaseClusterEngine, ServerlessCluster } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import * as customresources from "aws-cdk-lib/custom-resources";
import { readdirSync } from "fs";

export class PrismaLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "Vpc", {
      natGateways: 0,
    });

    const db = new ServerlessCluster(this, "Database", {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      defaultDatabaseName: "example",
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      enableDataApi: true,
    });
    if (!db.secret) {
      throw new Error("DB not use secret");
    }

    const migrateFunction = new DockerImageFunction(this, "MigrateDocker", {
      vpc,
      timeout: Duration.minutes(5),
      code: DockerImageCode.fromImageAsset("."),
      environment: {
        DB_CONNECTION: db.secret.secretValue.unsafeUnwrap(),
      },
    });
    db.connections.allowDefaultPortFrom(migrateFunction);

    // lambda will migrate every schema changes
    const provider = new customresources.Provider(this, "Provider", {
      onEventHandler: migrateFunction,
    });
    const lastMigrationId = readdirSync("prisma/migrations")
      .filter((name) => name !== "migration_lock.toml")
      .sort()
      .reverse()[0];
    new CustomResource(this, "Custom::Migration", {
      serviceToken: provider.serviceToken,
      properties: {
        lastMigrationId,
      },
    });
  }
}
