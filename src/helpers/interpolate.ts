import {template, templateSettings} from 'lodash';

/**
 * Template string interpolation
 */
export function interpolate(text: string, data: object): string {
  if (!text) return '';
  templateSettings.interpolate = /{{([\s\S]+?)}}/g;
  const executor = template(text);
  return executor(data);
}

/**
 * Template object interpolation
 */
export function interpolateObject<Template extends object>(
  template: Template,
  data: object
): Template {
  const result = {} as Template;
  if (!template || Object.keys(template).length === 0) {
    return result;
  }

  Object.keys(template).forEach(key => {
    const value = template[key];
    if (typeof value === 'string') {
      result[key] = interpolate(value.trim(), data);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = interpolateObject(value, data);
    } else {
      result[key] = value;
    }
  });

  return result;
}
