import request from 'supertest';
import app from '../src/server.js';
import jwt from 'jsonwebtoken';

describe('Forms Routes', () => {
  let authToken

  beforeAll(() => {
    // Create a test JWT token
    authToken = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET || 'test-secret')
  })

  describe('POST /api/forms/:id/submit', () => {
    it('should validate required fields', async () => {
      // Mock form data
      const mockForm = {
        _id: 'form123',
        name: 'Test Form',
        fields: [
          {
            fieldId: 'fld1',
            fieldName: 'Name',
            questionLabel: 'Your Name',
            type: 'short_text',
            required: true,
            order: 0
          },
          {
            fieldId: 'fld2',
            fieldName: 'Email',
            questionLabel: 'Your Email',
            type: 'short_text',
            required: false,
            order: 1
          }
        ]
      }

      // Mock Form.findById
      const { default: Form } = await import('../src/models/Form.js');
      Form.findById = jest.fn().mockResolvedValue({
        ...mockForm,
        populate: jest.fn().mockReturnThis()
      })

      const response = await request(app)
        .post('/api/forms/form123/submit')
        .send({
          answers: {
            fld2: 'test@example.com'
            // Missing required fld1
          }
        })
        .expect(400)

      expect(response.body.error).toBe('Validation failed')
      expect(response.body.errors).toContain('Your Name is required')
    })
  })
})