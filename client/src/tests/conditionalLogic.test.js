import { evaluateConditionalLogic, validateForm } from '../utils/conditionalLogic'

describe('Conditional Logic', () => {
  const mockFields = [
    {
      fieldId: 'fld1',
      questionLabel: 'Role',
      type: 'single_select',
      required: true
    },
    {
      fieldId: 'fld2',
      questionLabel: 'Experience',
      type: 'short_text',
      required: false,
      showWhen: {
        conditions: [
          { fieldId: 'fld1', operator: 'equals', value: 'Developer' }
        ],
        mode: 'all'
      }
    },
    {
      fieldId: 'fld3',
      questionLabel: 'Skills',
      type: 'multi_select',
      required: false,
      showWhen: {
        conditions: [
          { fieldId: 'fld1', operator: 'equals', value: 'Developer' },
          { fieldId: 'fld2', operator: 'not_equals', value: '' }
        ],
        mode: 'all'
      }
    }
  ]

  describe('evaluateConditionalLogic', () => {
    it('should show all fields when no conditions are set', () => {
      const fieldsWithoutConditions = [
        { fieldId: 'fld1', questionLabel: 'Name' },
        { fieldId: 'fld2', questionLabel: 'Email' }
      ]

      const visible = evaluateConditionalLogic(fieldsWithoutConditions, {})
      expect(visible).toHaveLength(2)
    })

    it('should hide conditional fields when conditions are not met', () => {
      const answers = { fld1: 'Manager' }
      const visible = evaluateConditionalLogic(mockFields, answers)
      
      expect(visible).toHaveLength(1)
      expect(visible[0].fieldId).toBe('fld1')
    })

    it('should show conditional fields when conditions are met', () => {
      const answers = { fld1: 'Developer', fld2: '5 years' }
      const visible = evaluateConditionalLogic(mockFields, answers)
      
      expect(visible).toHaveLength(3)
    })

    it('should handle "any" mode correctly', () => {
      const fieldsWithAnyMode = [
        ...mockFields,
        {
          fieldId: 'fld4',
          questionLabel: 'Comments',
          showWhen: {
            conditions: [
              { fieldId: 'fld1', operator: 'equals', value: 'Manager' },
              { fieldId: 'fld1', operator: 'equals', value: 'Developer' }
            ],
            mode: 'any'
          }
        }
      ]

      const answers = { fld1: 'Manager' }
      const visible = evaluateConditionalLogic(fieldsWithAnyMode, answers)
      
      expect(visible.some(f => f.fieldId === 'fld4')).toBe(true)
    })
  })

  describe('validateForm', () => {
    it('should validate required fields', () => {
      const answers = { fld2: 'test' } // Missing required fld1
      const errors = validateForm(mockFields, answers)
      
      expect(Object.keys(errors)).toHaveLength(1)
      expect(errors.fld1).toContain('required')
    })

    it('should only validate visible fields', () => {
      const answers = { fld1: 'Manager' } // fld2 is hidden, so not required
      const errors = validateForm(mockFields, answers)
      
      expect(Object.keys(errors)).toHaveLength(0)
    })
  })
})