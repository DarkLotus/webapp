/**
 * Custom App REST adapter.
 */
import DS from 'ember-data';
import config from '../config/environment';

export default DS.RESTAdapter.extend({
  namespace: config.apiNamespace,
  host: config.apiHost
});
