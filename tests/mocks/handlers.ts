import { HttpResponse, http } from 'msw';

export const handlers = [
  http.post('http://localhost:4000/api/code', async ({ request }) => {
    const data = await request.formData()
    const code = data.get('code')
    return HttpResponse.json({ success: true })
  })
];