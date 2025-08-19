// Evaluate conditional logic for form fields
export const evaluateConditionalLogic = (fields, answers) => {
  return fields.filter(field => {
    if (!field.showWhen || !field.showWhen.conditions || field.showWhen.conditions.length === 0) {
      return true // Show field if no conditions
    }

    const { conditions, mode } = field.showWhen
    const results = conditions.map(condition => {
      const fieldValue = answers[condition.fieldId]
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value
        case 'not_equals':
          return fieldValue !== condition.value
        case 'includes':
          return Array.isArray(fieldValue) && fieldValue.includes(condition.value)
        case 'not_includes':
          return !Array.isArray(fieldValue) || !fieldValue.includes(condition.value)
        default:
          return false
      }
    })

    return mode === 'all' ? results.every(r => r) : results.some(r => r)
  })
}

// Validate form answers
export const validateForm = (fields, answers) => {
  const errors = {}
  const visibleFields = evaluateConditionalLogic(fields, answers)
  
  for (const field of visibleFields) {
    if (field.required) {
      const value = answers[field.fieldId]
      if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
        errors[field.fieldId] = `${field.questionLabel} is required`
      }
    }
  }

  return errors
}