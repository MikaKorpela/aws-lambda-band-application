# aws-lambda-band-application

This project contains REST service for accessing band information from AWS DynamoDB.

## Build, Package and Deploy

sam build

sam package --output-template packaged.yaml --s3-bucket pikecape-band-application

sam deploy --template-file packaged.yaml --region eu-north-1 --capabilities CAPABILITY_IAM --stack-name band-application