import { HttpResponse, http } from 'msw';

export const handlers = [
  http.post('/posts', async ({ request }) => {


    return HttpResponse.json({
      firstName: 'John',
      lastName: 'Maverick',
    })
  }),
]