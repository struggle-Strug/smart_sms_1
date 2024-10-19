class Validator {
  constructor() {
    this.errors = {};
  }

  required(value, fieldName, displayName) {
    if (this.errors[fieldName]) {
      return false;
    }

    if (!value) {
      this.errors[fieldName] = `${displayName}は必須項目なので、入力してください。`;
      return false;
    } else if (typeof value === 'string' && value.trim() === '') {
      this.errors[fieldName] = `${displayName}は必須項目なので、入力してください。`;
      return false;
    }
    delete this.errors[fieldName];
    return true;
  }


  maxLength(value, fieldName, displayName, maxLength = 255) {

    if (this.errors[fieldName]) {
      return false;
    }

    if (value.length > maxLength) {
      this.errors[fieldName] = `${displayName}は${maxLength}文字以内で入力してください。`;
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
