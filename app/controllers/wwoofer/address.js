import Ember from 'ember';
import { translationMacro as t } from "ember-i18n";

const { computed } = Ember;

export default Ember.Controller.extend({

  countriesService: Ember.inject.service('countries'),
  departmentsService: Ember.inject.service('departments'),

  countries: computed.readOnly('countriesService.sortedCountries'),

  instructions: t('address.form.wwooferInstructions'),

  actions: {
    saveAddress() {

      var wwoofer = this.get('wwoofer');
      var address = this.get('address');
      var isNewAddress = address.get('isNew');

      // Validate the address
      var promise = address.validate();

      promise.then(()=> {

        // Create or update the address
        promise = address.save();

        // Set the wwoofer's address (now that it has a valid id), then update the wwoofer
        if (isNewAddress) {
          promise = promise.then(()=> {
            wwoofer.set('address', address);
            return wwoofer.save();
          });
        }

        promise.then(()=> {
          alertify.success(this.get('i18n').t('notify.addressSaved'));
          if (isNewAddress) {
            var itemCode = Ember.isPresent(wwoofer.get('lastName2')) ? 'WO2' : 'WO1';
            this.transitionToRoute('memberships.new', { queryParams: { type: 'W', itemCode: itemCode } });
          }
        });
      }).catch(()=> {
        alertify.error(this.get('i18n').t('notify.submissionInvalid'));
      });
    }
  }
});