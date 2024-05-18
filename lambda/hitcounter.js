const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

exports.handler = async function (event) {
    console.log("request:", JSON.stringify(event, undefined, 2));
    const dynamodb = new DynamoDBClient({});
    
    const command = new UpdateItemCommand({
        TableName: process.env.HITS_TABLE_NAME,
        Key: { path: { S: event.path } },
        UpdateExpression: 'ADD hits :incr',
        ExpressionAttributeValues: { ':incr': { N: '1' } }
    });

    await dynamodb.send(command);

    const lambda = new LambdaClient({});

    const invoke = new InvokeCommand({
        FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
        Payload: JSON.stringify(event)
    });

    const resp = await lambda.send(invoke);
    console.log('downstream response:', JSON.stringify(resp, undefined, 2));
    return resp.Payload;

}