// #region Validates objects with custom components

/**
 * Validates the components' attributes
 *
 * @param {Array<Object>} value Elements of the component
 * @param {Array<string>} requiredAttributes Required properties for each element
 *
 * Returns true if it passes the validation and false otherwise
 */
export const customComponentsValidation = (
  value: Array<Object>,
  requiredAttributes: Array<string>
): boolean => {
  const arr: Array<Object> = [...value];
  const ra: Array<string> = [...requiredAttributes];
  let validate: boolean = true;

  for (let i = 0; i < arr.length; i++) {
    const e: Object = arr[i];
    if (e === null || e.constructor !== Object) {
      validate = false;
      break;
    } else {
      for (const k in e) {
        const index: number = ra.indexOf(k);
        if (index > -1) ra.splice(index, 1);
        if (ra.length < 1) break;
      }

      if (ra.length > 0) validate = false;
    }
  }

  return validate;
};

// #endregion

// #region VeeValidate configuration

import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  configure,
} from "vee-validate";
import {
  required,
  min,
  max,
  alpha,
  alpha_spaces,
  email,
  regex,
  confirmed,
  numeric,
} from "@vee-validate/rules";
import type { App } from "vue";

export const veeValidatePlugin = {
  install(app: App<Element>) {
    // globally registering the VeeValidate's form and field components
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);

    // registering validation rules from the package
    defineRule("required", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha", alpha);
    defineRule("alpha_spaces", alpha_spaces);
    defineRule("email", email);
    defineRule("regexUrl", regex);
    defineRule("regexPassword", regex);
    defineRule("confirmed", confirmed);
    defineRule("regexDate", regex);
    defineRule("numeric", numeric);

    // configuring error messages
    configure({
      generateMessage: (ctx): string => {
        const messages = {
          required: `The ${ctx.field} field is required`,
          min: `The ${ctx.field} field is too short`,
          max: `The ${ctx.field} field is too long`,
          alpha: `The ${ctx.field} field may only contain characters`,
          alpha_spaces: `The ${ctx.field} field may only contain characters and spaces`,
          email: `The ${ctx.field} field must be a valid email`,
          regexUrl: `The ${ctx.field} field must be a valid url`,
          regexPassword: `The ${ctx.field} field must have at least 8 characters,
            at least one uppercase, one lowercase, one digit and one special character (!@#$%^&*()_)`,
          confirmed: `The ${ctx.field} should match the password field`,
          regexDate: `The ${ctx.field} field must be a valid date between 1920 and 2099`,
          numeric: `The ${ctx.field} field must be a valid number`,
        };

        const message: string = ctx.rule
          ? messages[ctx.rule.name as keyof typeof messages]
          : `The field ${ctx.field} is invalid`;

        return message;
      },
    });
  },
};

// #endregion
