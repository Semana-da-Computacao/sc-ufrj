# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListActivitiesForEventDay*](#listactivitiesforeventday)
  - [*GetUserProfile*](#getuserprofile)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*RegisterUserForActivity*](#registeruserforactivity)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListActivitiesForEventDay
You can execute the `ListActivitiesForEventDay` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listActivitiesForEventDay(vars: ListActivitiesForEventDayVariables): QueryPromise<ListActivitiesForEventDayData, ListActivitiesForEventDayVariables>;

interface ListActivitiesForEventDayRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListActivitiesForEventDayVariables): QueryRef<ListActivitiesForEventDayData, ListActivitiesForEventDayVariables>;
}
export const listActivitiesForEventDayRef: ListActivitiesForEventDayRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listActivitiesForEventDay(dc: DataConnect, vars: ListActivitiesForEventDayVariables): QueryPromise<ListActivitiesForEventDayData, ListActivitiesForEventDayVariables>;

interface ListActivitiesForEventDayRef {
  ...
  (dc: DataConnect, vars: ListActivitiesForEventDayVariables): QueryRef<ListActivitiesForEventDayData, ListActivitiesForEventDayVariables>;
}
export const listActivitiesForEventDayRef: ListActivitiesForEventDayRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listActivitiesForEventDayRef:
```typescript
const name = listActivitiesForEventDayRef.operationName;
console.log(name);
```

### Variables
The `ListActivitiesForEventDay` query requires an argument of type `ListActivitiesForEventDayVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListActivitiesForEventDayVariables {
  eventDayId: UUIDString;
}
```
### Return Type
Recall that executing the `ListActivitiesForEventDay` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListActivitiesForEventDayData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListActivitiesForEventDayData {
  activities: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    startTime: TimestampString;
    endTime: TimestampString;
    location: string;
    capacity?: number | null;
  } & Activity_Key)[];
}
```
### Using `ListActivitiesForEventDay`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listActivitiesForEventDay, ListActivitiesForEventDayVariables } from '@dataconnect/generated';

// The `ListActivitiesForEventDay` query requires an argument of type `ListActivitiesForEventDayVariables`:
const listActivitiesForEventDayVars: ListActivitiesForEventDayVariables = {
  eventDayId: ..., 
};

// Call the `listActivitiesForEventDay()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listActivitiesForEventDay(listActivitiesForEventDayVars);
// Variables can be defined inline as well.
const { data } = await listActivitiesForEventDay({ eventDayId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listActivitiesForEventDay(dataConnect, listActivitiesForEventDayVars);

console.log(data.activities);

// Or, you can use the `Promise` API.
listActivitiesForEventDay(listActivitiesForEventDayVars).then((response) => {
  const data = response.data;
  console.log(data.activities);
});
```

### Using `ListActivitiesForEventDay`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listActivitiesForEventDayRef, ListActivitiesForEventDayVariables } from '@dataconnect/generated';

// The `ListActivitiesForEventDay` query requires an argument of type `ListActivitiesForEventDayVariables`:
const listActivitiesForEventDayVars: ListActivitiesForEventDayVariables = {
  eventDayId: ..., 
};

// Call the `listActivitiesForEventDayRef()` function to get a reference to the query.
const ref = listActivitiesForEventDayRef(listActivitiesForEventDayVars);
// Variables can be defined inline as well.
const ref = listActivitiesForEventDayRef({ eventDayId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listActivitiesForEventDayRef(dataConnect, listActivitiesForEventDayVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.activities);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.activities);
});
```

## GetUserProfile
You can execute the `GetUserProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserProfile(): QueryPromise<GetUserProfileData, undefined>;

interface GetUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserProfileData, undefined>;
}
export const getUserProfileRef: GetUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserProfile(dc: DataConnect): QueryPromise<GetUserProfileData, undefined>;

interface GetUserProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetUserProfileData, undefined>;
}
export const getUserProfileRef: GetUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserProfileRef:
```typescript
const name = getUserProfileRef.operationName;
console.log(name);
```

### Variables
The `GetUserProfile` query has no variables.
### Return Type
Recall that executing the `GetUserProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserProfileData {
  user?: {
    id: UUIDString;
    displayName: string;
    email: string;
    ufrjId?: string | null;
    photoUrl?: string | null;
    isOrganizer?: boolean | null;
  } & User_Key;
}
```
### Using `GetUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserProfile } from '@dataconnect/generated';


// Call the `getUserProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserProfile(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserProfile().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserProfileRef } from '@dataconnect/generated';


// Call the `getUserProfileRef()` function to get a reference to the query.
const ref = getUserProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  displayName: string;
  email: string;
  ufrjId?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., 
  ufrjId: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ displayName: ..., email: ..., ufrjId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., 
  ufrjId: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ displayName: ..., email: ..., ufrjId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## RegisterUserForActivity
You can execute the `RegisterUserForActivity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registerUserForActivity(vars: RegisterUserForActivityVariables): MutationPromise<RegisterUserForActivityData, RegisterUserForActivityVariables>;

interface RegisterUserForActivityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterUserForActivityVariables): MutationRef<RegisterUserForActivityData, RegisterUserForActivityVariables>;
}
export const registerUserForActivityRef: RegisterUserForActivityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registerUserForActivity(dc: DataConnect, vars: RegisterUserForActivityVariables): MutationPromise<RegisterUserForActivityData, RegisterUserForActivityVariables>;

interface RegisterUserForActivityRef {
  ...
  (dc: DataConnect, vars: RegisterUserForActivityVariables): MutationRef<RegisterUserForActivityData, RegisterUserForActivityVariables>;
}
export const registerUserForActivityRef: RegisterUserForActivityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registerUserForActivityRef:
```typescript
const name = registerUserForActivityRef.operationName;
console.log(name);
```

### Variables
The `RegisterUserForActivity` mutation requires an argument of type `RegisterUserForActivityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegisterUserForActivityVariables {
  activityId: UUIDString;
}
```
### Return Type
Recall that executing the `RegisterUserForActivity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegisterUserForActivityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegisterUserForActivityData {
  registration_insert: Registration_Key;
}
```
### Using `RegisterUserForActivity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registerUserForActivity, RegisterUserForActivityVariables } from '@dataconnect/generated';

// The `RegisterUserForActivity` mutation requires an argument of type `RegisterUserForActivityVariables`:
const registerUserForActivityVars: RegisterUserForActivityVariables = {
  activityId: ..., 
};

// Call the `registerUserForActivity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registerUserForActivity(registerUserForActivityVars);
// Variables can be defined inline as well.
const { data } = await registerUserForActivity({ activityId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registerUserForActivity(dataConnect, registerUserForActivityVars);

console.log(data.registration_insert);

// Or, you can use the `Promise` API.
registerUserForActivity(registerUserForActivityVars).then((response) => {
  const data = response.data;
  console.log(data.registration_insert);
});
```

### Using `RegisterUserForActivity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registerUserForActivityRef, RegisterUserForActivityVariables } from '@dataconnect/generated';

// The `RegisterUserForActivity` mutation requires an argument of type `RegisterUserForActivityVariables`:
const registerUserForActivityVars: RegisterUserForActivityVariables = {
  activityId: ..., 
};

// Call the `registerUserForActivityRef()` function to get a reference to the mutation.
const ref = registerUserForActivityRef(registerUserForActivityVars);
// Variables can be defined inline as well.
const ref = registerUserForActivityRef({ activityId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registerUserForActivityRef(dataConnect, registerUserForActivityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.registration_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.registration_insert);
});
```

