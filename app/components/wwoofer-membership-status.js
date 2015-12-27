import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({

  user: null,

  classNames: ['panel'],
  classNameBindings: ['panelClass'],

  /**
   * Returns the CSS class of the panel based on the wwoofer's membership status.
   */
  panelClass: computed('user.hasWwooferMemberships', 'user.latestWwooferMembership.isStillValidInAMonth', function() {
    var hasWwooferMemberships = this.get('user.hasWwooferMemberships');
    var stillGoodInAMonth = this.get('user.latestWwooferMembership.isStillValidInAMonth');

    var panelClass = 'panel-success';
    if (!hasWwooferMemberships) {
      panelClass = 'panel-warning';
    } else if (!stillGoodInAMonth) {
      panelClass = 'panel-warning';
    }

    return panelClass;
  })
});
