const request = require('supertest')
const app = require('../src/server')

describe('Auth Routes', () => {
  describe('GET /auth/airtable/login', () => {
    it('should redirect to Airtable OAuth URL', async () => {
      const response = await request(app)
        .get('/auth/airtable/login')
        .expect(302)

      expect(response.headers.location).toContain('airtable.com/oauth2/v1/authorize')
      expect(response.headers.location).toContain('client_id')
      expect(response.headers.location).toContain('state')
    })
  })

  describe('GET /auth/airtable/callback', () => {
    it('should return error for missing code', async () => {
      const response = await request(app)
        .get('/auth/airtable/callback?state=test')
        .expect(400)

      expect(response.body.error).toContain('Authorization code not provided')
    })

    it('should return error for invalid state', async () => {
      const response = await request(app)
        .get('/auth/airtable/callback?code=test&state=invalid')
        .expect(400)

      expect(response.body.error).toContain('Invalid state parameter')
    })
  })
})