import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { HitCounter } from './hitcounter';

export class SimpleAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new cdk.aws_lambda.Function(this, 'HelloHandler', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      code: cdk.aws_lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler'
    });

    const counter = new HitCounter(this, 'HelloHitCounter',{
      downstream: lambda
    });

    new apigw.LambdaRestApi(this, 'EndPoint', {
      handler: counter.handler
    });

  }
}
