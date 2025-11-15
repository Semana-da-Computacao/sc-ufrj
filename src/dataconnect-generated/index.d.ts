import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ActivitySpeaker_Key {
  activityId: UUIDString;
  speakerId: UUIDString;
  __typename?: 'ActivitySpeaker_Key';
}

export interface Activity_Key {
  id: UUIDString;
  __typename?: 'Activity_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  displayName: string;
  email: string;
  ufrjId?: string | null;
}

export interface EventDay_Key {
  id: UUIDString;
  __typename?: 'EventDay_Key';
}

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

export interface ListActivitiesForEventDayVariables {
  eventDayId: UUIDString;
}

export interface RegisterUserForActivityData {
  registration_insert: Registration_Key;
}

export interface RegisterUserForActivityVariables {
  activityId: UUIDString;
}

export interface Registration_Key {
  userId: UUIDString;
  activityId: UUIDString;
  __typename?: 'Registration_Key';
}

export interface Speaker_Key {
  id: UUIDString;
  __typename?: 'Speaker_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface ListActivitiesForEventDayRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListActivitiesForEventDayVariables): QueryRef<ListActivitiesForEventDayData, ListActivitiesForEventDayVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListActivitiesForEventDayVariables): QueryRef<ListActivitiesForEventDayData, ListActivitiesForEventDayVariables>;
  operationName: string;
}
export const listActivitiesForEventDayRef: ListActivitiesForEventDayRef;

export function listActivitiesForEventDay(vars: ListActivitiesForEventDayVariables): QueryPromise<ListActivitiesForEventDayData, ListActivitiesForEventDayVariables>;
export function listActivitiesForEventDay(dc: DataConnect, vars: ListActivitiesForEventDayVariables): QueryPromise<ListActivitiesForEventDayData, ListActivitiesForEventDayVariables>;

interface RegisterUserForActivityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterUserForActivityVariables): MutationRef<RegisterUserForActivityData, RegisterUserForActivityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RegisterUserForActivityVariables): MutationRef<RegisterUserForActivityData, RegisterUserForActivityVariables>;
  operationName: string;
}
export const registerUserForActivityRef: RegisterUserForActivityRef;

export function registerUserForActivity(vars: RegisterUserForActivityVariables): MutationPromise<RegisterUserForActivityData, RegisterUserForActivityVariables>;
export function registerUserForActivity(dc: DataConnect, vars: RegisterUserForActivityVariables): MutationPromise<RegisterUserForActivityData, RegisterUserForActivityVariables>;

interface GetUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserProfileData, undefined>;
  operationName: string;
}
export const getUserProfileRef: GetUserProfileRef;

export function getUserProfile(): QueryPromise<GetUserProfileData, undefined>;
export function getUserProfile(dc: DataConnect): QueryPromise<GetUserProfileData, undefined>;

