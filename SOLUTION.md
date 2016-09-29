## Error Codes

Error Code  | Error Message   | Relevant Resources  | Parameters
----------- | ----------|------------ |-----
1001 | Invalid resource name {0} given  | All Resources  | `0 - Resource Name`
1002 | Invalid Indentifier for resource name {0} given | All Resources | `0 - Resource Name`
1003 | Invalid Property {0} for resource name {1} given | All Resources | `0 - Property` , `1 - Resource Name` 
1004 | Error while trying to insert resource name {0} with value {1} into the database" | All Resources | `0 - Resource Name`, `1 - Value`
1005 | Error while trying to read resource name {0} from the database | All Resources | `0 - Resource Name`
1006 | Error while trying to delete resource {0} from the database | All Resources | `0 - Resource Name`
1007 | Error while inserting resource name {0} to database, duplicate object | All Resources | `0 - Resource Name`
1008 | Error while updating resource name {0} | All Resources | `0 - Resource Name`

# Test Cases
```
Lavanyas-MacBook:transportation-express-api lavanyagh$ ./node_modules/.bin/mocha -u exports tests
Service running on port 8080


  1) car_should_return_cars
[Error: expected 200 "OK", got 400 "Bad Request"]
{ statusCode: 400,
  errorCode: 1002,
  errorMessage: 'Invalid Indentifier for resource name Car given, Resource Not Found' }
  2) car_should_return_json
[Error: expected 200 "OK", got 400 "Bad Request"]
{ statusCode: 400,
  errorCode: 1001,
  errorMessage: 'Invalid resource name car given car' }
  ✓ car_should_create_car
  3) car_create_action_should_retrieve_data

  1 passing (127ms)
  3 failing


```

# Preview

![Image1](images/image1.png)
![Image2](images/image2.png)
![Image3](images/image3.png)
![Image4](images/image4.png)
![Image5](images/image5.png)
![Image6](images/image6.png)