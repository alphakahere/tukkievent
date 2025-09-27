// src/store/api/eventsApi.ts

import { createApi,  } from '@reduxjs/toolkit/query/react';
import { EventInput } from './event.type';
import { baseQuery } from '../baseQuery';


export const eventApi = createApi({
  reducerPath: 'eventApi',

  baseQuery: baseQuery,

  // Définition des endpoints
  endpoints: (builder) => ({
    getEvents: builder.query<Event[], void>({
      query: () => 'events',
    }),

    addEvent: builder.mutation<Event, EventInput>({
      query: (newEvent) => ({
        url: 'events',
        method: 'POST',
        body: newEvent,
      }),
    }),
  }),
});

export const { useGetEventsQuery, useAddEventMutation } = eventApi;