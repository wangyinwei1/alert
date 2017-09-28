import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';

let store = {}

class ValidateStore {

  constructor(meta) {
    this.fields = meta
  }

  setFields(fields) {
    Object.assign(this.fields, fields)
  }

  getFieldsStore() {
    return this.fields
  }

  getFieldsValue(key) {
    if (has(this.fields, `${key}.metaValue.value`)) {
      return get(this.fields, `${key}.metaValue.value`)
    }
    console.warn(`No such ${key} of value`)
  }

  getFieldValidate(key) {
    if (has(this.fields, `${key}.validate`)) {
      return {
        status: get(this.fields, `${key}.validate.status`),
        message: get(this.fields, `${key}.validate.message`)
      }
    }
  }

  hasRules(key) {
    return has(this.fields, `${key}.metaValue.rules`) && get(this.fields, `${key}.metaValue.rules`).length
  }

  getFieldRules(key) {
    if (has(this.fields, `${key}.metaValue`)) {
      return get(this.fields, `${key}.metaValue.rules`)
    }
    console.warn(`No such field like ${key}`)
  }

  setFieldsValue(key, value) {
    set(this.fields, `${key}.metaValue`, value)
  }
}

function createValidateStore(fields) {
  store = new ValidateStore(fields)
}

function getFieldsValue(key) {
  return store.getFieldsValue(key)
}

function setFieldsValue(key, value) {
  return store.setFieldsValue(key, value)
}

function getFieldValidate(key) {
  return store.getFieldValidate(key)
}

function getFieldRules(key) {
  return store.getFieldRules(key)
}

function getFieldsStore() {
  return store.getFieldsStore()
}

function hasRules(key) {
  return store.hasRules(key)
}

function setFields(fields) {
  store.setFields(fields)
}

export default {
  createValidateStore,
  store: store,
  updateFieldsStore: createValidateStore,
  getFieldValidate: getFieldValidate,
  getFieldsValue: getFieldsValue,
  setFieldsValue: setFieldsValue,
  getFieldRules: getFieldRules,
  getFieldsStore: getFieldsStore,
  hasRules: hasRules,
  setFields: setFields
}

