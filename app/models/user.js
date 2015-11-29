/**
 * Ember model for users.
 */
import Ember from 'ember';
import DS from 'ember-data';
import ValidationsMixin from '../mixins/validations';
import Regex from '../utils/regex';

export default DS.Model.extend(ValidationsMixin, {

  // Attributes
  email: DS.attr('string'),
  password: DS.attr('string'), // Only used for sign up
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  birthDate: DS.attr('string'),
  phone: DS.attr('string'),
  isAdmin: DS.attr('boolean'),
  isSuspended: DS.attr('boolean'),
  locale: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  photo: DS.attr('string'),

  // Relationships
  host: DS.belongsTo('host', { async: true }),
  wwoofer: DS.belongsTo('wwoofer', { async: true }),
  memberships: DS.hasMany('membership', { async: true }),

  // Computed properties
  completePhotoUrl: function() {
    var photo = this.get('photo');
    if (!Ember.isEmpty(photo)) {
      return 'https://s3.amazonaws.com/wwoof-france/photos/users/' + encodeURIComponent(photo);
    } else {
      return '../assets/images/no-photo.png';
    }
  }.property('photo'),

  isNotAdmin: Ember.computed.not('isAdmin'),

  /**
   * Returns the full name of the user.
   */
  fullName: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName'),

  // Order memberships by expiration date (most recent first)
  expireAtSortingDesc: ['expireAt:desc'],
  sortedMemberships: Ember.computed.sort('memberships', 'expireAtSortingDesc'),

  wwoofMemberships: Ember.computed.filterBy('sortedMemberships', 'type', 'W'),

  hostMemberships: Ember.computed.filterBy('sortedMemberships', 'type', 'H'),

  hasMemberships: Ember.computed.notEmpty('sortedMemberships'),

  hasWwoofMemberships: Ember.computed.notEmpty('wwoofMemberships'),

  hasHostMemberships: Ember.computed.notEmpty('hostMemberships'),

  /**
   * Returns the user's most recent membership.
   */
  latestMembership: Ember.computed.alias('sortedMemberships.firstObject'),

  /**
   * Returns the user's most recent Wwoof membership.
   */
  latestWwoofMembership: Ember.computed.alias('wwoofMemberships.firstObject'),

  /**
   * Returns the user's most recent Host membership.
   */
  latestHostMembership: Ember.computed.alias('hostMemberships.firstObject'),

  /**
   * Indicates whether the user's most recent Wwoof membership is not expired.
   */
  hasNonExpiredWwoofMembership: Ember.computed.and('hasWwoofMemberships', 'latestWwoofMembership.isNotExpired'),

  /**
   * Indicates whether the user's most recent Host membership is not expired.
   */
  hasNonExpiredHostMembership: Ember.computed.and('hasHostMemberships', 'latestHostMembership.isNotExpired'),

  /**
   * Indicates whether the user's most recent membership is not expired.
   */
  hasNonExpiredMembership: Ember.computed.and('hasMemberships', 'latestMembership.isNotExpired'),

  // Validations
  validations: {
    email: {
      presence: true,
      format: {
        'with': Regex.EMAIL_ADDRESS
      }
    },
    password: {
      presence: {
        'if': 'isNew'
      },
      length: { 'if': 'isNew', minimum: 8, maximum: 25 }
    },
    firstName: {
      presence: true,
      length: { maximum: 255 }
    },
    lastName: {
      presence: true,
      length: { maximum: 255 }
    },
    birthDate: {
      presence: {
        'if': 'isNew' // legacy users do not have a birth date
      }
    }
  }
});
