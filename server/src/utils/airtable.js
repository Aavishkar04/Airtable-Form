const axios = require('axios');

class AirtableAPI {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://api.airtable.com/v0';
  }

  async makeRequest(method, url, data = null) {
    try {
      const config = {
        method,
        url: `${this.baseURL}${url}`,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Airtable API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'Airtable API request failed');
    }
  }

  async getBases() {
    console.log('AirtableAPI: Making request to /meta/bases');
    const response = await this.makeRequest('GET', '/meta/bases');
    console.log('AirtableAPI: Response received, bases count:', response.bases ? response.bases.length : 'N/A');
    return response.bases;
  }

  async getTables(baseId) {
    const response = await this.makeRequest('GET', `/meta/bases/${baseId}/tables`);
    return response.tables;
  }

  async getFields(baseId, tableId) {
    const tables = await this.getTables(baseId);
    const table = tables.find(t => t.id === tableId);
    
    if (!table) {
      throw new Error('Table not found');
    }

    // Filter to only supported field types
    const supportedTypes = {
      'singleLineText': 'short_text',
      'multilineText': 'long_text',
      'singleSelect': 'single_select',
      'multipleSelects': 'multi_select',
      'multipleAttachments': 'attachment'
    };

    const supportedFields = table.fields
      .filter(field => supportedTypes[field.type])
      .map(field => ({
        id: field.id,
        name: field.name,
        type: supportedTypes[field.type],
        options: field.options?.choices?.map(choice => choice.name) || []
      }));

    return supportedFields;
  }

  async createRecord(baseId, tableId, fields) {
    const url = `/${baseId}/${tableId}`;
    const data = {
      records: [{
        fields
      }]
    };

    const response = await this.makeRequest('POST', url, data);
    return response.records[0];
  }
}

module.exports = AirtableAPI;