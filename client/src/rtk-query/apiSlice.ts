import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: '/api'}),
    endpoints: builder => ({
        signup : builder.mutation({
            query: data => ({
                url: '/auth/signup',
                method: 'POST',
                body: data
            })
        }),
        signin : builder.mutation({
            query: data => ({
                url: '/auth/signin',
                method: 'POST',
                body: data
            }),
        }),
        getContacts : builder.query({
            query: () => '/user/friends'
        }),
        getuserchats : builder.mutation({
            query: () => ({
                url: '/chat/getuserchats',
                method: 'GET',
            }),
        }),
    })
})

export const { useSignupMutation, useSigninMutation, useGetContactsQuery , useGetuserchatsMutation} = apiSlice;