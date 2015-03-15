/**
 * Ember route for hosts index.
 */
import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {

        // Render host.index view
        this.render('hosts/index');

        // Render hosts/map  view inside named outlet "map"
        this.render('hosts/map', {
            into: 'hosts/index',
            outlet: 'map',
            controller: 'hosts/index'
        });
    },
    deactivate: function() {
        this.set('controller.hostLayer.markers', null);
    }
});
