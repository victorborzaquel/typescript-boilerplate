import {capitalize} from '@/helpers/capitalize';
import {interpolate} from '@/helpers/interpolate';
import {createSlugFromText} from '@/helpers/slug';
import {createRoute} from '../lib/http';

export const teste = createRoute({
  handler: () =>
    createSlugFromText(
      capitalize(interpolate('Hello, {{name}}! ola victor', {name: 'World'}))
    ),
});
