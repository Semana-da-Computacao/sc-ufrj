import { CreateUserData, CreateUserVariables, ListActivitiesForEventDayData, ListActivitiesForEventDayVariables, RegisterUserForActivityData, RegisterUserForActivityVariables, GetUserProfileData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useListActivitiesForEventDay(vars: ListActivitiesForEventDayVariables, options?: useDataConnectQueryOptions<ListActivitiesForEventDayData>): UseDataConnectQueryResult<ListActivitiesForEventDayData, ListActivitiesForEventDayVariables>;
export function useListActivitiesForEventDay(dc: DataConnect, vars: ListActivitiesForEventDayVariables, options?: useDataConnectQueryOptions<ListActivitiesForEventDayData>): UseDataConnectQueryResult<ListActivitiesForEventDayData, ListActivitiesForEventDayVariables>;

export function useRegisterUserForActivity(options?: useDataConnectMutationOptions<RegisterUserForActivityData, FirebaseError, RegisterUserForActivityVariables>): UseDataConnectMutationResult<RegisterUserForActivityData, RegisterUserForActivityVariables>;
export function useRegisterUserForActivity(dc: DataConnect, options?: useDataConnectMutationOptions<RegisterUserForActivityData, FirebaseError, RegisterUserForActivityVariables>): UseDataConnectMutationResult<RegisterUserForActivityData, RegisterUserForActivityVariables>;

export function useGetUserProfile(options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, undefined>;
export function useGetUserProfile(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, undefined>;
