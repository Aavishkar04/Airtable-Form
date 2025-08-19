import AirtableAPI from '../src/utils/airtable.js';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('AirtableAPI', () => {
  let airtableAPI

  beforeEach(() => {
    airtableAPI = new AirtableAPI('test-token')
    axios.mockClear()
  })

  describe('getFields', () => {
    it('should filter unsupported field types', async () => {
      const mockResponse = {
        data: {
          tables: [{
            id: 'tbl123',
            fields: [
              { id: 'fld1', name: 'Name', type: 'singleLineText' },
              { id: 'fld2', name: 'Email', type: 'email' }, // Should be filtered out
              { id: 'fld3', name: 'Role', type: 'singleSelect', options: { choices: [{ name: 'Admin' }] } },
              { id: 'fld4', name: 'Date', type: 'date' }, // Should be filtered out
              { id: 'fld5', name: 'Files', type: 'multipleAttachments' }
            ]
          }]
        }
      }

      axios.mockResolvedValue(mockResponse)

      const fields = await airtableAPI.getFields('base123', 'tbl123')

      expect(fields).toHaveLength(3)
      expect(fields.map(f => f.type)).toEqual(['short_text', 'single_select', 'attachment'])
      expect(fields.find(f => f.type === 'single_select').options).toEqual(['Admin'])
    })
  })

  describe('createRecord', () => {
    it('should format request correctly', async () => {
      const mockResponse = {
        data: {
          records: [{ id: 'rec123', fields: { Name: 'Test' } }]
        }
      }

      axios.mockResolvedValue(mockResponse)

      const result = await airtableAPI.createRecord('base123', 'tbl123', { Name: 'Test' })

      expect(axios).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.airtable.com/v0/base123/tbl123',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        data: {
          records: [{ fields: { Name: 'Test' } }]
        }
      })

      expect(result.id).toBe('rec123')
    })
  })
})