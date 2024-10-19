class Validator {
    constructor() {
      this.errors = {};
    }
  
    required(value, fieldName, displayName) {
      if (!value || value.trim() === '') {
        this.errors[fieldName] = `${displayName}は必須項目なので、入力してください。`;
        return false;
      }
      delete this.errors[fieldName];
      return true;
    }
  
    
    getErrors() {
      return this.errors;
    }
  
    getError(fieldName) {
      return this.errors[fieldName];
    }
  
    hasErrors() {
      return Object.keys(this.errors).length > 0;
    }
  }
  
  export default Validator;
  