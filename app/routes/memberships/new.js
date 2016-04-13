import Ember from 'ember';
import config from 'webapp/config/environment';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  ajax: service('ajax'),

  titleToken() {
    return this.get('i18n').t('titles.memberships.new');
  },

  model(params) {
    if (params.beta) {
      return this.get('ajax').request('api/payment/token');
    }
  },

  setupController(controller, result) {
    if (result) {
      controller.set('token', result.token);
    }
  },

  actions: {
    /**
     * Initializes a payment flow with PayPal.
     * @param {String} itemCode The item code (WO1, WO2, ...).
     * @param {String} [shippingRegion] The region where the booklet should be sent.
     */
    initPayment(itemCode, shippingRegion) {

      // Do not continue if no item code was specified
      if (!itemCode) {
        this.get('notify').error(this.get('i18n').t('notify.noItemCode'));
        return;
      }

      // Build the base URL
      let url = `${config.SERVER_BASE_URL}/api/payment/start?itemCode=${itemCode}`;

      // Add shipping fee code if present
      if (shippingRegion) {
        url += `&shippingRegion=${shippingRegion}`;
      }

      // Redirect to server payment route in order to get redirected to PayPal
      window.location.replace(url);
    },
    
    /**
     * Process a payment.
     * @param {Object} payment The payment object.
     */
    processPayment(payment) {
      
      payment.itemCode = this.controller.get('itemCode');
      payment.shippingRegion = this.controller.get('shippingRegion');

      // Do not continue if no item code was specified
      if (!payment.itemCode) {
        this.get('notify').error(this.get('i18n').t('notify.noItemCode'));
        return;
      }

      var promise = this.get('ajax').post('api/payment/checkout', { data: payment });

      promise.then(()=> {
        this.get('notify').success('Payment completed!');
      });
    },

    /**
     * Creates a membership (admin only).
     */
    createMembership() {
      let promise = this.controller.getNewMembership();

      promise = promise.then((newMembership)=> {
        return newMembership.save();
      });

      promise.then((createdMembership)=> {
        this.transitionTo('user.memberships', createdMembership.get('user'));
      });
    },

    membershipOptionChanged(membershipOption) {
      switch (membershipOption) {
        case 'WOB1':
        case 'WOB2':
          if (!this.controller.get('shippingRegion')) {
            this.controller.set('shippingRegion', 'FR');
          }
          break;
        default:
          this.controller.set('shippingRegion', null);
      }
    }
  }
});
